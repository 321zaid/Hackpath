export default function CyberBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#080808]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#00FF41]/5 via-transparent to-[#080808]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF41]/50 to-transparent" />
      <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-[#00FF41]/20 via-transparent to-transparent" />
      <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-[#00FF41]/20 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF41]/30 to-transparent" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #00FF41 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
}
