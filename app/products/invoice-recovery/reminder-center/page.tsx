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
          invoice.id
            .trim()
            .toLowerCase() ===
          invoiceId
            .trim()
            .toLowerCase()
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

  const selectedTemplate =
    useMemo(() => {

      return templates.find(
        (template) =>
          template.id ===
          templateId
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
        invoices.find(
          (invoice) =>
            invoice.id
              .trim()
              .toLowerCase() ===
            invoiceId
              .trim()
              .toLowerCase()
        )?.clientName ||
          "Customer"
      )

      .replaceAll(
        "{{amount}}",
        amount || "0"
      )

      .replaceAll(
        "{{email}}",
        email || ""
      )

      .replaceAll(
        "{{phone}}",
        phone || ""
      )

      .replaceAll(
        "{{invoiceId}}",
        invoiceId || ""
      )

      .replaceAll(
        "{{link}}",
        "https://koniqtech.com"
      )

      /* =========================
         SENDER VARIABLES
      ========================= */

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

  useEffect(() => {

    if (
      !selectedTemplate
    ) {
      return;
    }

    const parsedHtml =
      applyVariables(
        selectedTemplate.html
      );

    /* =========================
       CLEAN HTML
    ========================= */

    const cleanText =
      parsedHtml
        .replace(
          /<style[^>]*>[\s\S]*?<\/style>/g,
          ""
        )

        .replace(
          /<script[^>]*>[\s\S]*?<\/script>/g,
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

    setMessage(
      cleanText
    );

  }, [
    selectedTemplate,
    invoiceId,
    invoices,
    amount,
    email,
    phone,
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
      </div>

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