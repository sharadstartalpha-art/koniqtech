"use client";

import { useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";
import { useParams } from "next/navigation";

export default function CreateInvoicePage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const create = async () => {
    if (!email || !amount) return alert("All fields required");

    try {
      setLoading(true);

      await axios.post("/api/invoices/create", {
        clientEmail: email,
        amount: Number(amount),
        dueDate: new Date(),
        slug,
      });

      window.location.href = `/products/${slug}/invoices`;
    } catch {
      alert("Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout slug={slug}>
      <div className="max-w-md mx-auto mt-20 space-y-4">
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full"
        />

        <input
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 w-full"
        />

        <button
          onClick={create}
          disabled={loading}
          className="bg-black text-white p-2 w-full"
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </div>
    </Layout>
  );
}