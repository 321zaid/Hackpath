export async function generateStaticParams() {
  const { curriculum } = await import("@/data/curriculum");
  return curriculum.map((w: { quiz: { id: string } }) => ({ id: w.quiz.id }));
}

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return children;
}
