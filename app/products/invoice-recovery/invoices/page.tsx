"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";

import toast from "react-hot-toast";

import {
  Search,
  DollarSign,
  FileText,
  CircleDollarSign,
  Wallet,
  Plus,
  Trash2,
  CheckCircle2,
  Clock3,
} from "lucide-react";

/* =========================
   TYPES
========================= */

type Payment = {
  id: string;

  amount: number;

  createdAt: string;

  status: string;
};

type Invoice = {
  id: string;

  clientName: string;

  clientEmail: string;

  amount: number;

  paidAmount: number;

  status: "paid" | "unpaid";

  mode: "manual" | "auto";

  payments: Payment[];
};

/* =========================
   PAGE
========================= */

export default function InvoicesPage() {
  const [data, setData] = useState<
    Invoice[]
  >([]);

  const [filtered, setFiltered] =
    useState<Invoice[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  /* =========================
     LOAD
  ========================= */

  const load = async () => {
    try {
      const res = await axios.get(
        "/api/invoices/list"
      );

      setData(res.data);
      setFiltered(res.data);

    } catch {
      toast.error(
        "Failed to load invoices"
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  /* =========================
     SEARCH
  ========================= */

  useEffect(() => {
    const result = data.filter(
      (inv) =>
        inv.clientEmail
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        inv.clientName
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

    setFiltered(result);

  }, [search, data]);

  /* =========================
     STATS
  ========================= */

  const stats = useMemo(() => {
    const totalRevenue =
      data.reduce(
        (sum, i) =>
          sum + Number(i.amount),
        0
      );

    const totalPaid =
      data.reduce(
        (sum, i) =>
          sum +
          Number(i.paidAmount || 0),
        0
      );

    const outstanding =
      totalRevenue - totalPaid;

    const paidInvoices =
      data.filter(
        (i) => i.status === "paid"
      ).length;

    return {
      totalRevenue,
      totalPaid,
      outstanding,
      paidInvoices,
    };
  }, [data]);

  /* =========================
     DELETE
  ========================= */

  const remove = async (
    id: string
  ) => {
    if (
      !confirm(
        "Delete this invoice?"
      )
    ) {
      return;
    }

    try {
      await axios.post(
        "/api/invoices/delete",
        { id }
      );

      toast.success(
        "Invoice deleted"
      );

      load();

    } catch {
      toast.error(
        "Delete failed"
      );
    }
  };

  /* =========================
     MARK PAID
  ========================= */

  const markPaid = async (
    id: string
  ) => {
    try {
      await axios.post(
        "/api/invoices/mark-paid",
        {
          id,
        }
      );

      toast.success(
        "Invoice marked paid"
      );

      load();

    } catch {
      toast.error(
        "Failed to update"
      );
    }
  };

  return (
    <Layout>
      <div className="space-y-8">

        {/* HERO */}

        <div className="rounded-3xl bg-gradient-to-br from-black to-gray-900 p-8 text-white">

          <div className="flex items-start justify-between flex-wrap gap-6">

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sm mb-4">
                <CircleDollarSign
                  size={16}
                />
                Revenue Recovery
              </div>

              <h1 className="text-4xl font-bold">
                Invoices
              </h1>

              <p className="text-gray-300 mt-3 max-w-2xl">
                Track unpaid invoices,
                collect payments faster,
                and automate recovery
                workflows.
              </p>
            </div>

            <a
              href="/products/invoice-recovery/invoices/create"
              className="
                h-12 px-5 rounded-2xl
                bg-white text-black
                font-semibold
                flex items-center gap-2
                hover:scale-[1.02]
                transition
              "
            >
              <Plus size={18} />
              Create Invoice
            </a>

          </div>

        </div>

        {/* STATS */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue}`}
            icon={Wallet}
          />

          <StatCard
            title="Collected"
            value={`$${stats.totalPaid}`}
            icon={CheckCircle2}
          />

          <StatCard
            title="Outstanding"
            value={`$${stats.outstanding}`}
            icon={Clock3}
          />

          <StatCard
            title="Invoices"
            value={data.length}
            icon={FileText}
          />

        </div>

        {/* SEARCH */}

        <div className="bg-white border border-gray-200 rounded-2xl p-4">

          <div className="relative max-w-md">

            <Search
              size={18}
              className="
                absolute left-4 top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              placeholder="Search client..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="
                w-full h-12 rounded-xl
                border border-gray-200
                pl-11 pr-4
                outline-none
                focus:ring-2
                focus:ring-orange-500
              "
            />

          </div>

        </div>

        {/* TABLE */}

        <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden">

          {loading ? (

            <div className="p-10 text-center text-gray-500">
              Loading invoices...
            </div>

          ) : filtered.length === 0 ? (

            <div className="p-16 text-center">

              <div className="w-16 h-16 rounded-2xl bg-gray-100 mx-auto flex items-center justify-center mb-5">
                <FileText
                  size={28}
                  className="text-gray-500"
                />
              </div>

              <h2 className="text-xl font-semibold">
                No invoices found
              </h2>

              <p className="text-gray-500 mt-2">
                Create your first invoice
                to start recovering
                payments.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50 border-b border-gray-200">

                  <tr className="text-left text-sm text-gray-500">

                    <th className="px-6 py-4">
                      Client
                    </th>

                    <th className="px-6 py-4">
                      Total
                    </th>

                    <th className="px-6 py-4">
                      Paid
                    </th>

                    <th className="px-6 py-4">
                      Balance
                    </th>

                    <th className="px-6 py-4">
                      Mode
                    </th>

                    <th className="px-6 py-4">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filtered.map((inv) => {
                    const paid =
                      Number(
                        inv.paidAmount || 0
                      );

                    const balance =
                      Number(inv.amount) -
                      paid;

                    return (
                      <tr
                        key={inv.id}
                        className="
                          border-b
                          border-gray-100
                          hover:bg-gray-50/60
                          transition
                        "
                      >

                        {/* CLIENT */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-4">

                            <div className="
                              w-11 h-11 rounded-full
                              bg-orange-100
                              text-orange-700
                              flex items-center
                              justify-center
                              font-semibold
                            ">
                              {inv.clientName?.[0] ||
                                "C"}
                            </div>

                            <div>

                              <p className="font-semibold text-gray-900">
                                {inv.clientName ||
                                  "Unknown"}
                              </p>

                              <p className="text-sm text-gray-500">
                                {
                                  inv.clientEmail
                                }
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* TOTAL */}

                        <td className="px-6 py-5 font-semibold">
                          ${inv.amount}
                        </td>

                        {/* PAID */}

                        <td className="px-6 py-5 text-green-600 font-semibold">
                          ${paid}
                        </td>

                        {/* BALANCE */}

                        <td className="px-6 py-5 text-red-600 font-semibold">
                          ${balance}
                        </td>

                        {/* MODE */}

                        <td className="px-6 py-5">

                          <span
                            className={`
                              inline-flex items-center
                              px-3 py-1 rounded-full
                              text-xs font-semibold
                              ${
                                inv.mode ===
                                "auto"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-blue-100 text-blue-700"
                              }
                            `}
                          >
                            {inv.mode}
                          </span>

                        </td>

                        {/* STATUS */}

                        <td className="px-6 py-5">

                          <span
                            className={`
                              inline-flex items-center
                              px-3 py-1 rounded-full
                              text-xs font-semibold
                              ${
                                inv.status ===
                                "paid"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-600"
                              }
                            `}
                          >
                            {inv.status}
                          </span>


{(inv.payments?.length || 0) > 0 && (
  <div className="mt-3 space-y-1">

    {inv.payments?.map(
      (
        p: Payment,
        idx: number
      ) => (
        <div
          key={idx}
          className="
            text-xs text-gray-500
          "
        >
          Paid ${p.amount} on{" "}
          {new Date(
            p.createdAt
          ).toLocaleDateString()}
        </div>
      )
    )}

  </div>
)}


                        </td>

                        {/* ACTIONS */}

                        <td className="px-6 py-5">

                          <div className="flex justify-end gap-2">

  {inv.status !== "paid" && (

    <>
      {/* PARTIAL */}

      <button
        onClick={async () => {
          const amount = prompt(
            "Enter payment amount"
          );

          if (!amount) return;

          try {
            await axios.post(
              "/api/invoices/mark-paid",
              {
                id: inv.id,
                paidAmount:
                  Number(amount),
              }
            );

            toast.success(
              "Payment updated"
            );

            load();

          } catch (err: any) {
            toast.error(
              err?.response?.data
                ?.error ||
                "Failed to update"
            );
          }
        }}
        className="
          h-10 px-4 rounded-xl
          bg-black text-white
          text-sm font-medium
        "
      >
        Partial Pay
      </button>

      {/* FULL */}

      <button
        onClick={async () => {
          try {
            await axios.post(
              "/api/invoices/mark-paid",
              {
                id: inv.id,
                paidAmount:
                  balance,
              }
            );

            toast.success(
              "Invoice fully paid"
            );

            load();

          } catch {
            toast.error(
              "Failed to update"
            );
          }
        }}
        className="
          h-10 px-4 rounded-xl
          bg-green-600 text-white
          text-sm font-medium
        "
      >
        Pay Full
      </button>
    </>
  )}

  {/* DELETE */}

  <button
    onClick={() =>
      remove(inv.id)
    }
    className="
      h-10 w-10 rounded-xl
      border border-red-200
      text-red-600
      hover:bg-red-50
      flex items-center
      justify-center
    "
  >
    <Trash2 size={16} />
  </button>

</div>

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>
          )}
        </div>

      </div>
    </Layout>
  );
}

/* =========================
   STAT CARD
========================= */

function StatCard({
  title,
  value,
  icon: Icon,
}: any) {
  return (
    <div className="
      bg-white border border-gray-200
      rounded-3xl p-5
    ">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-2">
            {value}
          </h2>

        </div>

        <div className="
          w-12 h-12 rounded-2xl
          bg-orange-100
          flex items-center justify-center
        ">
          <Icon
            size={22}
            className="text-orange-600"
          />
        </div>

      </div>

    </div>
  );
}