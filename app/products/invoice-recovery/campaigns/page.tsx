// app/products/invoice-recovery/campaigns/page.tsx

"use client";

import { useEffect, useState } from "react";

import axios from "axios";

import Layout from "@/components/Layout";

import toast from "react-hot-toast";

import {
  Rocket,
  Plus,
  Mail,
  MessageCircle,
  Smartphone,
  CalendarDays,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Send,
  Sparkles,
  Trash2,
} from "lucide-react";

export default function CampaignsPage() {

  /* =========================================
     STATES
  ========================================= */

  const [campaigns, setCampaigns] =
    useState<any[]>([]);

  const [stats, setStats] =
    useState<any>({});

  const [loading, setLoading] =
    useState(true);

  const [openCreate, setOpenCreate] =
    useState(false);

  /* =========================================
     FORM
  ========================================= */

  const [name, setName] =
    useState("");

  const [channel, setChannel] =
    useState("email");

  const [message, setMessage] =
    useState("");

  const [scheduleDate, setScheduleDate] =
    useState("");

  /* =========================================
     LOAD
  ========================================= */

  const loadCampaigns =
    async () => {
      try {

        const res =
          await axios.get(
            "/api/campaigns"
          );

        setCampaigns(
          res.data.campaigns || []
        );

        setStats(
          res.data.stats || {}
        );

      } catch (err) {

        console.error(err);

        toast.error(
          "Failed to load campaigns"
        );

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {
    loadCampaigns();
  }, []);

  /* =========================================
     CREATE CAMPAIGN
  ========================================= */

  const createCampaign =
    async () => {
      try {

        if (
          !name ||
          !message
        ) {
          toast.error(
            "Fill all required fields"
          );

          return;
        }

        await axios.post(
          "/api/campaigns",
          {
            name,
            channel,
            message,
            scheduleDate,
          }
        );

        toast.success(
          "Campaign created"
        );

        setOpenCreate(false);

        setName("");
        setMessage("");
        setScheduleDate("");

        loadCampaigns();

      } catch (err) {

        console.error(err);

        toast.error(
          "Failed to create campaign"
        );
      }
    };

  /* =========================================
     DELETE
  ========================================= */

  const deleteCampaign =
    async (
      id: string
    ) => {
      try {

        await axios.delete(
          `/api/campaigns?id=${id}`
        );

        toast.success(
          "Campaign deleted"
        );

        loadCampaigns();

      } catch (err) {

        console.error(err);

        toast.error(
          "Delete failed"
        );
      }
    };

  return (
    <Layout>

      <div className="space-y-6">

        {/* HERO */}

        <div className="rounded-[30px] overflow-hidden bg-gradient-to-r from-orange-600 via-red-600 to-black text-white p-8 border border-orange-700">

          <div className="flex items-start justify-between flex-wrap gap-6">

            <div className="max-w-2xl">

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs mb-5 border border-white/10">
                <Rocket size={14} />
                Recovery Campaigns
              </div>

              <h1 className="text-4xl font-bold leading-tight">
                Launch automated payment recovery campaigns
              </h1>

              <p className="text-orange-100 mt-4 text-[15px] leading-7">
                Create Email, WhatsApp, and SMS recovery campaigns for overdue invoices.
              </p>

              <button
                onClick={() =>
                  setOpenCreate(true)
                }
                className="mt-6 bg-white text-black px-5 py-3 rounded-xl text-sm font-medium hover:bg-zinc-200 transition flex items-center gap-2"
              >
                <Plus size={16} />
                Create Campaign
              </button>

            </div>

            {/* STATS */}

            <div className="grid grid-cols-2 gap-4 min-w-[320px]">

              <StatCard
                title="Total"
                value={stats.total || 0}
                icon={Rocket}
              />

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

            </div>

          </div>
        </div>

        {/* LIST */}

        <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden">

          <div className="p-6 border-b border-zinc-100">

            <h2 className="text-xl font-semibold">
              Campaign List
            </h2>

            <p className="text-sm text-zinc-500 mt-1">
              Manage recovery outreach campaigns
            </p>

          </div>

          <div className="divide-y">

            {loading && (
              <div className="p-10 text-center">
                Loading campaigns...
              </div>
            )}

            {!loading &&
              campaigns.length === 0 && (
                <div className="p-10 text-center text-zinc-500">
                  No campaigns created yet
                </div>
              )}

            {campaigns.map(
              (
                campaign
              ) => (

                <div
                  key={
                    campaign.id
                  }
                  className="p-5 flex items-center justify-between hover:bg-zinc-50 transition"
                >

                  <div className="flex items-center gap-4">

                    <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center">

                      {campaign.channel ===
                      "whatsapp" ? (
                        <MessageCircle
                          size={20}
                        />
                      ) : campaign.channel ===
                        "sms" ? (
                        <Smartphone
                          size={20}
                        />
                      ) : (
                        <Mail
                          size={20}
                        />
                      )}

                    </div>

                    <div>

                      <h3 className="font-semibold text-[15px]">
                        {
                          campaign.name
                        }
                      </h3>

                      <p className="text-sm text-zinc-500 mt-1">
                        {
                          campaign.channel
                        }
                      </p>

                    </div>

                  </div>

                  <div className="hidden md:block text-sm text-zinc-500">
                    {campaign.scheduleDate
                      ? new Date(
                          campaign.scheduleDate
                        ).toLocaleDateString()
                      : "Instant"}
                  </div>

                  <div>

                    <StatusBadge
                      status={
                        campaign.status
                      }
                    />

                  </div>

                  <button
                    onClick={() =>
                      deleteCampaign(
                        campaign.id
                      )
                    }
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <Trash2
                      size={18}
                    />
                  </button>

                </div>
              )
            )}

          </div>
        </div>
      </div>

      {/* CREATE MODAL */}

      {openCreate && (

        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-xl rounded-3xl p-7">

            <div className="flex items-center justify-between mb-6">

              <div>

                <h2 className="text-2xl font-bold">
                  Create Campaign
                </h2>

                <p className="text-sm text-zinc-500 mt-1">
                  Launch automated recovery outreach
                </p>

              </div>

              <button
                onClick={() =>
                  setOpenCreate(false)
                }
              >
                ✕
              </button>

            </div>

            <div className="space-y-4">

              <input
                placeholder="Campaign name"
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
                className="w-full border rounded-2xl px-4 py-3 outline-none"
              />

              <select
                value={channel}
                onChange={(e) =>
                  setChannel(
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
                rows={6}
                placeholder="Campaign message..."
                value={message}
                onChange={(e) =>
                  setMessage(
                    e.target.value
                  )
                }
                className="w-full border rounded-2xl px-4 py-3 outline-none"
              />

              <div>

                <label className="text-sm font-medium mb-2 block">
                  Schedule Date
                </label>

                <div className="relative">

                  <CalendarDays className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />

                  <input
                    type="datetime-local"
                    value={
                      scheduleDate
                    }
                    onChange={(e) =>
                      setScheduleDate(
                        e.target.value
                      )
                    }
                    className="w-full border rounded-2xl pl-11 pr-4 py-3 outline-none"
                  />

                </div>

              </div>

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
                  createCampaign
                }
                className="bg-black text-white px-5 py-3 rounded-2xl flex items-center gap-2"
              >
                <Send size={16} />
                Launch Campaign
              </button>

            </div>

          </div>

        </div>
      )}

    </Layout>
  );
}

/* =========================================
   STATUS
========================================= */

function StatusBadge({
  status,
}: any) {

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

/* =========================================
   STAT CARD
========================================= */

function StatCard({
  title,
  value,
  icon: Icon,
}: any) {
  return (
    <div className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-5">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-orange-100 text-sm">
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