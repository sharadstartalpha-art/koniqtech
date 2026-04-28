"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function PayPage({ params }: any) {
  const [invoice, setInvoice] = useState<any>(null);

  useEffect(() => {
    axios
      .get(`/api/invoices/get?id=${params.invoiceId}`)
      .then((res) => setInvoice(res.data));
  }, []);

  if (!invoice) return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="bg-white p-8 rounded shadow w-full max-w-md text-center">

        <h1 className="text-2xl font-bold mb-2">
          Invoice Payment
        </h1>

        <p className="text-gray-500 mb-4">
          {invoice.clientEmail}
        </p>

        <h2 className="text-3xl font-bold mb-6">
          ${invoice.amount}
        </h2>

        <a
          href={invoice.paymentLink}
          target="_blank"
          className="bg-blue-600 text-white px-6 py-3 rounded w-full block"
        >
          Pay with PayPal
        </a>

      </div>
    </div>
  );
}