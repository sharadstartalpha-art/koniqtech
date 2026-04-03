import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Image
        src="/logo.png"
        alt="KoniqTech"
        width={32}
        height={32}
      />
      <span className="font-bold text-lg">
        KoniqTech
      </span>
    </div>
  );
}