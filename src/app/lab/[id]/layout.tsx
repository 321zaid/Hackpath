export async function generateStaticParams() {
  const { curriculum } = await import("@/data/curriculum");
  return curriculum.flatMap((w: { labs: { id: string }[] }) =>
    w.labs.map((l) => ({ id: l.id }))
  );
}

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return children;
}
