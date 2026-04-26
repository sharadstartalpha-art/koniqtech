"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function CreateInvoice() {
  const router = useRouter();

  const [form, setForm] = useState({
    clientEmail: "",
    amount: 0, // ✅ number now
    dueDate: "",
  });

  const submit = async () => {
    await axios.post("/api/invoices/create", {
      ...form,
      userId: "TEMP_USER_ID",
      productId: "TEMP_PRODUCT_ID",
    });

    router.push("/products/invoice-recovery/invoices");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Create Invoice</h1>

      <input
        placeholder="Client Email"
        className="border p-2 mb-2 w-full"
        onChange={(e) =>
          setForm({ ...form, clientEmail: e.target.value })
        }
      />

      <input
        type="number" // ✅ important
        placeholder="Amount"
        className="border p-2 mb-2 w-full"
        onChange={(e) =>
          setForm({ ...form, amount: Number(e.target.value) })
        }
      />

      <input
        type="date"
        className="border p-2 mb-2 w-full"
        onChange={(e) =>
          setForm({ ...form, dueDate: e.target.value })
        }
      />

      <button
        onClick={submit}
        className="bg-black text-white px-4 py-2"
      >
        Save
      </button>
    </div>
  );
}