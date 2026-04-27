"use client";

import { useState } from "react";
import axios from "axios";
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

  const submit = async () => {
    try {
      if (!form.clientEmail || !form.amount) {
        alert("Please fill all required fields");
        return;
      }

      setLoading(true);

      await axios.post("/api/invoices/create", {
        clientEmail: form.clientEmail,
        amount: Number(form.amount),
        dueDate: form.dueDate,
      });

      router.push("/products/invoice-recovery/invoices");
    } catch (err) {
      console.error(err);
      alert("Failed to create invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md">
        <h1 className="text-2xl font-bold mb-6">
          Create Invoice
        </h1>

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
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg w-full"
        >
          {loading ? "Creating..." : "Create Invoice"}
        </button>
      </div>
    </Layout>
  );
}