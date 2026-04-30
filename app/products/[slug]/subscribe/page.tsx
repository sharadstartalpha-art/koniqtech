"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SubscribePage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      console.error("❌ SLUG IS UNDEFINED");
      return;
    }

    load();
  }, [slug]);

  const load = async () => {
    try {
      console.log("✅ Fetching plans for:", slug);

      const res = await axios.get(`/api/products/${slug}`);
      setPlans(res.data.plans || []);
    } catch (err) {
      console.error("❌ API ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!slug) {
    return <div className="p-6">Invalid product</div>;
  }

  if (loading) {
    return <div className="p-6">Loading plans...</div>;
  }

  if (!plans.length) {
    return <div className="p-6">No plans found</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Choose a plan</h1>

      {plans.map((p) => (
        <div key={p.id}>{p.name}</div>
      ))}
    </div>
  );
}