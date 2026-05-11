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


  function SimpleStat({
  title,
  value,
}: any) {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-5">

      <p className="text-sm text-gray-500">
        {title}
      </p>

      <h3 className="text-3xl font-bold mt-2">
        {value}
      </h3>

    </div>
  );
}

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

  {/* HEADER */}

  <div className="flex items-center justify-between flex-wrap gap-4">

    <div>

      <h1 className="text-4xl font-bold text-gray-900">
        Recovery
      </h1>

      <p className="text-gray-500 mt-2">
        Manage reminders, recovery channels, and payment follow-ups.
      </p>

    </div>

    <button
      onClick={() =>
        setOpenCreate(true)
      }
      className="
        h-12 px-5 rounded-2xl
        bg-black text-white
        font-semibold
        hover:bg-gray-900
        transition
      "
    >
      Send Reminder
    </button>

  </div>

  {/* STATS */}

  <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

    <SimpleStat
      title="Sent"
      value={stats.sent || 0}
    />

    <SimpleStat
      title="Pending"
      value={stats.pending || 0}
    />

    <SimpleStat
      title="Failed"
      value={stats.failed || 0}
    />

    <SimpleStat
      title="Opened"
      value={stats.opened || 0}
    />

  </div>

  {/* CHANNELS */}

  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

    <ChannelCard
      title="Email"
      desc="Recovery emails"
      icon={Mail}
      active={`${stats?.channels?.email || 0} sent`}
    />

    <ChannelCard
      title="WhatsApp"
      desc="WhatsApp reminders"
      icon={MessageCircle}
      active={`${stats?.channels?.whatsapp || 0} sent`}
    />

    <ChannelCard
      title="SMS"
      desc="SMS follow-ups"
      icon={Smartphone}
      active={`${stats?.channels?.sms || 0} sent`}
    />

  </div>

  {/* QUICK INSIGHTS */}

  <div className="bg-black text-white rounded-3xl p-6">

    <div className="flex items-center gap-3">

      <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center">
        <BrainCircuit className="w-5 h-5 text-yellow-300" />
      </div>

      <div>

        <h3 className="text-lg font-semibold">
          AI Recovery Insights
        </h3>

        <p className="text-sm text-gray-400">
          Smart collection recommendations
        </p>

      </div>

    </div>

    <div className="mt-5 space-y-4">

      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <p className="text-sm text-gray-200 leading-7">
          Clients respond best to reminders between 9 AM and 11 AM.
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <p className="text-sm text-gray-200 leading-7">
          WhatsApp reminders currently outperform email recovery by 21%.
        </p>
      </div>

    </div>

  </div>

  {/* ACTIVITY */}

  <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden">

    <div className="p-6 border-b border-gray-100">

      <h2 className="text-xl font-semibold">
        Recent Activity
      </h2>

      <p className="text-sm text-gray-500 mt-1">
        Latest recovery events
      </p>

    </div>

    <div className="divide-y">

      {logs.length === 0 && (

        <div className="p-10 text-center text-gray-500">
          No reminder activity yet
        </div>

      )}

      {logs.map((log: any) => {

        const Icon =
          log.channel === "whatsapp"
            ? MessageCircle
            : log.channel === "sms"
            ? Smartphone
            : Mail;

        return (

          <div
            key={log.id}
            className="p-5 flex items-center justify-between hover:bg-gray-50 transition"
          >

            <div className="flex items-center gap-4">

              <div className="w-11 h-11 rounded-2xl bg-gray-100 flex items-center justify-center">
                <Icon size={18} />
              </div>

              <div>

                <h3 className="font-medium">
                  {log.invoice?.clientName ||
                    "Unknown Client"}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  {log.channel} • {log.subject}
                </p>

              </div>

            </div>

            <div className="hidden lg:block text-sm text-gray-500">
              {new Date(
                log.createdAt
              ).toLocaleString()}
            </div>

            <StatusBadge
              status={log.status}
            />

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