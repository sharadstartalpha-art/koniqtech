// app/products/invoice-recovery/ai-assistant/page.tsx

"use client";

import { useEffect, useState } from "react";

import axios from "axios";

import Layout from "@/components/Layout";

import toast from "react-hot-toast";

import {
  BrainCircuit,
  Send,
  Sparkles,
  Mail,
  MessageCircle,
  Smartphone,
  TrendingUp,
  AlertTriangle,
  Clock3,
  Bot,
} from "lucide-react";

export default function AIAssistantPage() {

  /* =========================================
     STATES
  ========================================= */

  const [loading, setLoading] =
    useState(false);

  const [messages, setMessages] =
    useState<any[]>([
      {
        role: "assistant",

        content:
          "Hello 👋 I’m your AI Recovery Assistant. Ask me about invoices, reminders, payment recovery, or collection strategies.",
      },
    ]);

  const [input, setInput] =
    useState("");

  const [analytics, setAnalytics] =
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

        setAnalytics(
          res.data.stats
        );

      } catch (err) {

        console.error(err);
      }
    };

  useEffect(() => {
    loadAnalytics();
  }, []);

  /* =========================================
     SEND MESSAGE
  ========================================= */

  const sendMessage =
    async () => {

      if (!input.trim()) {
        return;
      }

      const userMessage = {
        role: "user",
        content: input,
      };

      setMessages((prev) => [
        ...prev,
        userMessage,
      ]);

      setInput("");

      try {

        setLoading(true);

        const res =
          await axios.post(
            "/api/ai-assistant",
            {
              message:
                input,
            }
          );

        setMessages((prev) => [
          ...prev,
          {
            role:
              "assistant",

            content:
              res.data.reply,
          },
        ]);

      } catch (err) {

        console.error(err);

        toast.error(
          "AI request failed"
        );

      } finally {

        setLoading(false);
      }
    };

  return (
    <Layout>

      <div className="space-y-6">

        {/* HERO */}

        <div className="rounded-[30px] overflow-hidden bg-gradient-to-r from-violet-900 via-black to-slate-900 text-white p-8 border border-violet-800">

          <div className="flex items-start justify-between flex-wrap gap-6">

            <div className="max-w-2xl">

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs mb-5 border border-white/10">
                <BrainCircuit size={14} />
                AI Recovery Assistant
              </div>

              <h1 className="text-4xl font-bold leading-tight">
                Smart AI-powered invoice recovery
              </h1>

              <p className="text-zinc-300 mt-4 text-[15px] leading-7">
                Analyze recovery performance, generate reminder strategies,
                improve collection rates, and automate communication.
              </p>

            </div>

            {/* AI SCORE */}

            <div className="grid grid-cols-2 gap-4 min-w-[320px]">

              <StatCard
                title="Recovery Rate"
                value={`${analytics?.recoveryRate || 0}%`}
                icon={TrendingUp}
              />

              <StatCard
                title="Pending"
                value={`$${analytics?.pending || 0}`}
                icon={Clock3}
              />

              <StatCard
                title="Failed"
                value={analytics?.failed || 0}
                icon={AlertTriangle}
              />

              <StatCard
                title="Recovered"
                value={`$${analytics?.recovered || 0}`}
                icon={Sparkles}
              />

            </div>

          </div>
        </div>

        {/* AI FEATURES */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <FeatureCard
            title="Email AI"
            desc="Generate optimized reminder emails"
            icon={Mail}
          />

          <FeatureCard
            title="WhatsApp AI"
            desc="Create conversational recovery messages"
            icon={MessageCircle}
          />

          <FeatureCard
            title="SMS AI"
            desc="Generate high-converting SMS reminders"
            icon={Smartphone}
          />

        </div>

        {/* CHAT */}

        <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden">

          {/* HEADER */}

          <div className="p-6 border-b border-zinc-100 flex items-center gap-3">

            <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center">
              <Bot className="w-5 h-5 text-violet-600" />
            </div>

            <div>

              <h2 className="text-lg font-semibold">
                AI Recovery Chat
              </h2>

              <p className="text-sm text-zinc-500">
                Ask AI about recovery optimization
              </p>

            </div>

          </div>

          {/* MESSAGES */}

          <div className="h-[500px] overflow-y-auto p-6 space-y-4 bg-zinc-50">

            {messages.map(
              (
                msg,
                index
              ) => (

                <div
                  key={index}
                  className={`flex ${
                    msg.role ===
                    "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  <div
                    className={`max-w-[80%] rounded-3xl px-5 py-4 text-sm leading-7 ${
                      msg.role ===
                      "user"
                        ? "bg-black text-white"
                        : "bg-white border border-zinc-200"
                    }`}
                  >
                    {msg.content}
                  </div>

                </div>
              )
            )}

            {loading && (

              <div className="flex justify-start">

                <div className="bg-white border border-zinc-200 rounded-3xl px-5 py-4 text-sm">
                  AI is thinking...
                </div>

              </div>
            )}

          </div>

          {/* INPUT */}

          <div className="p-5 border-t border-zinc-100 flex items-center gap-3">

            <input
              placeholder="Ask AI anything about invoice recovery..."
              value={input}
              onChange={(e) =>
                setInput(
                  e.target.value
                )
              }
              onKeyDown={(e) => {
                if (
                  e.key ===
                  "Enter"
                ) {
                  sendMessage();
                }
              }}
              className="flex-1 h-14 border border-zinc-300 rounded-2xl px-5 outline-none focus:ring-4 focus:ring-violet-100 focus:border-violet-500"
            />

            <button
              onClick={
                sendMessage
              }
              disabled={
                loading
              }
              className="h-14 px-6 rounded-2xl bg-black hover:bg-zinc-900 text-white font-medium flex items-center gap-2"
            >
              <Send size={16} />
              Send
            </button>

          </div>

        </div>
      </div>

    </Layout>
  );
}

/* =========================================
   FEATURE CARD
========================================= */

function FeatureCard({
  title,
  desc,
  icon: Icon,
}: any) {
  return (
    <div className="bg-white border border-zinc-200 rounded-3xl p-6 hover:shadow-md transition">

      <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center mb-5">
        <Icon className="w-5 h-5 text-violet-600" />
      </div>

      <h3 className="font-semibold text-lg">
        {title}
      </h3>

      <p className="text-sm text-zinc-500 mt-2 leading-6">
        {desc}
      </p>

    </div>
  );
}

/* =========================================
   STAT CARD
========================================= */

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