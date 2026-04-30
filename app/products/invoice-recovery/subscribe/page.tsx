"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";

export const dynamic = "force-dynamic";

export default function SubscribePage() {
  const params = useParams();
  const slug = params.slug as string;

  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);

  useEffect(() => {
    if (slug) load();
  }, [slug]);

  const load = async () => {
    try {
      const res = await axios.get(`/api/products/${slug}`);
      setPlans(res.data.plans); // ✅ ONLY plans
    } catch (err) {
      toast.error("Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  const subscribe = async (planId: string) => {
    try {
      setSubscribing(planId);

      const res = await axios.post(
        "/api/paypal/create-subscription",
        { planId }
      );

      // 🔥 redirect to PayPal approval
      const approvalUrl = res.data.links?.find(
        (l: any) => l.rel === "approve"
      )?.href;

      if (approvalUrl) {
        window.location.href = approvalUrl;
      } else {
        toast.error("No approval link");
      }
    } catch (err) {
      toast.error("Subscription failed");
    } finally {
      setSubscribing(null);
    }
  };

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Loading plans...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-6">Choose a plan</h1>

      <div className="grid md:grid-cols-3 gap-4">
        {plans.map((p) => (
          <div
            key={p.id}
            className="border rounded-lg p-5 bg-white hover:shadow transition"
          >
            <h3 className="font-medium text-lg">{p.name}</h3>

            <p className="text-2xl my-2">
              {p.price === 0 ? "Free" : `$${p.price}/mo`}
            </p>

            <p className="text-sm text-gray-500">
              {p.invoiceLimit === -1
                ? "Unlimited invoices"
                : `${p.invoiceLimit} invoices`}
            </p>

            <button
              onClick={() => subscribe(p.id)}
              disabled={subscribing === p.id}
              className="mt-4 w-full bg-black text-white py-2 rounded-md disabled:opacity-50"
            >
              {subscribing === p.id ? "Processing..." : "Subscribe"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}