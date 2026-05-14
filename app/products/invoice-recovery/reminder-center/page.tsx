// app/products/invoice-recovery/reminder-center/page.tsx

"use client";

import { useEffect, useMemo, useState } from "react";

import axios from "axios";

import Layout from "@/components/Layout";

import toast from "react-hot-toast";

import {
  Mail,
  MessageCircle,
  Smartphone,
  BrainCircuit,
  X,
} from "lucide-react";

/* =========================================
   TYPES
========================================= */

type Invoice = {
  id: string;

  clientName?: string | null;

  clientEmail?: string | null;

  clientPhone?: string | null;

  clientWhatsapp?: string | null;

  amount: number;

  paymentLink?: string | null;
};

type Template = {
  id: string;

  name: string;

  subject: string;

  html: string;

  type: string;
};

/* =========================================
   PAGE
========================================= */

export default function ReminderCenterPage() {

  /* =========================================
     STATE
  ========================================= */

  const [loading, setLoading] =
    useState(true);

  const [sending, setSending] =
    useState(false);

  const [openCreate, setOpenCreate] =
    useState(false);

  const [data, setData] =
    useState<any>(null);

  const [invoices, setInvoices] =
    useState<Invoice[]>([]);

  const [templates, setTemplates] =
    useState<Template[]>([]);

  /* =========================================
     FORM
  ========================================= */

  const [invoiceId, setInvoiceId] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [channel, setChannel] =
    useState("email");

  const [templateId, setTemplateId] =
    useState("");

  const [message, setMessage] =
    useState("");

  /* =========================================
     LOAD
  ========================================= */

  const loadData = async () => {
    try {

      const [
        reminderRes,
        invoiceRes,
        templateRes,
      ] = await Promise.all([
        axios.get(
          "/api/reminder-center"
        ),

        axios.get(
          "/api/invoices"
        ),

        axios.get(
          "/api/reminder-templates"
        ),
      ]);

      setData(
        reminderRes.data
      );

      /* =========================
         FIX INVOICE RESPONSE
      ========================= */

      const invoiceData =
        Array.isArray(
          invoiceRes.data
        )
          ? invoiceRes.data
          : invoiceRes.data
              ?.invoices || [];

      setInvoices(invoiceData);

      /* =========================
         FIX TEMPLATE RESPONSE
      ========================= */

      const templateData =
        Array.isArray(
          templateRes.data
        )
          ? templateRes.data
          : templateRes.data
              ?.templates || [];

      setTemplates(
        templateData
      );

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
     CURRENT INVOICE
  ========================================= */

/* =========================================
   AUTO FILL INVOICE
========================================= */

useEffect(() => {

  /* =========================
     RESET IF EMPTY
  ========================= */

  if (
    !invoiceId ||
    !invoices.length
  ) {

    setEmail("");

    setPhone("");

    setAmount("");

    return;
  }

  /* =========================
     FIND INVOICE
  ========================= */

 const found =
  invoices.find(
    (invoice) =>
      invoice.id === invoiceId
  );

  /* =========================
     NOT FOUND
  ========================= */

  if (!found) {

    setEmail("");

    setPhone("");

    setAmount("");

    return;
  }

  /* =========================
     EMAIL
  ========================= */

  setEmail(
    found.clientEmail || ""
  );

  /* =========================
     PHONE / WHATSAPP
  ========================= */

  setPhone(
    found.clientPhone ||
    found.clientWhatsapp ||
    ""
  );

  /* =========================
     AMOUNT
  ========================= */

  setAmount(
    String(
      found.amount || 0
    )
  );

}, [
  invoiceId,
  invoices,
]);
  /* =========================================
     TEMPLATE
  ========================================= */

 /* =========================================
   CURRENT INVOICE
========================================= */

const currentInvoice =
  useMemo(() => {

    return invoices.find(
      (invoice) =>
        invoice.id === invoiceId
    );

  }, [
    invoiceId,
    invoices,
  ]);

/* =========================================
   TEMPLATE
========================================= */

const selectedTemplate =
  useMemo(() => {

    return templates.find(
      (template) =>
        template.id === templateId
    );

  }, [
    templateId,
    templates,
  ]);
  /* =========================================
     APPLY VARIABLES
  ========================================= */
const applyVariables = (
  content: string
) => {

  return content

    .replaceAll(
      "{{name}}",
      currentInvoice?.clientName?.trim() ||
        "Customer"
    )

    .replaceAll(
      "{{amount}}",
      String(
        currentInvoice?.amount || 0
      )
    )

    .replaceAll(
      "{{email}}",
      currentInvoice?.clientEmail || ""
    )

    .replaceAll(
      "{{phone}}",
      currentInvoice?.clientPhone ||
        currentInvoice?.clientWhatsapp ||
        ""
    )

    .replaceAll(
      "{{invoiceId}}",
      currentInvoice?.id || ""
    )

    .replaceAll(
      "{{link}}",
      currentInvoice?.paymentLink ||
        "https://koniqtech.com"
    )

    .replaceAll(
      "{{senderName}}",
      data?.user?.name ||
        "KoniqTech"
    )

    .replaceAll(
      "{{companyName}}",
      data?.user?.companyName ||
        "KoniqTech"
    )

    .replaceAll(
      "{{senderEmail}}",
      data?.user?.email ||
        "info@koniqtech.com"
    )

    .replaceAll(
      "{{senderPhone}}",
      data?.user?.phone ||
        ""
    );
};
  /* =========================================
     AUTO TEMPLATE MESSAGE
  ========================================= */
/* =========================================
   AUTO TEMPLATE MESSAGE
========================================= */

useEffect(() => {

  if (!selectedTemplate) {
    return;
  }

  /* =====================================
     SMS PREVIEW
  ===================================== */

  if (channel === "sms") {

    let smsPreview = "";

    if (selectedTemplate.type === "friendly") {

      smsPreview = `
Hi ${currentInvoice?.clientName || "Customer"},

Friendly reminder:
$${amount} is pending.

Pay here:
${currentInvoice?.paymentLink || ""}

- ${data?.user?.companyName || "KoniqTech"}
`;

    } else if (
      selectedTemplate.type === "firm"
    ) {

      smsPreview = `
Hi ${currentInvoice?.clientName || "Customer"},

Your payment of $${amount} is overdue.

Immediate action required.

${currentInvoice?.paymentLink || ""}

- ${data?.user?.companyName || "KoniqTech"}
`;

    } else {

      smsPreview = `
FINAL NOTICE

$${amount} payment pending.

Avoid escalation. 

Pay now:
${currentInvoice?.paymentLink || ""}

- ${data?.user?.companyName || "KoniqTech"}
`;
    }

    setMessage(
      smsPreview.trim()
    );

    return;
  }

  /* =====================================
     WHATSAPP PREVIEW
  ===================================== */

  if (channel === "whatsapp") {

    const whatsappPreview = `
👋 Hi ${currentInvoice?.clientName || "Customer"},

This is a reminder that your payment of $${amount} is pending.

💳 Pay here:
${currentInvoice?.paymentLink || ""}

Thank you,
${data?.user?.companyName || "KoniqTech"}
`;

    setMessage(
      whatsappPreview.trim()
    );

    return;
  }

  /* =====================================
     EMAIL PREVIEW
  ===================================== */

  const parsedHtml =
    applyVariables(
      selectedTemplate.html
    );

  const cleanText =
    parsedHtml

      .replace(
        /<style[^>]*>.*?<\/style>/gs,
        ""
      )

      .replace(
        /<script[^>]*>.*?<\/script>/gs,
        ""
      )

      .replace(
        /<\/div>/g,
        "\n"
      )

      .replace(
        /<\/p>/g,
        "\n"
      )

      .replace(
        /<br\s*\/?>/g,
        "\n"
      )

      .replace(
        /<[^>]+>/g,
        ""
      )

      .replace(
        /\n\s+\n/g,
        "\n\n"
      )

      .trim();

  setMessage(cleanText);

}, [
  selectedTemplate,
  channel,
  invoiceId,
  invoices,
  amount,
  email,
  phone,
  currentInvoice,
  data,
]);


  /* =========================================
     SEND
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

        if (
          channel === "email" &&
          !email
        ) {
          toast.error(
            "Email missing"
          );

          return;
        }

        if (
          (
            channel === "sms" ||
            channel ===
              "whatsapp"
          ) &&
          !phone
        ) {
          toast.error(
            "Phone missing"
          );

          return;
        }

        setSending(true);

        const html =
          selectedTemplate
            ? applyVariables(
                selectedTemplate.html
              )
            : `<p>${message}</p>`;

        await axios.post(
          "/api/reminder-center",
          {
            invoiceId,

            email,

            phone,

            amount,

            channel,

            type:
              selectedTemplate
                ?.type ||
              "friendly",

            subject:
              selectedTemplate
                ?.subject ||
              "Payment Reminder",

            html,

            text: message,
          }
        );

        toast.success(
          "Reminder sent"
        );

        setOpenCreate(false);

        setInvoiceId("");

        setEmail("");

        setPhone("");

        setAmount("");

        setTemplateId("");

        setMessage("");

        loadData();

      } catch (err: any) {

        console.error(err);

        toast.error(
          err?.response?.data
            ?.error ||
            "Failed to send reminder"
        );

      } finally {

        setSending(false);
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

  const logs =
    data?.logs || [];

  const stats =
    data?.stats || {};

  return (
    <Layout>

      <div className="space-y-6">

        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>

            <h1 className="text-3xl md:text-4xl font-bold">
              Recovery Center
            </h1>

            <p className="text-gray-500 mt-2 text-sm md:text-base">
              Manage reminders and payment follow-ups
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
              w-full md:w-auto
            "
          >
            Send Reminder
          </button>

        </div>

        {/* STATS */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

          <SimpleStat
            title="Sent"
            value={
              stats.sent || 0
            }
          />

          <SimpleStat
            title="Pending"
            value={
              stats.pending || 0
            }
          />

          <SimpleStat
            title="Failed"
            value={
              stats.failed || 0
            }
          />

          <SimpleStat
            title="Opened"
            value={
              stats.opened || 0
            }
          />

        </div>

        {/* CHANNELS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <ChannelCard
            title="Email"
            desc="Recovery emails"
            icon={Mail}
            active={`${stats?.channels?.email || 0} sent`}
          />

          <ChannelCard
            title="WhatsApp"
            desc="WhatsApp reminders"
            icon={
              MessageCircle
            }
            active={`${stats?.channels?.whatsapp || 0} sent`}
          />

          <ChannelCard
            title="SMS"
            desc="SMS reminders"
            icon={Smartphone}
            active={`${stats?.channels?.sms || 0} sent`}
          />

        </div>

        {/* AI */}

        <div className="bg-black text-white rounded-3xl p-6">

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-yellow-300" />
            </div>

            <div>

              <h3 className="text-lg font-semibold">
                AI Recovery Insights
              </h3>

              <p className="text-sm text-gray-400">
                WhatsApp reminders perform 21% better than email 
              </p>

            </div>

          </div>

        </div>

        {/* LOGS */}

        <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden">

          <div className="p-6 border-b">

            <h2 className="text-xl font-semibold">
              Recent Activity
            </h2>

          </div>

          <div className="divide-y">

            {logs.length ===
              0 && (
              <div className="p-10 text-center text-gray-500">
                No activity yet
              </div>
            )}

            {logs.map(
              (log: any) => {

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
                    className="
                      p-5
                      flex
                      flex-col
                      md:flex-row
                      md:items-center
                      md:justify-between
                      gap-4
                    "
                  >

                    <div className="flex items-center gap-4">

                      <div className="w-11 h-11 rounded-2xl bg-gray-100 flex items-center justify-center">
                        <Icon size={18} />
                      </div>

                      <div>

                        <h3 className="font-medium">
                          {
                            log.invoice
                              ?.clientName
                          }
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          {
                            log.channel
                          }
                        </p>

                      </div>

                    </div>

                    <StatusBadge
                      status={
                        log.status
                      }
                    />

                  </div>
                );
              }
            )}

          </div>

        </div>

      </div>

      {/* =========================================
         MODAL
      ========================================= */}

      {openCreate && (

        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto">

          <div className="min-h-screen flex items-center justify-center p-4">

            <div className="
              bg-white
              w-full
              max-w-2xl
              rounded-3xl
              p-5 md:p-7
            ">

              {/* HEADER */}

              <div className="flex items-start justify-between gap-4 mb-6">

                <div>

                  <h2 className="text-2xl font-bold">
                    Send Reminder
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Email, SMS & WhatsApp reminders
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

              {/* FORM */}

              <div className="space-y-4">

                {/* INVOICE ID */}

                <input
                  placeholder="Paste Invoice ID"
                  value={invoiceId}
                  onChange={(e) =>
                    setInvoiceId(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    border
                    rounded-2xl
                    px-4
                    py-3
                    text-sm
                  "
                />

                {/* EMAIL */}

                <input
                  value={email}
                  readOnly
                  placeholder="Client email"
                  className="
                    w-full
                    border
                    rounded-2xl
                    px-4
                    py-3
                    bg-gray-50
                    text-sm
                  "
                />

                {/* PHONE */}

                <input
                  value={phone}
                  readOnly
                  placeholder="Client phone"
                  className="
                    w-full
                    border
                    rounded-2xl
                    px-4
                    py-3
                    bg-gray-50
                    text-sm
                  "
                />

                {/* AMOUNT */}

                <input
                  value={amount}
                  readOnly
                  placeholder="Invoice amount"
                  className="
                    w-full
                    border
                    rounded-2xl
                    px-4
                    py-3
                    bg-gray-50
                    text-sm
                  "
                />

                {/* CHANNEL */}

                <select
                  value={channel}
                  onChange={(e) =>
                    setChannel(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    border
                    rounded-2xl
                    px-4
                    py-3
                    text-sm
                  "
                >

                  <option value="email">
                    Email
                  </option>

                  <option value="sms">
                    SMS
                  </option>

                  <option value="whatsapp">
                    WhatsApp
                  </option>

                </select>

                {/* TEMPLATE */}

                <select
                  value={templateId}
                  onChange={(e) =>
                    setTemplateId(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    border
                    rounded-2xl
                    px-4
                    py-3
                    text-sm
                  "
                >

                  <option value="">
                    Select template
                  </option>

                  {templates.map(
                    (template) => (
                      <option
                        key={
                          template.id
                        }
                        value={
                          template.id
                        }
                      >
                        {
                          template.name
                        }
                      </option>
                    )
                  )}

                </select>

                {/* MESSAGE */}

                <textarea
                  rows={10}
                  value={message}
                  onChange={(e) =>
                    setMessage(
                      e.target.value
                    )
                  }
                  placeholder="Reminder message..."
                  className="
                    w-full
                    border
                    rounded-2xl
                    px-4
                    py-3
                    text-sm
                    resize-none
                  "
                />

              </div>

              {/* ACTIONS */}

              <div className="
                flex
                flex-col-reverse
                md:flex-row
                justify-end
                gap-3
                mt-6
              ">

                <button
                  onClick={() =>
                    setOpenCreate(false)
                  }
                  className="
                    border
                    px-5
                    py-3
                    rounded-2xl
                    w-full
                    md:w-auto
                  "
                >
                  Cancel
                </button>

                <button
                  onClick={
                    createReminder
                  }
                  disabled={
                    sending
                  }
                  className="
                    bg-black
                    text-white
                    px-5
                    py-3
                    rounded-2xl
                    w-full
                    md:w-auto
                  "
                >
                  {sending
                    ? "Sending..."
                    : "Send Reminder"}
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </Layout>
  );
}

/* =========================================
   COMPONENTS
========================================= */

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

function ChannelCard({
  title,
  desc,
  icon: Icon,
  active,
}: any) {

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6">

      <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-5">
        <Icon size={20} />
      </div>

      <h3 className="font-semibold text-lg">
        {title}
      </h3>

      <p className="text-sm text-gray-500 mt-2">
        {desc}
      </p>

      <div className="mt-5 text-sm text-green-600 font-medium">
        {active}
      </div>

    </div>
  );
}

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