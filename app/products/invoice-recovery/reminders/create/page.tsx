"use client";

import { useEffect, useMemo, useState } from "react";

import axios from "axios";

import Layout from "@/components/Layout";

/* =========================================
   TYPES
========================================= */

type EmailPreview = {
  html: string;
  text: string;
};

type Invoice = {
  id: string;

  clientName?: string | null;

  clientEmail?: string | null;

  clientPhone?: string | null;

  amount: number;
};

type Template = {
  id: string;

  name: string;

  subject: string;

  html: string;

  text?: string;

  type: string;
};

type AutoReminder = {
  step: number;

  templateId: string;

  delay: number;
};

type UserData = {
  name?: string;

  email?: string;

  phone?: string;

  companyName?: string;
};

/* =========================================
   PAGE
========================================= */

export default function CreateReminderPage() {

  /* =========================================
     STATE
  ========================================= */

  const [loading, setLoading] =
    useState(false);

  const [sending, setSending] =
    useState(false);

  const [showDropdown, setShowDropdown] =
    useState(false);

  const [preview, setPreview] =
    useState<EmailPreview | null>(
      null
    );

  const [tab, setTab] =
    useState<"html" | "text">(
      "html"
    );

  /* =========================================
     DATA
  ========================================= */

  const [invoices, setInvoices] =
    useState<Invoice[]>([]);

  const [templates, setTemplates] =
    useState<Template[]>([]);

  const [userData, setUserData] =
    useState<UserData | null>(
      null
    );

  /* =========================================
     FORM
  ========================================= */

  const [search, setSearch] =
    useState("");

  const [selected, setSelected] =
    useState<Invoice | null>(null);

  const [selectedTemplate, setSelectedTemplate] =
    useState<Template | null>(
      null
    );

  const [amount, setAmount] =
    useState("");

  /* =========================================
     SEND MODE
  ========================================= */

  const [sendMode, setSendMode] =
    useState<"manual" | "auto">(
      "manual"
    );

  const [amountMode, setAmountMode] =
    useState<"manual" | "auto">(
      "manual"
    );

  /* =========================================
     AUTO REMINDERS
  ========================================= */

  const [autoReminders, setAutoReminders] =
    useState<AutoReminder[]>([
      {
        step: 1,
        templateId: "",
        delay: 0,
      },

      {
        step: 2,
        templateId: "",
        delay: 3,
      },

      {
        step: 3,
        templateId: "",
        delay: 7,
      },
    ]);

  /* =========================================
     LOAD
  ========================================= */

  useEffect(() => {
    loadInvoices();

    loadTemplates();

    loadUser();
  }, []);

  const loadInvoices = async () => {
    try {

      const res =
        await axios.get(
          "/api/invoices"
        );

      setInvoices(
        Array.isArray(res.data)
          ? res.data
          : res.data?.invoices || []
      );

    } catch (err) {

      console.error(err);
    }
  };

  const loadTemplates = async () => {
    try {

      const res =
        await axios.get(
          "/api/reminder-templates"
        );

      let templateData = [];

      if (Array.isArray(res.data)) {

        templateData = res.data;

      } else if (
        Array.isArray(
          res.data.templates
        )
      ) {

        templateData =
          res.data.templates;

      } else if (
        Array.isArray(
          res.data.data
        )
      ) {

        templateData =
          res.data.data;
      }

      setTemplates(
        templateData
      );

    } catch (err) {

      console.error(err);
    }
  };

  const loadUser = async () => {
    try {

      const res =
        await axios.get(
          "/api/me"
        );

      setUserData(
        res.data?.user || null
      );

    } catch (err) {

      console.error(err);
    }
  };

  /* =========================================
     FILTER CLIENTS
  ========================================= */

  const filtered =
    invoices.filter((inv) =>
      inv.clientEmail
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  /* =========================================
     AUTO SELECT
  ========================================= */

  useEffect(() => {

    if (!selected)
      return;

    setAmount(
      String(
        selected.amount || 0
      )
    );

  }, [selected]);

  /* =========================================
     APPLY VARIABLES
  ========================================= */

  const applyVariables = (
    content: string,
    finalAmount: string
  ) => {

    return content

      .replaceAll(
        "{{name}}",
        selected?.clientName ||
          selected?.clientEmail
            ?.split("@")[0] ||
          "Customer"
      )

      .replaceAll(
        "{{amount}}",
        finalAmount || "0"
      )

      .replaceAll(
        "{{email}}",
        selected?.clientEmail ||
          ""
      )

      .replaceAll(
        "{{phone}}",
        selected?.clientPhone ||
          ""
      )

      .replaceAll(
        "{{invoiceId}}",
        selected?.id || ""
      )

      .replaceAll(
        "{{link}}",
        "https://koniqtech.com"
      )

      /* =========================
         SENDER
      ========================= */

      .replaceAll(
        "{{senderName}}",
        userData?.name ||
          "KoniqTech"
      )

      .replaceAll(
        "{{companyName}}",
        userData?.companyName ||
          "KoniqTech"
      )

      .replaceAll(
        "{{senderEmail}}",
        userData?.email ||
          "info@koniqtech.com"
      )

      .replaceAll(
        "{{senderPhone}}",
        userData?.phone || ""
      );
  };

  /* =========================================
     GENERATE
  ========================================= */

  const generate = async () => {

    if (!selected) {
      return alert(
        "Select client"
      );
    }

    if (
      amountMode === "manual" &&
      !amount
    ) {
      return alert(
        "Enter amount"
      );
    }

    if (!selectedTemplate) {
      return alert(
        "Select template"
      );
    }

    setLoading(true);

    try {

      const finalAmount =
        amountMode === "manual"
          ? amount
          : String(
              selected.amount
            );

      const html =
        applyVariables(
          selectedTemplate.html,
          finalAmount
        );

      const text =
        html.replace(
          /<[^>]*>/g,
          ""
        );

      setPreview({
        html,
        text,
      });

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);
    }
  };

  /* =========================================
     SEND
  ========================================= */

  const send = async () => {
    try {

      setSending(true);

      if (
        sendMode === "auto"
      ) {

        await axios.post(
          "/api/reminders/auto-sequence",
          {
            invoiceId:
              selected?.id,

            reminders:
              autoReminders,

            amountMode,

            amount:
              amountMode ===
              "manual"
                ? Number(
                    amount
                  )
                : selected?.amount,
          }
        );

        alert(
          "Auto reminder sequence created"
        );

      } else {

        await axios.post(
          "/api/reminders/send-custom",
          {
            email:
              selected?.clientEmail,

            phone:
              selected?.clientPhone,

            subject:
              selectedTemplate?.subject ||
              "Payment Reminder",

            html:
              preview?.html,

            text:
              preview?.text,

            amount:
              amountMode ===
              "manual"
                ? Number(
                    amount
                  )
                : selected?.amount,
          }
        );

        alert(
          "Reminder sent"
        );
      }

      window.location.href =
        "/products/invoice-recovery/reminders";

    } catch (err) {

      console.error(err);

      alert("Failed");

    } finally {

      setSending(false);
    }
  };

  /* =========================================
     UI
  ========================================= */

  return (
    <Layout>

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 space-y-6">

        {/* HEADER */}

        <div>

          <h1 className="text-2xl md:text-3xl font-bold">
            Send Reminder
          </h1>

          <p className="text-gray-500 mt-1 text-sm md:text-base">
            Manual & automated invoice reminders
          </p>

        </div>

        {/* CARD */}

        <div className="bg-white border rounded-3xl p-4 md:p-8 space-y-6">

          {/* SEND MODE */}

          <div>

            <label className="block text-sm font-semibold mb-3">
              Send Type
            </label>

            <div className="flex flex-wrap gap-3">

              <button
                onClick={() =>
                  setSendMode(
                    "manual"
                  )
                }
                className={`px-5 py-2 rounded-xl border transition ${
                  sendMode ===
                  "manual"
                    ? "bg-black text-white"
                    : "bg-white"
                }`}
              >
                Manual Send
              </button>

              <button
                onClick={() =>
                  setSendMode(
                    "auto"
                  )
                }
                className={`px-5 py-2 rounded-xl border transition ${
                  sendMode ===
                  "auto"
                    ? "bg-black text-white"
                    : "bg-white"
                }`}
              >
                Auto Sequence
              </button>

            </div>

          </div>

          {/* CLIENT SEARCH */}

          <div className="relative">

            <label className="block text-sm font-semibold mb-2">
              Search Client
            </label>

            <input
              placeholder="Search by email..."
              value={search}
              onChange={(e) => {

                setSearch(
                  e.target.value
                );

                setShowDropdown(
                  true
                );
              }}
              className="w-full border rounded-2xl px-4 py-3"
            />

            {showDropdown && (
              <div className="absolute z-20 mt-2 w-full bg-white border rounded-2xl shadow-lg max-h-60 overflow-y-auto">

                {filtered.map(
                  (inv) => (
                    <div
                      key={inv.id}
                      onClick={() => {

                        setSelected(
                          inv
                        );

                        setSearch(
                          inv.clientEmail ||
                            ""
                        );

                        setShowDropdown(
                          false
                        );
                      }}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                    >

                      <div className="font-medium">
                        {
                          inv.clientEmail
                        }
                      </div>

                      <div className="text-sm text-gray-500">
                        {
                          inv.clientPhone
                        }{" "}
                        • ₹
                        {
                          inv.amount
                        }
                      </div>

                    </div>
                  )
                )}

              </div>
            )}

          </div>

          {/* CLIENT DETAILS */}

          {selected && (

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <input
                readOnly
                value={
                  selected.clientEmail ||
                  ""
                }
                className="w-full border rounded-2xl px-4 py-3 bg-gray-50"
              />

              <input
                readOnly
                value={
                  selected.clientPhone ||
                  ""
                }
                className="w-full border rounded-2xl px-4 py-3 bg-gray-50"
              />

              <input
                readOnly
                value={`₹${selected.amount}`}
                className="w-full border rounded-2xl px-4 py-3 bg-gray-50"
              />

            </div>
          )}

          {/* TEMPLATE */}

          {sendMode ===
            "manual" && (

            <>
              <div>

                <label className="block text-sm font-semibold mb-2">
                  Template
                </label>

                <select
                  value={
                    selectedTemplate?.id ||
                    ""
                  }
                  onChange={(e) => {

                    const found =
                      templates.find(
                        (t) =>
                          t.id ===
                          e.target
                            .value
                      );

                    setSelectedTemplate(
                      found ||
                        null
                    );
                  }}
                  className="w-full border rounded-2xl px-4 py-3"
                >

                  <option value="">
                    Choose template
                  </option>

                  {templates.map(
                    (
                      template
                    ) => (
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

              </div>

              <button
                onClick={generate}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-2xl font-semibold transition"
              >
                Generate Email
              </button>

            </>
          )}

          {/* PREVIEW */}

          {preview &&
            sendMode ===
              "manual" && (

              <div className="border rounded-2xl overflow-hidden">

                <div className="flex border-b">

                  <button
                    onClick={() =>
                      setTab(
                        "html"
                      )
                    }
                    className={`flex-1 py-3 text-sm font-medium ${
                      tab ===
                      "html"
                        ? "bg-black text-white"
                        : "bg-white"
                    }`}
                  >
                    HTML
                  </button>

                  <button
                    onClick={() =>
                      setTab(
                        "text"
                      )
                    }
                    className={`flex-1 py-3 text-sm font-medium ${
                      tab ===
                      "text"
                        ? "bg-black text-white"
                        : "bg-white"
                    }`}
                  >
                    Text
                  </button>

                </div>

                <div className="p-6 max-h-[500px] overflow-y-auto">

                  {tab ===
                  "html" ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          preview.html,
                      }}
                    />
                  ) : (
                    <pre className="whitespace-pre-wrap text-sm">
                      {
                        preview.text
                      }
                    </pre>
                  )}

                </div>

              </div>
            )}

          {/* SEND */}

          <button
            onClick={send}
            disabled={sending}
            className="w-full bg-black hover:bg-gray-900 text-white py-4 rounded-2xl font-semibold transition"
          >
            {sending
              ? "Processing..."
              : sendMode ===
                "auto"
              ? "Save Auto Sequence"
              : "Send Reminder"}
          </button>

        </div>

      </div>

    </Layout>
  );
}