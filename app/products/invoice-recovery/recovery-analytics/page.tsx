// app/products/invoice-recovery/recovery-analytics/page.tsx

"use client";

import { useEffect, useState } from "react";

import axios from "axios";

import Layout from "@/components/Layout";

import {
  DollarSign,
  Mail,
  MessageCircle,
  Smartphone,
  TrendingUp,
  AlertTriangle,
  Clock3,
  BrainCircuit,
  Activity,
} from "lucide-react";

export default function RecoveryAnalyticsPage() {

  /* =========================================
     STATES
  ========================================= */

  const [loading, setLoading] =
    useState(true);

  const [data, setData] =
    useState<any>(null);

  /* =========================================
     LOAD
  ========================================= */

  const loadAnalytics =
    async () => {
      try {

        const res =
          await axios.get(
            "/api/recovery-analytics"
          );

        setData(res.data);

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {
    loadAnalytics();
  }, []);

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <Layout>

        <div className="space-y-6">

          <div className="h-10 w-64 bg-gray-200 rounded animate-pulse" />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

            {[1, 2, 3, 4].map(
              (i) => (
                <div
                  key={i}
                  className="h-36 rounded-3xl bg-white border border-gray-200 animate-pulse"
                />
              )
            )}

          </div>

        </div>

      </Layout>
    );
  }

  /* =========================================
     DATA
  ========================================= */

  const stats =
    data?.stats || {};

  const recent =
    data?.recent || [];

  return (
    <Layout>

      <div className="space-y-8">

        {/* =========================================
           HEADER
        ========================================= */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          <div>

            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Recovery Analytics
            </h1>

            <p className="text-gray-500 mt-2 text-base">
              Track payment recovery, reminder delivery,
              and collection performance.
            </p>

          </div>

          <div className="flex items-center gap-3">

            <div className="h-12 px-5 rounded-2xl bg-black text-white flex items-center gap-2 text-sm font-semibold">

              <Activity className="w-4 h-4" />

              Live Recovery Data

            </div>

          </div>

        </div>

        {/* =========================================
           MAIN STATS
        ========================================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

          <StatCard
            title="Recovered"
            value={`$${stats.recovered || 0}`}
            icon={DollarSign}
            color="green"
          />

          <StatCard
            title="Pending"
            value={`$${stats.pending || 0}`}
            icon={Clock3}
            color="orange"
          />

          <StatCard
            title="Recovery Rate"
            value={`${stats.recoveryRate || 0}%`}
            icon={TrendingUp}
            color="blue"
          />

          <StatCard
            title="Failed"
            value={stats.failed || 0}
            icon={AlertTriangle}
            color="red"
          />

        </div>

        {/* =========================================
           CHANNEL PERFORMANCE
        ========================================= */}

        <div>

          <div className="mb-5">

            <h2 className="text-2xl font-bold text-gray-900">
              Channel Performance
            </h2>

            <p className="text-gray-500 mt-1">
              Recovery performance by communication channel
            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            <ChannelCard
              title="Email Recovery"
              value={stats.email || 0}
              icon={Mail}
              bg="bg-blue-100"
              text="text-blue-600"
            />

            <ChannelCard
              title="WhatsApp Recovery"
              value={stats.whatsapp || 0}
              icon={MessageCircle}
              bg="bg-green-100"
              text="text-green-600"
            />

            <ChannelCard
              title="SMS Recovery"
              value={stats.sms || 0}
              icon={Smartphone}
              bg="bg-orange-100"
              text="text-orange-600"
            />

          </div>

        </div>

        {/* =========================================
           AI INSIGHTS
        ========================================= */}

        <div className="bg-gradient-to-br from-black to-gray-900 rounded-3xl p-7 text-white overflow-hidden relative">

          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />

          <div className="relative z-10">

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <BrainCircuit className="w-6 h-6 text-yellow-300" />
              </div>

              <div>

                <h3 className="text-2xl font-semibold">
                  AI Recovery Insights
                </h3>

                <p className="text-sm text-gray-300 mt-1">
                  Smart collection recommendations
                </p>

              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-7">

              <InsightCard
                title="Best Channel"
                value={
                  stats.bestChannel ||
                  "Email"
                }
              />

              <InsightCard
                title="Best Tone"
                value={
                  stats.bestTone ||
                  "Friendly"
                }
              />

              <InsightCard
                title="Avg Recovery Time"
                value={`${stats.avgRecoveryDays || 0} days`}
              />

            </div>

            <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-5">

              <p className="text-gray-200 leading-7">

                {stats.recoveryRate > 60
                  ? "Your recovery system is performing well. Automated reminders are successfully recovering invoices."
                  : "Recovery rate is below target. Increase reminder frequency and enable multi-channel recovery flows."}

              </p>

            </div>

          </div>

        </div>

        {/* =========================================
           RECENT ACTIVITY
        ========================================= */}

        <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden">

          <div className="p-6 border-b border-gray-100">

            <h2 className="text-xl font-semibold">
              Recent Recovery Activity
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Latest reminder delivery events
            </p>

          </div>

          <div className="divide-y">

            {recent.length === 0 && (

              <div className="p-10 text-center text-gray-500">
                No recovery activity yet
              </div>

            )}

            {recent.map((item: any) => {

              const Icon =
                item.channel === "whatsapp"
                  ? MessageCircle
                  : item.channel === "sms"
                  ? Smartphone
                  : Mail;

              return (

                <div
                  key={item.id}
                  className="p-5 flex items-center justify-between hover:bg-gray-50 transition"
                >

                  <div className="flex items-center gap-4">

                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                      <Icon size={20} />
                    </div>

                    <div>

                      <h3 className="font-semibold text-[15px]">

                        {item.invoice?.clientName ||
                          item.recipient ||
                          "Unknown Client"}

                      </h3>

                      <p className="text-sm text-gray-500 mt-1">

                        {item.channel} • {item.status}

                      </p>

                    </div>

                  </div>

                  <div className="hidden md:block text-sm font-medium">

                    $
                    {item.invoice?.amount || 0}

                  </div>

                  <div className="hidden lg:block text-sm text-gray-500">

                    {new Date(
                      item.createdAt
                    ).toLocaleString()}

                  </div>

                  <StatusBadge
                    status={item.status}
                  />

                </div>
              );
            })}

          </div>

        </div>

      </div>

    </Layout>
  );
}

/* =========================================
   STAT CARD
========================================= */

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: any) {

  const colors: any = {
    green:
      "bg-green-100 text-green-600",

    orange:
      "bg-orange-100 text-orange-600",

    blue:
      "bg-blue-100 text-blue-600",

    red:
      "bg-red-100 text-red-600",
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <h2 className="text-4xl font-bold text-gray-900 mt-4">
            {value}
          </h2>

        </div>

        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>

      </div>

    </div>
  );
}

/* =========================================
   CHANNEL CARD
========================================= */

function ChannelCard({
  title,
  value,
  icon: Icon,
  bg,
  text,
}: any) {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">

      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${bg}`}>

        <Icon className={`w-5 h-5 ${text}`} />

      </div>

      <h3 className="font-semibold text-lg mt-5">
        {title}
      </h3>

      <div className="mt-4 text-4xl font-bold text-gray-900">
        {value}
      </div>

    </div>
  );
}

/* =========================================
   INSIGHT CARD
========================================= */

function InsightCard({
  title,
  value,
}: any) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">

      <p className="text-sm text-gray-400">
        {title}
      </p>

      <h3 className="text-2xl font-bold mt-3">
        {value}
      </h3>

    </div>
  );
}

/* =========================================
   STATUS BADGE
========================================= */

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