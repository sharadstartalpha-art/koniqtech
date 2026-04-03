import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src="/logo.svg"
      alt="KoniqTech"
      width={120}
      height={40}
      priority
    />
  );
}