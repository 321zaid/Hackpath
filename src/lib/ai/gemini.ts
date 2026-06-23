const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

type AnswerLength = "short" | "medium" | "detailed";

const LENGTH_CONFIG: Record<AnswerLength, { maxOutputTokens: number; temperature: number }> = {
  short: { maxOutputTokens: 512, temperature: 0.5 },
  medium: { maxOutputTokens: 2048, temperature: 0.7 },
  detailed: { maxOutputTokens: 4096, temperature: 0.8 },
};

function buildRequestBody(
  prompt: string,
  systemInstruction?: string,
  length: AnswerLength = "medium",
) {
  const contents: { role: string; parts: { text: string }[] }[] = [];
  if (systemInstruction) {
    contents.push({
      role: "user",
      parts: [{ text: systemInstruction }],
    });
    contents.push({
      role: "model",
      parts: [{ text: "Understood. I will follow those instructions." }],
    });
  }
  contents.push({ role: "user", parts: [{ text: prompt }] });

  const config = LENGTH_CONFIG[length];

  return {
    contents,
    generationConfig: {
      temperature: config.temperature,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: config.maxOutputTokens,
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
    ],
  };
}

export async function generateAnswer(
  prompt: string,
  systemInstruction?: string,
  length: AnswerLength = "medium",
): Promise<string> {
  if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not set");

  const body = buildRequestBody(prompt, systemInstruction, length);

  const res = await fetch(
    `${API_BASE}/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error: ${res.status} ${err}`);
  }

  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response generated.";
}

export function detectAnswerLength(question: string): AnswerLength {
  const q = question.toLowerCase();
  if (
    /\b(short|brief|quickly|tl;dr|summary|summarize|in short|briefly)\b/.test(q)
  ) {
    return "short";
  }
  if (
    /\b(detailed|deep|thorough|explain in detail|elaborate|comprehensive|in depth|full explanation)\b/.test(q)
  ) {
    return "detailed";
  }
  return "medium";
}

export async function generateChat(
  messages: { role: "user" | "model"; text: string }[],
  systemInstruction?: string,
  length: AnswerLength = "medium",
): Promise<string> {
  if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not set");

  const contents: { role: string; parts: { text: string }[] }[] = [];

  if (systemInstruction) {
    contents.push({
      role: "user",
      parts: [{ text: systemInstruction }],
    });
    contents.push({
      role: "model",
      parts: [{ text: "Understood. I will follow those instructions carefully." }],
    });
  }

  for (const msg of messages) {
    contents.push({ role: msg.role, parts: [{ text: msg.text }] });
  }

  const config = LENGTH_CONFIG[length];

  const res = await fetch(
    `${API_BASE}/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: config.temperature,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: config.maxOutputTokens,
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
        ],
      }),
    },
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error: ${res.status} ${err}`);
  }

  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response generated.";
}

export async function generateAnswerStream(
  prompt: string,
  systemInstruction?: string,
  length: AnswerLength = "medium",
): Promise<ReadableStream<Uint8Array>> {
  if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not set");

  const body = buildRequestBody(prompt, systemInstruction, length);

  const res = await fetch(
    `${API_BASE}/gemini-2.5-flash:streamGenerateContent?key=${GEMINI_API_KEY}&alt=sse`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error: ${res.status} ${err}`);
  }

  if (!res.body) throw new Error("No response body");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  return new ReadableStream({
    async start(controller) {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const jsonStr = line.slice(6).trim();
              if (!jsonStr || jsonStr === "[DONE]") continue;
              try {
                const data = JSON.parse(jsonStr);
                const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                  controller.enqueue(
                    new TextEncoder().encode(
                      `data: ${JSON.stringify({ type: "delta", text })}\n\n`,
                    ),
                  );
                }
              } catch { /* skip malformed JSON */ }
            }
          }
        }
      } catch {
        controller.enqueue(
          new TextEncoder().encode(
            `data: ${JSON.stringify({ type: "error", message: "Stream interrupted" })}\n\n`,
          ),
        );
      } finally {
        controller.close();
      }
    },
  });
}
