const SANDBOX_URL = "/api/sandbox";

export interface ExecResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  success: boolean;
}

export interface CodeResult {
  results: { text: string }[];
  stdout: string;
  stderr: string;
}

function getSandboxId(): string {
  let id = sessionStorage.getItem("sandbox_id");
  if (!id) {
    id = `sb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    sessionStorage.setItem("sandbox_id", id);
  }
  return id;
}

export async function execCommand(command: string): Promise<ExecResult> {
  const res = await fetch(`${SANDBOX_URL}/exec`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sandboxId: getSandboxId(), command }),
  });
  if (!res.ok) {
    const err = await res.text();
    return { stdout: "", stderr: `Error: ${err}`, exitCode: 1, success: false };
  }
  return res.json();
}

export async function runCode(code: string, language = "python"): Promise<CodeResult> {
  const res = await fetch(`${SANDBOX_URL}/code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sandboxId: getSandboxId(), code, language }),
  });
  if (!res.ok) {
    const err = await res.text();
    return { results: [], stdout: "", stderr: `Error: ${err}` };
  }
  return res.json();
}

export async function writeFile(filePath: string, content: string): Promise<boolean> {
  const res = await fetch(`${SANDBOX_URL}/file`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sandboxId: getSandboxId(), action: "write", filePath, content }),
  });
  return res.ok;
}

export async function readFile(filePath: string): Promise<string | null> {
  const res = await fetch(`${SANDBOX_URL}/file`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sandboxId: getSandboxId(), action: "read", filePath }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.content;
}

export async function listFiles(filePath = "/workspace"): Promise<string[]> {
  const res = await fetch(`${SANDBOX_URL}/file`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sandboxId: getSandboxId(), action: "list", filePath }),
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.files;
}

export async function destroySandbox(): Promise<void> {
  await fetch(`${SANDBOX_URL}/destroy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sandboxId: getSandboxId() }),
  });
  sessionStorage.removeItem("sandbox_id");
}
