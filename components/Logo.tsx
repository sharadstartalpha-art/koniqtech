import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src="/logo.png"
      alt="KoniqTech"
      width={40}
      height={40}
      priority
    />
  );
}