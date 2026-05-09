// app/products/invoice-recovery/reminder-center/page.tsx

"use client";

import { useEffect, useState } from "react";

import axios from "axios";

import Layout from "@/components/Layout";

import toast from "react-hot-toast";

import {
  Bell,
  Mail,
  MessageCircle,
  Smartphone,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  X,
} from "lucide-react";

export default function ReminderCenterPage() {

  /* =========================================
     STATES
  ========================================= */

  const [loading, setLoading] =
    useState(true);

  const [data, setData] =
    useState<any>(null);

  const [openCreate, setOpenCreate] =
    useState(false);

  const [openAnalytics, setOpenAnalytics] =
    useState(false);

  /* =========================================
     FORM
  ========================================= */

  const [invoiceId, setInvoiceId] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [mode, setMode] =
    useState("email");

  const [message, setMessage] =
    useState("");

  /* =========================================
     LOAD DATA
  ========================================= */

  const loadData = async () => {
    try {

      const res =
        await axios.get(
          "/api/reminder-center"
        );

      setData(res.data);

    } catch (err) {

      console.error(err);

      toast.error(
        "Failed to load reminder center"
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* =========================================
     CREATE REMINDER
  ========================================= */

  const createReminder =
    async () => {
      try {

        if (!invoiceId) {
          toast.error(
            "Invoice ID required"
          );

          return;
        }

        await axios.post(
          "/api/reminder-center",
          {
            invoiceId,
            email,
            amount,
            mode,
            type: "friendly",
            html: `<p>${message}</p>`,
            text: message,
          }
        );

        toast.success(
          "Reminder sent successfully"
        );

        setOpenCreate(false);

        loadData();

      } catch (err) {

        console.error(err);

        toast.error(
          "Failed to send reminder"
        );
      }
    };

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <Layout>
        <div className="p-10">
          Loading...
        </div>
      </Layout>
    );
  }

  /* =========================================
     DATA
  ========================================= */

  const reminders =
    data?.reminders || [];

  const logs =
    data?.logs || [];

  const stats =
    data?.stats || {};

  return (
    <Layout>

      <div className="space-y-6">

        {/* HERO */}

        <div className="rounded-[28px] overflow-hidden bg-gradient-to-r from-black via-zinc-950 to-slate-900 text-white p-8 border border-zinc-800">

          <div className="flex items-start justify-between flex-wrap gap-6">

            <div className="max-w-2xl">

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs mb-5 border border-white/10">
                <Bell size={14} />
                Reminder Center
              </div>

              <h1 className="text-4xl font-bold leading-tight">
                Manage every recovery reminder
              </h1>

              <p className="text-zinc-300 mt-4 text-[15px] leading-7">
                Monitor Email, WhatsApp, and SMS reminders from one place.
              </p>

              <div className="flex gap-3 mt-6 flex-wrap">

                {/* CREATE */}

                <button
                  onClick={() =>
                    setOpenCreate(true)
                  }
                  className="bg-white text-black px-5 py-3 rounded-xl text-sm font-medium hover:bg-zinc-200 transition"
                >
                  Create Reminder
                </button>

                {/* ANALYTICS */}

                <button
                  onClick={() =>
                    setOpenAnalytics(true)
                  }
                  className="border border-white/20 px-5 py-3 rounded-xl text-sm hover:bg-white/10 transition"
                >
                  View Analytics
                </button>

              </div>
            </div>

            {/* STATS */}

            <div className="grid grid-cols-2 gap-4 min-w-[320px]">

              <StatCard
                title="Sent"
                value={stats.sent || 0}
                icon={CheckCircle2}
              />

              <StatCard
                title="Pending"
                value={stats.pending || 0}
                icon={Clock3}
              />

              <StatCard
                title="Failed"
                value={stats.failed || 0}
                icon={AlertTriangle}
              />

              <StatCard
                title="Opened"
                value={stats.opened || 0}
                icon={BrainCircuit}
              />

            </div>
          </div>
        </div>

        {/* CHANNELS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <ChannelCard
            title="Email Recovery"
            desc="Automated invoice reminders via email."
            icon={Mail}
            active={`${stats?.channels?.email || 0} sent`}
          />

          <ChannelCard
            title="WhatsApp Recovery"
            desc="High-open recovery campaigns."
            icon={MessageCircle}
            active={`${stats?.channels?.whatsapp || 0} sent`}
          />

          <ChannelCard
            title="SMS Recovery"
            desc="Fast payment nudges via SMS."
            icon={Smartphone}
            active={`${stats?.channels?.sms || 0} sent`}
          />

        </div>

        {/* TABLE */}

        <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden">

          <div className="p-6 border-b border-zinc-100">

            <h2 className="text-xl font-semibold">
              Recent Reminder Activity
            </h2>

            <p className="text-sm text-zinc-500 mt-1">
              Track all reminder delivery events
            </p>

          </div>

          <div className="divide-y">

            {logs.length === 0 && (
              <div className="p-10 text-center text-zinc-500">
                No reminders yet
              </div>
            )}

            {logs.map((log: any) => {

              const Icon =
                log.channel ===
                "whatsapp"
                  ? MessageCircle
                  : log.channel ===
                    "sms"
                  ? Smartphone
                  : Mail;

              return (
                <div
                  key={log.id}
                  className="p-5 flex items-center justify-between hover:bg-zinc-50 transition"
                >

                  <div className="flex items-center gap-4">

                    <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center">
                      <Icon size={20} />
                    </div>

                    <div>

                      <h3 className="font-semibold text-[15px]">
                        {
                          log.invoice
                            ?.clientName
                        }
                      </h3>

                      <p className="text-sm text-zinc-500 mt-1">
                        {
                          log.channel
                        }{" "}
                        •{" "}
                        {
                          log.subject
                        }
                      </p>

                    </div>

                  </div>

                  <div className="hidden md:block text-sm font-medium">
                    $
                    {
                      log.invoice
                        ?.amount
                    }
                  </div>

                  <div className="hidden md:block text-sm text-zinc-500">
                    {new Date(
                      log.createdAt
                    ).toLocaleString()}
                  </div>

                  <div>
                    <StatusBadge
                      status={
                        log.status
                      }
                    />
                  </div>

                  <button className="text-zinc-400 hover:text-black transition">
                    <ArrowRight size={18} />
                  </button>

                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ===================================
          CREATE MODAL
      =================================== */}

      {openCreate && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-lg rounded-3xl p-7">

            <div className="flex items-center justify-between mb-6">

              <div>

                <h2 className="text-2xl font-bold">
                  Create Reminder
                </h2>

                <p className="text-sm text-zinc-500 mt-1">
                  Send reminder manually
                </p>

              </div>

              <button
                onClick={() =>
                  setOpenCreate(false)
                }
              >
                <X size={22} />
              </button>

            </div>

            <div className="space-y-4">

              <input
                placeholder="Invoice ID"
                value={invoiceId}
                onChange={(e) =>
                  setInvoiceId(
                    e.target.value
                  )
                }
                className="w-full border rounded-2xl px-4 py-3 outline-none"
              />

              <input
                placeholder="Client email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                className="w-full border rounded-2xl px-4 py-3 outline-none"
              />

              <input
                placeholder="Invoice amount"
                value={amount}
                onChange={(e) =>
                  setAmount(
                    e.target.value
                  )
                }
                className="w-full border rounded-2xl px-4 py-3 outline-none"
              />

              <select
                value={mode}
                onChange={(e) =>
                  setMode(
                    e.target.value
                  )
                }
                className="w-full border rounded-2xl px-4 py-3 outline-none"
              >
                <option value="email">
                  Email
                </option>

                <option value="whatsapp">
                  WhatsApp
                </option>

                <option value="sms">
                  SMS
                </option>

              </select>

              <textarea
                rows={5}
                value={message}
                onChange={(e) =>
                  setMessage(
                    e.target.value
                  )
                }
                placeholder="Reminder message..."
                className="w-full border rounded-2xl px-4 py-3 outline-none"
              />

            </div>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() =>
                  setOpenCreate(false)
                }
                className="border px-5 py-3 rounded-2xl"
              >
                Cancel
              </button>

              <button
                onClick={
                  createReminder
                }
                className="bg-black text-white px-5 py-3 rounded-2xl"
              >
                Send Reminder
              </button>

            </div>

          </div>
        </div>
      )}

      {/* ===================================
          ANALYTICS MODAL
      =================================== */}

      {openAnalytics && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-2xl rounded-3xl p-7">

            <div className="flex items-center justify-between mb-8">

              <div>

                <h2 className="text-2xl font-bold">
                  Recovery Analytics
                </h2>

                <p className="text-sm text-zinc-500 mt-1">
                  Real performance overview
                </p>

              </div>

              <button
                onClick={() =>
                  setOpenAnalytics(false)
                }
              >
                <X size={22} />
              </button>

            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              <AnalyticsCard
                title="Emails"
                value={
                  stats?.channels
                    ?.email || 0
                }
              />

              <AnalyticsCard
                title="WhatsApp"
                value={
                  stats?.channels
                    ?.whatsapp || 0
                }
              />

              <AnalyticsCard
                title="SMS"
                value={
                  stats?.channels
                    ?.sms || 0
                }
              />

              <AnalyticsCard
                title="Success"
                value={`${stats.sent || 0}`}
              />

            </div>

          </div>
        </div>
      )}

    </Layout>
  );
}

/* ===================================
   STATS
=================================== */

function StatCard({
  title,
  value,
  icon: Icon,
}: any) {
  return (
    <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-zinc-400 text-sm">
            {title}
          </p>

          <h3 className="text-3xl font-bold mt-2">
            {value}
          </h3>

        </div>

        <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
          <Icon size={18} />
        </div>

      </div>

    </div>
  );
}

/* ===================================
   CHANNEL
=================================== */

function ChannelCard({
  title,
  desc,
  icon: Icon,
  active,
}: any) {
  return (
    <div className="bg-white border border-zinc-200 rounded-3xl p-6 hover:shadow-md transition">

      <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center mb-5">
        <Icon size={20} />
      </div>

      <h3 className="font-semibold text-lg">
        {title}
      </h3>

      <p className="text-sm text-zinc-500 mt-2 leading-6">
        {desc}
      </p>

      <div className="mt-5 inline-flex items-center gap-2 text-green-600 text-sm font-medium">

        <div className="w-2 h-2 rounded-full bg-green-500" />

        {active}

      </div>

    </div>
  );
}

/* ===================================
   STATUS
=================================== */

function StatusBadge({
  status,
}: {
  status: string;
}) {

  if (status === "sent") {
    return (
      <div className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
        Sent
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full font-medium">
        Pending
      </div>
    );
  }

  return (
    <div className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full font-medium">
      Failed
    </div>
  );
}

/* ===================================
   ANALYTICS
=================================== */

function AnalyticsCard({
  title,
  value,
}: any) {
  return (
    <div className="border rounded-2xl p-5">

      <p className="text-sm text-zinc-500">
        {title}
      </p>

      <h3 className="text-3xl font-bold mt-2">
        {value}
      </h3>

    </div>
  );
}