"use client";

import { useEffect, useMemo, useState } from "react";

import axios from "axios";

import {
  ArrowUpRight,
  BadgeDollarSign,
  Clock3,
  CreditCard,
  DollarSign,
  Sparkles,
  TrendingUp,
} from "lucide-react";

type Invoice = {
  id: string;

  amount: number;

  paidAmount: number;

  status: string;

  mode: "manual" | "auto";
};

export default function DashboardClient() {
  const [loading, setLoading] =
    useState(true);

  const [invoices, setInvoices] =
    useState<Invoice[]>([]);

  /* =========================
     LOAD DATA
  ========================= */

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "/api/invoices/list"
      );

      setInvoices(
        Array.isArray(res.data)
          ? res.data
          : []
      );

    } catch (err) {
      console.error(err);

    } finally {
      setLoading(false);
    }
  };

  /* =========================
     STATS
  ========================= */

  const stats = useMemo(() => {
    let recovered = 0;

    let pending = 0;

    let autoInvoices = 0;

    let unpaidInvoices = 0;

    invoices.forEach((invoice) => {
      const total =
        Number(invoice.amount || 0);

      const paid =
        Number(
          invoice.paidAmount || 0
        );

      const balance =
        total - paid;

      recovered += paid;

      pending += balance;

      if (
        invoice.mode === "auto"
      ) {
        autoInvoices += 1;
      }

      if (balance > 0) {
        unpaidInvoices += 1;
      }
    });

    return {
      recovered,
      pending,
      autoInvoices,
      unpaidInvoices,
      totalInvoices:
        invoices.length,
    };
  }, [invoices]);

  /* =========================
     AI INSIGHTS
  ========================= */

  const insight =
    stats.pending >
    stats.recovered
      ? "Your pending balance is higher than recovered payments. Enable automatic reminders to improve collection rates."
      : "Great progress. Your recovered payments are growing steadily.";

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="space-y-6">

        <div>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />

          <div className="h-4 w-72 bg-gray-100 rounded mt-3 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map(
            (i) => (
              <div
                key={i}
                className="h-40 bg-white rounded-3xl border border-gray-200 animate-pulse"
              />
            )
          )}
        </div>

      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* HERO */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

        <div>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Dashboard
          </h1>

          <p className="text-gray-500 mt-2 text-base">
            Monitor invoice recovery,
            payments, and reminder performance.
          </p>

        </div>

        <div className="flex items-center gap-3">

          <a
            href="/products/invoice-recovery/invoices/create"
            className="h-12 px-5 rounded-2xl bg-black text-white flex items-center gap-2 text-sm font-semibold hover:bg-gray-900 transition"
          >
            <ArrowUpRight className="w-4 h-4" />
            Create Invoice
          </a>

        </div>

      </div>

      {/* TOP STATS */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

        {/* RECOVERED */}

        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Total Recovered
              </p>

              <h2 className="text-4xl font-bold text-green-600 mt-4">
                $
                {stats.recovered.toLocaleString()}
              </h2>

            </div>

            <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>

          </div>

          <div className="mt-5 flex items-center gap-2 text-sm text-green-600 font-medium">
            <TrendingUp className="w-4 h-4" />
            Payments collected
          </div>

        </div>

        {/* PENDING */}

        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Pending Balance
              </p>

              <h2 className="text-4xl font-bold text-red-500 mt-4">
                $
                {stats.pending.toLocaleString()}
              </h2>

            </div>

            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center">
              <Clock3 className="w-6 h-6 text-red-500" />
            </div>

          </div>

          <div className="mt-5 flex items-center gap-2 text-sm text-red-500 font-medium">
            Awaiting client payments
          </div>

        </div>

        {/* TOTAL */}

        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Total Invoices
              </p>

              <h2 className="text-4xl font-bold text-gray-900 mt-4">
                {
                  stats.totalInvoices
                }
              </h2>

            </div>

            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>

          </div>

          <div className="mt-5 text-sm text-gray-500 font-medium">
            Active invoice records
          </div>

        </div>

        {/* AUTO */}

        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm font-medium text-gray-500">
                Auto Recovery
              </p>

              <h2 className="text-4xl font-bold text-purple-600 mt-4">
                {
                  stats.autoInvoices
                }
              </h2>

            </div>

            <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
              <BadgeDollarSign className="w-6 h-6 text-purple-600" />
            </div>

          </div>

          <div className="mt-5 text-sm text-purple-600 font-medium">
            Automated reminder flows
          </div>

        </div>

      </div>

      {/* EXTRA STATS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div className="bg-white border rounded-3xl p-5">
          <p className="text-sm text-gray-500">
            Recovery Rate
          </p>

          <h3 className="text-3xl font-bold mt-2">
            {stats.totalInvoices === 0
              ? "0%"
              : `${Math.round(
                  (stats.recovered /
                    (stats.recovered +
                      stats.pending)) *
                    100
                )}%`}
          </h3>
        </div>

        <div className="bg-white border rounded-3xl p-5">
          <p className="text-sm text-gray-500">
            Unpaid Invoices
          </p>

          <h3 className="text-3xl font-bold mt-2">
            {stats.unpaidInvoices}
          </h3>
        </div>

        <div className="bg-white border rounded-3xl p-5">
          <p className="text-sm text-gray-500">
            Avg Invoice Value
          </p>

          <h3 className="text-3xl font-bold mt-2">
            $
            {stats.totalInvoices === 0
              ? 0
              : Math.round(
                  (stats.recovered +
                    stats.pending) /
                    stats.totalInvoices
                )}
          </h3>
        </div>

      </div>

      {/* INSIGHTS + ACTIVITY */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* AI INSIGHTS */}

        <div className="xl:col-span-1 bg-black text-white rounded-3xl p-6">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-yellow-300" />
            </div>

            <div>
              <h3 className="font-semibold text-lg">
                AI Recovery Insights
              </h3>

              <p className="text-sm text-gray-400">
                Smart recommendations
              </p>
            </div>

          </div>

          <div className="mt-5 space-y-4">

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-sm leading-6 text-gray-200">
                {insight}
              </p>
            </div>

            <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4">
              <p className="text-sm text-orange-200">
                Best recovery time:
              </p>

              <h4 className="text-xl font-bold mt-2">
                9 AM – 11 AM
              </h4>
            </div>

          </div>

        </div>

        {/* RECENT ACTIVITY */}

        <div className="xl:col-span-2 bg-white border border-gray-200 rounded-3xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <h3 className="text-xl font-semibold">
                Recent Invoice Activity
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Latest recovery updates
              </p>

            </div>

          </div>

          <div className="mt-6 divide-y divide-gray-100">

            {invoices.slice(0, 5).map((invoice) => {

              const balance =
                invoice.amount -
                invoice.paidAmount;

              return (

                <div
                  key={invoice.id}
                  className="py-4 flex items-center justify-between"
                >

                  <div>

                    <h4 className="font-medium text-gray-900">
                      Invoice #{invoice.id.slice(0, 6)}
                    </h4>

                    <p className="text-sm text-gray-500 mt-1">
                      {invoice.mode === "auto"
                        ? "Auto Recovery"
                        : "Manual Recovery"}
                    </p>

                  </div>

                  <div className="text-right">

                    <h4 className="font-semibold">
                      ${invoice.amount}
                    </h4>

                    <p
                      className={`text-sm mt-1 ${
                        balance > 0
                          ? "text-red-500"
                          : "text-green-600"
                      }`}
                    >
                      {balance > 0
                        ? `$${balance} pending`
                        : "Paid"}
                    </p>

                  </div>

                </div>
              );
            })}

          </div>

        </div>

      </div>

    </div>
  );
}