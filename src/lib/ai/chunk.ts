import { curriculum } from "@/data/curriculum";

export interface KnowledgeChunk {
  content: string;
  source: string;
  chunkType: "lesson" | "lab" | "quiz" | "reference";
  weekId: number;
  metadata: Record<string, string>;
}

const WEEK_REFERENCE_CHUNKS: KnowledgeChunk[] = [
  {
    content: `OpenCyber is a free interactive cybersecurity learning platform. It features a structured 12-week curriculum covering ethical hacking, penetration testing, and security fundamentals. Users learn through lessons, simulated labs, quizzes, and earn XP points, badges, and level up their profile.`,
    source: "platform-overview",
    chunkType: "reference",
    weekId: 0,
    metadata: { type: "platform_info" },
  },
  {
    content: `The platform tracks user progress with XP points. Levels are: Newbie (0 XP), Script Kiddie (500 XP), Hacker (2000 XP), Elite (5000 XP), and Red Team Operator (10000 XP). Users earn XP by completing lessons, labs, and quizzes. Badges are awarded for specific achievements.`,
    source: "gamification-system",
    chunkType: "reference",
    weekId: 0,
    metadata: { type: "system_info" },
  },
];

export function getChunksForWeek(weekId: number): KnowledgeChunk[] {
  const week = curriculum.find((w) => w.id === weekId);
  if (!week) return [];

  const chunks: KnowledgeChunk[] = [];

  for (const lesson of week.lessons) {
    const contentParts = [lesson.content];

    if (lesson.keyConcepts.length > 0) {
      contentParts.push("Key concepts: " + lesson.keyConcepts.join(", "));
    }

    if (lesson.commandBlocks && lesson.commandBlocks.length > 0) {
      for (const block of lesson.commandBlocks) {
        contentParts.push(`Example - ${block.title}:\n${block.code}\nExplanation: ${block.explanation}`);
      }
    }

    chunks.push({
      content: contentParts.join("\n\n"),
      source: `week-${week.id}/lesson-${lesson.id}`,
      chunkType: "lesson",
      weekId: week.id,
      metadata: { title: lesson.title, lessonId: lesson.id },
    });

    if (lesson.commandBlocks && lesson.commandBlocks.length > 0) {
      for (const block of lesson.commandBlocks) {
        chunks.push({
          content: `Command example for "${block.title}":\n${block.code}\n\nPurpose: ${block.explanation}`,
          source: `week-${week.id}/lesson-${lesson.id}/command-${block.title}`,
          chunkType: "lesson",
          weekId: week.id,
          metadata: { title: lesson.title, commandBlock: block.title },
        });
      }
    }
  }

  for (const lab of week.labs) {
    const labContent = [
      `Lab Challenge: ${lab.challenge}`,
      `Instructions: ${lab.instructions.join("; ")}`,
      `Hint: ${lab.hint}`,
      `Available commands: ${lab.fakeCommands.join(", ")}`,
    ].join("\n");

    chunks.push({
      content: labContent,
      source: `week-${week.id}/lab-${lab.id}`,
      chunkType: "lab",
      weekId: week.id,
      metadata: { title: lab.title, labId: lab.id },
    });
  }

  const quizContent = [
    `Quiz: ${week.quiz.title} (pass score: ${week.quiz.passScore}%)`,
    ...week.quiz.questions.map(
      (q) =>
        `Q: ${q.question}\nOptions: ${q.options.join(", ")}\nAnswer: ${q.options[q.correctAnswer]}\nExplanation: ${q.explanation}`,
    ),
  ].join("\n\n");

  chunks.push({
    content: quizContent,
    source: `week-${week.id}/quiz-${week.quiz.id}`,
    chunkType: "quiz",
    weekId: week.id,
    metadata: { title: week.quiz.title },
  });

  return chunks;
}

export function getAllChunks(): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = [...WEEK_REFERENCE_CHUNKS];
  for (const week of curriculum) {
    chunks.push(...getChunksForWeek(week.id));
  }
  return chunks;
}

export function formatChunksForContext(chunks: KnowledgeChunk[]): string {
  return chunks
    .map(
      (c) =>
        `[Source: ${c.source} (${c.chunkType})]\n${c.content}`,
    )
    .join("\n\n---\n\n");
}
