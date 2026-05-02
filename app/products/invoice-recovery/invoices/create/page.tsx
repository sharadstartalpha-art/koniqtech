"use client";

import { useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";
import toast from "react-hot-toast";

export default function CreateInvoicePage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState(""); // ✅ NEW
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const create = async () => {
    if (!email || !amount) {
      toast.error("Email and amount required");
      return;
    }

    try {
      setLoading(true);

      await axios.post("/api/invoices/create", {
        clientEmail: email,
        clientName: name || null, // ✅ send name
        amount: Number(amount),
        dueDate: new Date(),
      });

      toast.success("Invoice created");

      window.location.href =
        "/products/invoice-recovery/invoices";
    } catch (err) {
      console.error(err);
      toast.error("Failed to create invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex justify-center pt-20">

        <div className="w-full max-w-md bg-white border rounded-lg p-6 space-y-5">

          <div>
            <h1 className="text-lg font-medium">
              Create Invoice
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Send a payment request to your client
            </p>
          </div>

          {/* CLIENT NAME ✅ */}
          <div>
            <label className="text-sm text-gray-600">
              Client name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
            />
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
              className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
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
              className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-between items-center pt-2">
            <a
              href="/products/invoice-recovery/invoices"
              className="text-sm text-gray-500"
            >
              Cancel
            </a>

            <button
              onClick={create}
              disabled={loading}
              className="bg-black text-white text-sm px-4 py-2 rounded-md"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}