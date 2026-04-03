export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <img
        src="/logo.png"
        alt="KoniqTech"
        className="w-8 h-8"
      />
      <span className="font-bold text-lg">
        KoniqTech
      </span>
    </div>
  );
}