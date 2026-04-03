import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Image
        src="/logo.png"
        alt="KoniqTech"
        width={40}   // 🔥 increased
        height={40}
        priority
      />
      <span className="font-bold text-xl hidden sm:block">
  KoniqTech
</span>
    </div>
  );
}