"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function PricingPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleClick = () => {
    if (session) {
      router.push("/dashboard");
    } else {
      router.push("/register");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-black text-white px-6 py-3 rounded-xl hover:opacity-90 transition"
    >
      Get Started
    </button>
  );
}