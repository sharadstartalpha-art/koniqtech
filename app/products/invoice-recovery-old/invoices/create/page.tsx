"use client";

import { useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";

export default function CreateInvoicePage() {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const create = async () => {
    if (!email || !amount) {
      alert("All fields required");
      return;
    }

    try {
      setLoading(true);

      await axios.post("/api/invoices/create", {
        clientEmail: email,
        amount: Number(amount),
        dueDate: new Date(),
      });

      window.location.href =
        "/products/invoice-recovery/invoices";
    } catch (err) {
      console.error(err);
      alert("Failed to create invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex justify-center pt-20">

        {/* CARD */}
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg p-6 space-y-5">

          {/* TITLE */}
          <div>
            <h1 className="text-lg font-medium">
              Create Invoice
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Send a payment request to your client
            </p>
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-600">
              Client email
            </label>
            <input
              type="email"
              placeholder="client@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>

          {/* AMOUNT */}
          <div>
            <label className="text-sm text-gray-600">
              Amount (USD)
            </label>
            <input
              type="number"
              placeholder="100"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-between items-center pt-2">

            <a
              href="/products/invoice-recovery/invoices"
              className="text-sm text-gray-500 hover:underline"
            >
              Cancel
            </a>

            <button
              onClick={create}
              disabled={loading}
              className="bg-black text-white text-sm px-4 py-2 rounded-md hover:bg-gray-900 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create"}
            </button>

          </div>
        </div>
      </div>
    </Layout>
  );
}