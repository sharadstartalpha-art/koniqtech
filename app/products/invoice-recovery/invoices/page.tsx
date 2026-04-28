"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";
import { Search } from "lucide-react";

type Invoice = {
  id: string;
  clientEmail: string;
  amount: number;
  status: "paid" | "unpaid";
};

export default function InvoicesPage() {
  const [data, setData] = useState<Invoice[]>([]);
  const [filtered, setFiltered] = useState<Invoice[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const result = data.filter((inv) =>
      inv.clientEmail.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, data]);

  const load = async () => {
    try {
      const res = await axios.get("/api/invoices/list");
      setData(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markPaid = async (id: string) => {
    await axios.post("/api/invoices/mark-paid", { id });
    load();
  };

  const remove = async (id: string) => {
    await axios.post("/api/invoices/delete", { id });
    load();
  };

  return (
    <Layout>
      <div className="space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-medium">Invoices</h1>

          <a
            href="/products/invoice-recovery/invoices/create"
            className="text-sm bg-black text-white px-3 py-1.5 rounded-md"
          >
            + Create
          </a>
        </div>

        {/* SEARCH */}
        <div className="relative max-w-sm">
          <Search
            size={16}
            className="absolute left-3 top-2.5 text-gray-400"
          />

          <input
            placeholder="Search emails..."
            className="w-full border border-gray-200 rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* TABLE */}
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden">

          {loading ? (
            <div className="p-6 text-sm text-gray-500">
              Loading invoices...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-6 text-sm text-gray-500">
              No invoices found.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b text-gray-600">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Email</th>
                  <th className="text-left px-4 py-3 font-medium">Amount</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-right px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((inv) => (
                  <tr
                    key={inv.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3 text-gray-800">
                      {inv.clientEmail}
                    </td>

                    <td className="px-4 py-3">
                      ${inv.amount}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-md ${
                          inv.status === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right space-x-2">
                      {inv.status !== "paid" && (
                        <button
                          onClick={() => markPaid(inv.id)}
                          className="text-xs px-2 py-1 border rounded-md hover:bg-gray-100"
                        >
                          Mark Paid
                        </button>
                      )}

                      <button
                        onClick={() => remove(inv.id)}
                        className="text-xs px-2 py-1 border rounded-md text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
}