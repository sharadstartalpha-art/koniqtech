import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex items-center">
      <Image
        src="/logo.png"
        alt="KoniqTech"
        width={120}
        height={40}
        priority
        className="object-contain"
      />
    </div>
  );
}