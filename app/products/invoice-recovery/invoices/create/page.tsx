"use client";

import { useState } from "react";
import api from "@/lib/axios"; // ✅ use your custom axios
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";

export default function CreateInvoicePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    clientEmail: "",
    amount: "",
    dueDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    try {
      setError(null);

      // ✅ validation
      if (!form.clientEmail || !form.amount) {
        setError("Email and amount are required");
        return;
      }

      setLoading(true);

      // ✅ API call (cookies included automatically)
      await api.post("/api/invoices/create", {
        clientEmail: form.clientEmail,
        amount: Number(form.amount),
        dueDate: form.dueDate,
      });

      // ✅ redirect
      router.push("/products/invoice-recovery/invoices");
    } catch (err: any) {
      console.error(err);

      if (err?.response?.status === 401) {
        setError("You must be logged in");
      } else {
        setError("Failed to create invoice");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md">
        {/* HEADER */}
        <h1 className="text-2xl font-bold mb-6">
          Create Invoice
        </h1>

        {/* ERROR */}
        {error && (
          <p className="mb-4 text-red-500 text-sm">
            {error}
          </p>
        )}

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Client Email"
          className="border p-3 w-full mb-4 rounded"
          value={form.clientEmail}
          onChange={(e) =>
            setForm({ ...form, clientEmail: e.target.value })
          }
        />

        {/* AMOUNT */}
        <input
          type="number"
          placeholder="Amount"
          className="border p-3 w-full mb-4 rounded"
          value={form.amount}
          onChange={(e) =>
            setForm({ ...form, amount: e.target.value })
          }
        />

        {/* DUE DATE */}
        <input
          type="date"
          className="border p-3 w-full mb-6 rounded"
          value={form.dueDate}
          onChange={(e) =>
            setForm({ ...form, dueDate: e.target.value })
          }
        />

        {/* BUTTON */}
        <button
          onClick={submit}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg w-full disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Invoice"}
        </button>
      </div>
    </Layout>
  );
}