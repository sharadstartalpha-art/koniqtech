import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src="/logo.png"
      alt="KoniqTech"
      width={240}
      height={80}
      priority
    />
  );
}