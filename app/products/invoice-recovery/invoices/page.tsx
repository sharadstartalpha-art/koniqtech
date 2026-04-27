"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";

export default function InvoiceListPage() {
  const [data, setData] = useState<any[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await axios.get("/api/invoices/list");
      setData(res.data);
    } catch (err) {
      console.error("Failed to load invoices", err);
    }
  };

  const markPaid = async (id: string) => {
    try {
      setLoadingId(id);
      await axios.post("/api/invoices/mark-paid", { id });
      load();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  const deleteInvoice = async (id: string) => {
    try {
      setLoadingId(id);
      await axios.post("/api/invoices/delete", { id });
      load();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <Layout>
      <div>
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Invoices</h1>

          <a
            href="/products/invoice-recovery/invoices/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            + Create Invoice
          </a>
        </div>

        {/* TABLE */}
        <div className="bg-white shadow rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-4">Email</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center p-6 text-gray-500"
                  >
                    No invoices found
                  </td>
                </tr>
              ) : (
                data.map((i: any) => (
                  <tr key={i.id} className="border-t">
                    <td className="p-4">{i.clientEmail}</td>

                    <td className="p-4 font-semibold">
                      ${i.amount}
                    </td>

                    <td className="p-4">
                      <span
                        className={
                          i.status === "paid"
                            ? "text-green-600 font-medium"
                            : "text-red-500 font-medium"
                        }
                      >
                        {i.status}
                      </span>
                    </td>

                    <td className="p-4 space-x-2">
                      <button
                        onClick={() => markPaid(i.id)}
                        disabled={loadingId === i.id}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                      >
                        {loadingId === i.id
                          ? "..."
                          : "Mark Paid"}
                      </button>

                      <button
                        onClick={() => deleteInvoice(i.id)}
                        disabled={loadingId === i.id}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}