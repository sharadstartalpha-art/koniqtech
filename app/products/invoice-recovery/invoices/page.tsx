"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";
import { Search } from "lucide-react";
import toast from "react-hot-toast";

type Invoice = {
  id: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  status: "paid" | "unpaid";
};

export default function InvoicesPage() {
  const [data, setData] = useState<Invoice[]>([]);
  const [filtered, setFiltered] = useState<Invoice[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const result = data.filter((inv) =>
      inv.clientEmail.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
    setPage(1);
  }, [search, data]);

  const load = async () => {
    try {
      const res = await axios.get("/api/invoices/list");
      setData(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  const markPaid = async (id: string) => {
    try {
      await axios.post("/api/invoices/mark-paid", { id });
      toast.success("Marked as paid");
      load();
    } catch {
      toast.error("Failed to update");
    }
  };

  /* 🔥 CONFIRM DELETE */
  const confirmDelete = (id: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <span className="text-sm">
          Are you sure you want to delete this invoice?
        </span>

        <div className="flex gap-2 justify-end">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="text-xs px-3 py-1 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={async () => {
              toast.dismiss(t.id);
              await remove(id);
            }}
            className="text-xs px-3 py-1 bg-red-600 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  const remove = async (id: string) => {
    try {
      await axios.post("/api/invoices/delete", { id });
      toast.success("Invoice deleted");
      load();
    } catch {
      toast.error("Delete failed");
    }
  };

  /* =========================
     PAGINATION
  ========================= */
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const current = filtered.slice(start, start + limit);

  return (
    <Layout>
      <div className="space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-medium">Invoices</h1>
            <p className="text-sm text-gray-500">
              Total: {total}
            </p>
          </div>

          <a
            href="/products/invoice-recovery/invoices/create"
            className="text-sm bg-black text-white px-3 py-1.5 rounded-md"
          >
            + Create
          </a>
        </div>

        {/* SEARCH */}
        <div className="flex items-center justify-between gap-4">

          <div className="relative max-w-sm w-full">
            <Search
              size={16}
              className="absolute left-3 top-2.5 text-gray-400"
            />
            <input
              placeholder="Search emails..."
              className="w-full border rounded-md pl-9 pr-3 py-2 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="text-sm border rounded-md px-2 py-1"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-white border rounded-md overflow-hidden">

          {loading ? (
            <div className="p-6 text-sm text-gray-500">
              Loading invoices...
            </div>
          ) : current.length === 0 ? (
            <div className="p-6 text-sm text-gray-500">
              No invoices found.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Total</th>
                  <th className="px-4 py-3 text-left">Paid</th>
                  <th className="px-4 py-3 text-left">Balance</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {current.map((inv, index) => {
                  const paid = inv.status === "paid" ? inv.amount : 0;
                  const balance =
                    inv.status === "paid" ? 0 : inv.amount;

                  return (
                    <tr key={inv.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        {start + index + 1}
                      </td>

                      <td className="px-4 py-3">
                        {inv.clientName }
                      </td>

                       <td className="px-4 py-3">
                        {inv.clientEmail}
                      </td>

                      <td className="px-4 py-3 font-medium">
                        ${inv.amount}
                      </td>

                      <td className="px-4 py-3 font-semibold text-green-600">
                        ${paid}
                      </td>

                      <td className="px-4 py-3 font-semibold text-red-600">
                        ${balance}
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
                            className="text-xs px-2 py-1 border rounded hover:bg-gray-100"
                          >
                            Mark Paid
                          </button>
                        )}

                        <button
                          onClick={() => confirmDelete(inv.id)}
                          className="text-xs px-2 py-1 border rounded text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </Layout>
  );
}