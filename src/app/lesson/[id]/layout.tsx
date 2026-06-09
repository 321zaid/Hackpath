export async function generateStaticParams() {
  const { curriculum } = await import("@/data/curriculum");
  return curriculum.flatMap((w: { lessons: { id: string }[] }) =>
    w.lessons.map((l) => ({ id: l.id }))
  );
}

export default function LessonLayout({ children }: { children: React.ReactNode }) {
  return children;
}
