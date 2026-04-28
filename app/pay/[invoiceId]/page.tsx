"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function PayPage({ params }: any) {
  const [invoice, setInvoice] = useState<any>(null);

  useEffect(() => {
    axios
      .get(`/api/invoices/get?id=${params.invoiceId}`)
      .then((res) => setInvoice(res.data))
      .catch(() => setInvoice(null));
  }, [params.invoiceId]);

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
        Loading invoice...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      {/* CARD */}
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg p-8 text-center">

        {/* TITLE */}
        <h1 className="text-lg font-medium mb-1">
          Invoice Payment
        </h1>

        <p className="text-sm text-gray-500 mb-6">
          {invoice.clientEmail}
        </p>

        {/* AMOUNT */}
        <div className="text-3xl font-semibold mb-6">
          ${invoice.amount}
        </div>

        {/* PAY BUTTON */}
        <a
          href={invoice.paymentLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-black text-white text-sm px-4 py-3 rounded-md hover:bg-gray-900 transition"
        >
          Pay with PayPal
        </a>

        {/* FOOTER */}
        <p className="text-xs text-gray-500 mt-6">
          Sent via KoniqTech — automate your invoices →
          <a
            href={`/signup?ref=${invoice.userId}`}
            className="text-blue-600 ml-1 hover:underline"
          >
            Try free
          </a>
        </p>

      </div>
    </div>
  );
}