// app/products/invoice-recovery/whatsapp/page.tsx

"use client";

import { useEffect, useState } from "react";

import axios from "axios";

import Layout from "@/components/Layout";

import toast from "react-hot-toast";

import {
  MessageCircle,
  Send,
  Phone,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Smartphone,
} from "lucide-react";

export default function WhatsAppRecoveryPage() {

  /* =========================================
     STATES
  ========================================= */

  const [loading, setLoading] =
    useState(true);

  const [logs, setLogs] =
    useState<any[]>([]);

  const [openSend, setOpenSend] =
    useState(false);

  /* =========================================
     FORM
  ========================================= */

  const [invoiceId, setInvoiceId] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [message, setMessage] =
    useState("");

  /* =========================================
     LOAD DATA
  ========================================= */

  const loadLogs = async () => {
    try {

      const res =
        await axios.get(
          "/api/reminder-center"
        );

      const whatsappLogs =
        (
          res.data.logs || []
        ).filter(
          (l: any) =>
            l.channel ===
            "whatsapp"
        );

      setLogs(
        whatsappLogs
      );

    } catch (err) {

      console.error(err);

      toast.error(
        "Failed to load WhatsApp logs"
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  /* =========================================
     SEND WHATSAPP
  ========================================= */

  const sendWhatsApp =
    async () => {
      try {

        if (
          !invoiceId ||
          !phone
        ) {
          toast.error(
            "Invoice ID & phone required"
          );

          return;
        }

        await axios.post(
          "/api/reminder-center",
          {
            invoiceId,

            email:
              "whatsapp@koniqtech.com",

            amount: 0,

            type:
              "friendly",

            mode:
              "manual",

            channel:
              "whatsapp",

            html: `<p>${message}</p>`,

            text:
              message,

            phone,
          }
        );

        toast.success(
          "WhatsApp reminder sent"
        );

        setOpenSend(false);

        loadLogs();

      } catch (err) {

        console.error(err);

        toast.error(
          "Failed to send WhatsApp reminder"
        );
      }
    };

  /* =========================================
     STATS
  ========================================= */

  const sent =
    logs.filter(
      (l) =>
        l.status ===
        "sent"
    ).length;

  const pending =
    logs.filter(
      (l) =>
        l.status ===
        "pending"
    ).length;

  const failed =
    logs.filter(
      (l) =>
        l.status ===
        "failed"
    ).length;

  return (
    <Layout>

      <div className="space-y-6">

        {/* HERO */}

        <div className="rounded-[28px] overflow-hidden bg-gradient-to-r from-green-700 via-green-800 to-black text-white p-8 border border-green-900">

          <div className="flex items-start justify-between flex-wrap gap-6">

            <div className="max-w-2xl">

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs mb-5 border border-white/10">
                <MessageCircle size={14} />
                WhatsApp Recovery
              </div>

              <h1 className="text-4xl font-bold leading-tight">
                Recover unpaid invoices through WhatsApp
              </h1>

              <p className="text-green-100 mt-4 text-[15px] leading-7">
                Send instant recovery reminders with very high open rates.
              </p>

              <button
                onClick={() =>
                  setOpenSend(true)
                }
                className="mt-6 bg-white text-black px-5 py-3 rounded-xl text-sm font-medium hover:bg-zinc-200 transition"
              >
                Send WhatsApp Reminder
              </button>

            </div>

            {/* STATS */}

            <div className="grid grid-cols-3 gap-4">

              <StatCard
                title="Sent"
                value={sent}
                icon={CheckCircle2}
              />

              <StatCard
                title="Pending"
                value={pending}
                icon={Clock3}
              />

              <StatCard
                title="Failed"
                value={failed}
                icon={AlertTriangle}
              />

            </div>

          </div>
        </div>

        {/* ACTIVITY */}

        <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden">

          <div className="p-6 border-b border-zinc-100">

            <h2 className="text-xl font-semibold">
              WhatsApp Activity
            </h2>

            <p className="text-sm text-zinc-500 mt-1">
              Track WhatsApp reminder delivery
            </p>

          </div>

          <div className="divide-y">

            {loading && (
              <div className="p-10 text-center">
                Loading...
              </div>
            )}

            {!loading &&
              logs.length === 0 && (
                <div className="p-10 text-center text-zinc-500">
                  No WhatsApp reminders found
                </div>
              )}

            {logs.map((log) => (
              <div
                key={log.id}
                className="p-5 flex items-center justify-between hover:bg-zinc-50 transition"
              >

                <div className="flex items-center gap-4">

                  <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                    <MessageCircle
                      size={20}
                    />
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
                        log.recipient
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

                <StatusBadge
                  status={
                    log.status
                  }
                />

              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SEND MODAL */}

      {openSend && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-lg rounded-3xl p-7">

            <div className="flex items-center justify-between mb-6">

              <div>

                <h2 className="text-2xl font-bold">
                  Send WhatsApp Reminder
                </h2>

                <p className="text-sm text-zinc-500 mt-1">
                  Manual recovery reminder
                </p>

              </div>

              <button
                onClick={() =>
                  setOpenSend(false)
                }
              >
                ✕
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

              <div className="relative">

                <Phone className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />

                <input
                  placeholder="+1 555 000 111"
                  value={phone}
                  onChange={(e) =>
                    setPhone(
                      e.target.value
                    )
                  }
                  className="w-full border rounded-2xl pl-11 pr-4 py-3 outline-none"
                />

              </div>

              <textarea
                rows={5}
                placeholder="WhatsApp message..."
                value={message}
                onChange={(e) =>
                  setMessage(
                    e.target.value
                  )
                }
                className="w-full border rounded-2xl px-4 py-3 outline-none"
              />

            </div>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() =>
                  setOpenSend(false)
                }
                className="border px-5 py-3 rounded-2xl"
              >
                Cancel
              </button>

              <button
                onClick={
                  sendWhatsApp
                }
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-2xl flex items-center gap-2"
              >
                <Send size={16} />
                Send
              </button>

            </div>

          </div>
        </div>
      )}

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
}: any) {
  return (
    <div className="bg-white/10 border border-white/10 rounded-2xl p-5 min-w-[120px]">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-green-100">
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
   STATUS
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