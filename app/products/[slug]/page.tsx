"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

export default function ProductPage() {
  const { slug } = useParams();
  const [loading, setLoading] = useState(false);

  const subscribe = async () => {
    setLoading(true);

    const res = await fetch("/api/paypal/create-subscription", {
      method: "POST",
      body: JSON.stringify({ planId: null, slug }),
    });

    const data = await res.json();

    const url = data.links?.find((l: any) => l.rel === "approve")?.href;

    if (url) window.location.href = url;

    setLoading(false);
  };

  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold mb-4">{slug}</h1>

      <button onClick={subscribe} className="bg-black text-white px-6 py-3">
        {loading ? "Redirecting..." : "Subscribe"}
      </button>
    </div>
  );
}