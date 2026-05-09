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
  CheckCircle2,
  Clock3,
  Activity,
  BrainCircuit,
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
     LOAD ANALYTICS
  ========================================= */

  const loadAnalytics =
    async () => {
      try {

        const res =
          await axios.get(
            "/api/recovery-analytics"
          );

        setData(
          res.data
        );

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
        <div className="p-10">
          Loading analytics...
        </div>
      </Layout>
    );
  }

  const stats =
    data?.stats || {};

  const recent =
    data?.recent || [];

  return (
    <Layout>

      <div className="space-y-6">

        {/* HERO */}

        <div className="rounded-[30px] overflow-hidden bg-gradient-to-r from-indigo-900 via-black to-slate-900 text-white p-8 border border-indigo-800">

          <div className="flex items-start justify-between flex-wrap gap-6">

            <div className="max-w-2xl">

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs mb-5 border border-white/10">
                <BrainCircuit size={14} />
                Recovery Analytics
              </div>

              <h1 className="text-4xl font-bold leading-tight">
                Track recovery performance in real-time
              </h1>

              <p className="text-zinc-300 mt-4 text-[15px] leading-7">
                Monitor payment recovery, reminder performance,
                recovery channels, and AI-based collection insights.
              </p>

            </div>

            {/* KPI */}

            <div className="grid grid-cols-2 gap-4 min-w-[340px]">

              <AnalyticsHeroCard
                title="Recovered"
                value={`$${stats.recovered || 0}`}
                icon={DollarSign}
              />

              <AnalyticsHeroCard
                title="Recovery Rate"
                value={`${stats.recoveryRate || 0}%`}
                icon={TrendingUp}
              />

              <AnalyticsHeroCard
                title="Pending"
                value={`$${stats.pending || 0}`}
                icon={Clock3}
              />

              <AnalyticsHeroCard
                title="Failed"
                value={stats.failed || 0}
                icon={AlertTriangle}
              />

            </div>

          </div>
        </div>

        {/* CHANNEL PERFORMANCE */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <ChannelCard
            title="Email Recovery"
            value={stats.email || 0}
            icon={Mail}
            color="bg-blue-100"
          />

          <ChannelCard
            title="WhatsApp Recovery"
            value={stats.whatsapp || 0}
            icon={MessageCircle}
            color="bg-green-100"
          />

          <ChannelCard
            title="SMS Recovery"
            value={stats.sms || 0}
            icon={Smartphone}
            color="bg-orange-100"
          />

        </div>

        {/* AI INSIGHTS */}

        <div className="bg-white border border-zinc-200 rounded-3xl p-7">

          <div className="flex items-center gap-3 mb-6">

            <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-indigo-600" />
            </div>

            <div>

              <h2 className="text-xl font-semibold">
                AI Recovery Insights
              </h2>

              <p className="text-sm text-zinc-500 mt-1">
                Smart collection recommendations
              </p>

            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            <InsightCard
              title="Best Recovery Channel"
              value={
                stats.bestChannel ||
                "Email"
              }
            />

            <InsightCard
              title="Best Reminder Tone"
              value={
                stats.bestTone ||
                "Friendly"
              }
            />

            <InsightCard
              title="Average Recovery Time"
              value={`${stats.avgRecoveryDays || 0} days`}
            />

          </div>

        </div>

        {/* RECENT RECOVERY EVENTS */}

        <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden">

          <div className="p-6 border-b border-zinc-100">

            <h2 className="text-xl font-semibold">
              Recent Recovery Activity
            </h2>

            <p className="text-sm text-zinc-500 mt-1">
              Latest payment recovery events
            </p>

          </div>

          <div className="divide-y">

            {recent.length === 0 && (
              <div className="p-10 text-center text-zinc-500">
                No recovery data yet
              </div>
            )}

            {recent.map((item: any) => (

              <div
                key={item.id}
                className="p-5 flex items-center justify-between hover:bg-zinc-50 transition"
              >

                <div className="flex items-center gap-4">

                  <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center">

                    {item.channel ===
                    "whatsapp" ? (
                      <MessageCircle size={20} />
                    ) : item.channel ===
                      "sms" ? (
                      <Smartphone size={20} />
                    ) : (
                      <Mail size={20} />
                    )}

                  </div>

                  <div>

                    <h3 className="font-semibold text-[15px]">
                      {
                        item.invoice
                          ?.clientName
                      }
                    </h3>

                    <p className="text-sm text-zinc-500 mt-1">
                      {
                        item.channel
                      }{" "}
                      •{" "}
                      {
                        item.status
                      }
                    </p>

                  </div>

                </div>

                <div className="hidden md:block text-sm font-medium">
                  $
                  {
                    item.invoice
                      ?.amount
                  }
                </div>

                <div className="hidden md:block text-sm text-zinc-500">
                  {new Date(
                    item.createdAt
                  ).toLocaleString()}
                </div>

                <div>

                  {item.status ===
                  "sent" ? (
                    <div className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                      Sent
                    </div>
                  ) : (
                    <div className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full font-medium">
                      Failed
                    </div>
                  )}

                </div>

              </div>
            ))}

          </div>

        </div>
      </div>

    </Layout>
  );
}

/* =========================================
   HERO CARD
========================================= */

function AnalyticsHeroCard({
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

/* =========================================
   CHANNEL CARD
========================================= */

function ChannelCard({
  title,
  value,
  icon: Icon,
  color,
}: any) {
  return (
    <div className="bg-white border border-zinc-200 rounded-3xl p-6">

      <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-5`}>
        <Icon size={20} />
      </div>

      <h3 className="font-semibold text-lg">
        {title}
      </h3>

      <div className="mt-4 text-4xl font-bold">
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
    <div className="rounded-2xl border border-zinc-200 p-5">

      <p className="text-sm text-zinc-500">
        {title}
      </p>

      <h3 className="text-2xl font-bold mt-3">
        {value}
      </h3>

    </div>
  );
}