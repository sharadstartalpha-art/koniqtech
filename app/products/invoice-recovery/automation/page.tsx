"use client";

import Layout from "@/components/Layout";

import {
  Bot,
  Mail,
  MessageSquare,
  Smartphone,
  Clock3,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export default function AutomationPage() {
  const workflows = [
    {
      step: 1,
      delay: "1 Day After Due",
      channel: "Email",
      tone: "Friendly",
      icon: Mail,
      color: "bg-blue-50 text-blue-600",
    },

    {
      step: 2,
      delay: "3 Days After Due",
      channel: "WhatsApp",
      tone: "Firm",
      icon: MessageSquare,
      color: "bg-green-50 text-green-600",
    },

    {
      step: 3,
      delay: "5 Days After Due",
      channel: "SMS",
      tone: "Final Warning",
      icon: Smartphone,
      color: "bg-orange-50 text-orange-600",
    },
  ];

  return (
    <Layout>
      <div className="space-y-8">

        {/* HERO */}
        <div className="bg-gradient-to-br from-black to-gray-900 rounded-3xl p-8 text-white overflow-hidden relative">

          <div className="absolute right-0 top-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-3xl">

            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm mb-5">
              <Bot size={16} />
              AI Recovery Automation
            </div>

            <h1 className="text-4xl font-bold leading-tight">
              Put your invoice recovery
              on autopilot
            </h1>

            <p className="text-gray-300 mt-4 text-lg leading-8">
              Automatically recover unpaid invoices using
              intelligent reminders via Email, WhatsApp,
              and SMS.
            </p>

            <div className="flex flex-wrap gap-3 mt-8">

              <button className="bg-white text-black px-5 py-3 rounded-2xl font-semibold hover:opacity-90 transition">
                Create Workflow
              </button>

              <button className="border border-white/20 px-5 py-3 rounded-2xl font-semibold hover:bg-white/10 transition">
                View Analytics
              </button>

            </div>

          </div>

        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

          <StatCard
            title="Recovered Revenue"
            value="$12,480"
            subtitle="+18% this month"
          />

          <StatCard
            title="Active Workflows"
            value="3"
            subtitle="2 running"
          />

          <StatCard
            title="Reminders Sent"
            value="482"
            subtitle="Across all channels"
          />

          <StatCard
            title="Recovery Rate"
            value="74%"
            subtitle="Above industry average"
          />

        </div>

        {/* AUTOMATION FLOW */}
        <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden">

          <div className="p-6 border-b border-gray-100 flex items-center justify-between">

            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Recovery Workflow
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Automatically escalate reminders until payment is completed
              </p>
            </div>

            <button className="text-sm border px-4 py-2 rounded-xl hover:bg-gray-50 transition">
              Edit Workflow
            </button>

          </div>

          <div className="p-6 space-y-5">

            {workflows.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.step}
                  className="flex items-center gap-4"
                >

                  {/* STEP */}
                  <div className="w-11 h-11 rounded-2xl bg-black text-white flex items-center justify-center font-semibold">
                    {item.step}
                  </div>

                  {/* CARD */}
                  <div className="flex-1 border border-gray-200 rounded-2xl p-5 flex items-center justify-between">

                    <div className="flex items-center gap-4">

                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.color}`}
                      >
                        <Icon size={22} />
                      </div>

                      <div>

                        <h3 className="font-semibold text-gray-900">
                          {item.channel} Reminder
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          {item.delay} • {item.tone}
                        </p>

                      </div>

                    </div>

                    <div className="flex items-center gap-2 text-green-600 text-sm font-medium">

                      <CheckCircle2 size={18} />

                      Active

                    </div>

                  </div>

                  {/* ARROW */}
                  {index !== workflows.length - 1 && (
                    <ArrowRight
                      size={18}
                      className="text-gray-400"
                    />
                  )}

                </div>
              );
            })}

          </div>

        </div>

        {/* FEATURES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <FeatureCard
            icon={Clock3}
            title="Smart Delays"
            description="Automatically send reminders after due dates with custom timing."
          />

          <FeatureCard
            icon={Mail}
            title="Multi-channel Recovery"
            description="Recover invoices through Email, WhatsApp, and SMS."
          />

          <FeatureCard
            icon={Bot}
            title="AI Escalation"
            description="AI adjusts tone from friendly to firm based on payment behavior."
          />

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
  subtitle,
}: any) {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-5">

      <p className="text-sm text-gray-500">
        {title}
      </p>

      <h3 className="text-3xl font-bold mt-3 text-gray-900">
        {value}
      </h3>

      <p className="text-sm text-green-600 mt-2">
        {subtitle}
      </p>

    </div>
  );
}

/* =========================
   FEATURE CARD
========================= */

function FeatureCard({
  icon: Icon,
  title,
  description,
}: any) {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6">

      <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-5">
        <Icon size={22} />
      </div>

      <h3 className="text-lg font-semibold text-gray-900">
        {title}
      </h3>

      <p className="text-sm text-gray-500 leading-7 mt-3">
        {description}
      </p>

    </div>
  );
}