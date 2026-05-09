// app/products/invoice-recovery/reminder-center/page.tsx

"use client";

import Layout from "@/components/Layout";

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
} from "lucide-react";

export default function ReminderCenterPage() {
  const reminders = [
    {
      id: 1,
      client: "Acme Inc",
      channel: "Email",
      tone: "Friendly",
      status: "Sent",
      amount: "$2,500",
      time: "2 hours ago",
      icon: Mail,
    },

    {
      id: 2,
      client: "Start Alpha",
      channel: "WhatsApp",
      tone: "Firm",
      status: "Pending",
      amount: "$8,400",
      time: "In 4 hours",
      icon: MessageCircle,
    },

    {
      id: 3,
      client: "Nova Studio",
      channel: "SMS",
      tone: "Final Notice",
      status: "Failed",
      amount: "$1,200",
      time: "Yesterday",
      icon: Smartphone,
    },
  ];

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
                Track deliveries, engagement, failures, and recovery progress.
              </p>

              <div className="flex gap-3 mt-6 flex-wrap">
                <button className="bg-white text-black px-5 py-3 rounded-xl text-sm font-medium hover:bg-zinc-200 transition">
                  Create Reminder
                </button>

                <button className="border border-white/20 px-5 py-3 rounded-xl text-sm hover:bg-white/10 transition">
                  View Analytics
                </button>
              </div>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 gap-4 min-w-[320px]">

              <StatCard
                title="Sent Today"
                value="148"
                icon={CheckCircle2}
              />

              <StatCard
                title="Pending"
                value="23"
                icon={Clock3}
              />

              <StatCard
                title="Failed"
                value="4"
                icon={AlertTriangle}
              />

              <StatCard
                title="AI Recovery"
                value="82%"
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
            active="124 active"
          />

          <ChannelCard
            title="WhatsApp Recovery"
            desc="High-open recovery campaigns."
            icon={MessageCircle}
            active="42 active"
          />

          <ChannelCard
            title="SMS Recovery"
            desc="Fast payment nudges via SMS."
            icon={Smartphone}
            active="18 active"
          />

        </div>

        {/* TABLE */}
        <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden">

          <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Recent Reminder Activity
              </h2>

              <p className="text-sm text-zinc-500 mt-1">
                Track all reminder delivery events
              </p>
            </div>

            <button className="text-sm border px-4 py-2 rounded-xl hover:bg-zinc-50 transition">
              Export Logs
            </button>
          </div>

          <div className="divide-y">
            {reminders.map((r) => {
              const Icon = r.icon;

              return (
                <div
                  key={r.id}
                  className="p-5 flex items-center justify-between hover:bg-zinc-50 transition"
                >

                  <div className="flex items-center gap-4">

                    <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center">
                      <Icon size={20} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-[15px]">
                        {r.client}
                      </h3>

                      <p className="text-sm text-zinc-500 mt-1">
                        {r.channel} • {r.tone}
                      </p>
                    </div>
                  </div>

                  <div className="hidden md:block text-sm font-medium">
                    {r.amount}
                  </div>

                  <div className="hidden md:block text-sm text-zinc-500">
                    {r.time}
                  </div>

                  <div>
                    <StatusBadge status={r.status} />
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
    </Layout>
  );
}

/* =========================
   STATS
========================= */

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

/* =========================
   CHANNEL CARD
========================= */

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

/* =========================
   STATUS
========================= */

function StatusBadge({
  status,
}: {
  status: string;
}) {
  if (status === "Sent") {
    return (
      <div className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
        Sent
      </div>
    );
  }

  if (status === "Pending") {
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