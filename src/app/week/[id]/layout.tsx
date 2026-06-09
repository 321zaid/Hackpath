export async function generateStaticParams() {
  const { curriculum } = await import("@/data/curriculum");
  return curriculum.map((w: { id: number }) => ({ id: String(w.id) }));
}

export default function WeekLayout({ children }: { children: React.ReactNode }) {
  return children;
}
