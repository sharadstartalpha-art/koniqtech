"use client";

import { useEffect, useState } from "react";

import axios from "axios";

import Layout from "@/components/Layout";

/* =========================
   TYPES
========================= */

type EmailPreview = {
  html: string;
  text: string;
};

type Invoice = {
  id: string;
  clientEmail: string;
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

/* =========================
   PAGE
========================= */

export default function CreateReminderPage() {
  const [invoices, setInvoices] =
    useState<Invoice[]>([]);

  const [templates, setTemplates] =
    useState<Template[]>([]);

  const [selectedTemplate, setSelectedTemplate] =
    useState<Template | null>(null);

  const [search, setSearch] =
    useState("");

  const [selected, setSelected] =
    useState<Invoice | null>(null);

  const [amount, setAmount] =
    useState("");

  const [preview, setPreview] =
    useState<EmailPreview | null>(null);

  const [tab, setTab] =
    useState<"text" | "html">("html");

  const [loading, setLoading] =
    useState(false);

  const [sending, setSending] =
    useState(false);

  const [showDropdown, setShowDropdown] =
    useState(false);

  /* =========================
     SEND MODE
  ========================= */

  const [sendMode, setSendMode] =
    useState<"manual" | "auto">(
      "manual"
    );

  /* =========================
     MANUAL / AUTO AMOUNT
  ========================= */

  const [amountMode, setAmountMode] =
    useState<"manual" | "auto">(
      "manual"
    );

  /* =========================
     AUTO REMINDERS
  ========================= */

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

  /* =========================
     LOAD
  ========================= */

  useEffect(() => {
    loadInvoices();
    loadTemplates();
  }, []);

  const loadInvoices = async () => {
    try {
      const res =
        await axios.get("/api/invoices");

      setInvoices(
        Array.isArray(res.data)
          ? res.data
          : []
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
        Array.isArray(res.data.templates)
      ) {
        templateData =
          res.data.templates;

      } else if (
        Array.isArray(res.data.data)
      ) {
        templateData =
          res.data.data;
      }

      setTemplates(templateData);

    } catch (err) {
      console.error(err);
    }
  };

  /* =========================
     FILTER CLIENTS
  ========================= */

  const filtered = invoices.filter((inv) =>
    inv.clientEmail
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  /* =========================
     APPLY VARIABLES
  ========================= */

  const applyVariables = (
    content: string,
    finalAmount: string
  ) => {
    if (!content) return "";

    return content
      .replaceAll(
        "{{name}}",
        selected?.clientEmail?.split("@")[0] ||
          "Customer"
      )
      .replaceAll(
        "{{amount}}",
        finalAmount
      )
      .replaceAll(
        "{{email}}",
        selected?.clientEmail || ""
      )
      .replaceAll(
        "{{dueDate}}",
        new Date().toLocaleDateString()
      )
      .replaceAll(
        "{{link}}",
        "#"
      );
  };

  /* =========================
     GENERATE
  ========================= */

  const generate = async () => {
    if (!selected) {
      return alert("Select client");
    }

    if (
      amountMode === "manual" &&
      !amount
    ) {
      return alert("Enter amount");
    }

    if (!selectedTemplate) {
      return alert("Select template");
    }

    setLoading(true);

    try {
      const finalAmount =
        amountMode === "manual"
          ? amount
          : String(selected.amount);

      const html =
        applyVariables(
          selectedTemplate.html,
          finalAmount
        );

      const text = `
Hi ${
        selected.clientEmail.split("@")[0]
      },

This is a reminder that your payment of $${finalAmount} is pending.

Thank you,
KoniqTech
`;

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

  /* =========================
     SEND
  ========================= */

  const send = async () => {
    try {
      setSending(true);

      /* =====================
         AUTO SEQUENCE
      ===================== */

      if (sendMode === "auto") {
        await axios.post(
          "/api/reminders/auto-sequence",
          {
            invoiceId: selected?.id,

            reminders: autoReminders,

            amountMode,

            amount:
              amountMode === "manual"
                ? Number(amount)
                : selected?.amount,
          }
        );

        alert(
          "Auto reminder sequence created"
        );

      } else {
        /* =====================
           MANUAL SEND
        ===================== */

        await axios.post(
          "/api/reminders/send-custom",
          {
            email:
              selected?.clientEmail,

            subject:
              selectedTemplate?.subject,

            html: preview?.html,

            text: preview?.text,

            amount:
              amountMode === "manual"
                ? Number(amount)
                : selected?.amount,
          }
        );

        alert("Reminder sent");
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

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">

        {/* HEADER */}

        <div>
          <h1 className="text-3xl font-bold">
            Send Reminder
          </h1>

          <p className="text-gray-500 mt-1">
            Manual & automated invoice reminders
          </p>
        </div>

        {/* CARD */}

        <div className="bg-white border rounded-3xl p-8 space-y-6">

          {/* SEND TYPE */}

          <div>
            <label className="block text-sm font-semibold mb-3">
              Send Type
            </label>

            <div className="flex gap-3">

              <button
                onClick={() =>
                  setSendMode("manual")
                }
                className={`px-5 py-2 rounded-xl border ${
                  sendMode === "manual"
                    ? "bg-black text-white"
                    : "bg-white"
                }`}
              >
                Manual Send
              </button>

              <button
                onClick={() =>
                  setSendMode("auto")
                }
                className={`px-5 py-2 rounded-xl border ${
                  sendMode === "auto"
                    ? "bg-black text-white"
                    : "bg-white"
                }`}
              >
                Auto Sequence
              </button>

            </div>
          </div>

          {/* CLIENT */}

          <div className="relative">

            <label className="block text-sm font-semibold mb-2">
              Client Email
            </label>

            <input
              placeholder="Search client..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowDropdown(true);
              }}
              className="w-full border rounded-2xl px-4 py-3"
            />

            {showDropdown && (
              <div className="absolute z-20 mt-2 w-full bg-white border rounded-2xl shadow-lg max-h-52 overflow-y-auto">

                {filtered.map((inv) => (
                  <div
                    key={inv.id}
                    onClick={() => {
                      setSelected(inv);
                      setSearch(
                        inv.clientEmail
                      );
                      setShowDropdown(false);
                    }}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                  >
                    {inv.clientEmail}
                  </div>
                ))}

              </div>
            )}
          </div>

          {/* TOTAL */}

          {selected && (
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
              <p>Total Due</p>

              <p className="text-4xl font-bold text-orange-600">
                ${selected.amount}
              </p>
            </div>
          )}

          {/* AMOUNT MODE */}

          <div>
            <label className="block text-sm font-semibold mb-3">
              Amount Mode
            </label>

            <div className="flex gap-3">

              <button
                onClick={() =>
                  setAmountMode("manual")
                }
                className={`px-5 py-2 rounded-xl border ${
                  amountMode === "manual"
                    ? "bg-orange-500 text-white"
                    : ""
                }`}
              >
                Manual Amount
              </button>

              <button
                onClick={() =>
                  setAmountMode("auto")
                }
                className={`px-5 py-2 rounded-xl border ${
                  amountMode === "auto"
                    ? "bg-orange-500 text-white"
                    : ""
                }`}
              >
                Full Invoice Amount
              </button>

            </div>
          </div>

          {/* MANUAL AMOUNT */}

          {amountMode === "manual" && (
            <input
              type="number"
              placeholder="Reminder amount"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
              className="w-full border rounded-2xl px-4 py-3"
            />
          )}

          {/* =========================
              MANUAL EMAIL
          ========================= */}

          {sendMode === "manual" && (
            <>
              <div>

                <label className="block text-sm font-semibold mb-2">
                  Template
                </label>

                <select
                  value={
                    selectedTemplate?.id || ""
                  }
                  onChange={(e) => {
                    const found =
                      templates.find(
                        (t) =>
                          t.id ===
                          e.target.value
                      );

                    setSelectedTemplate(
                      found || null
                    );
                  }}
                  className="w-full border rounded-2xl px-4 py-3"
                >
                  <option value="">
                    Choose template
                  </option>

                  {templates.map((template) => (
                    <option
                      key={template.id}
                      value={template.id}
                    >
                      {template.name}
                    </option>
                  ))}
                </select>

              </div>

              <button
                onClick={generate}
                className="w-full bg-orange-500 text-white py-3 rounded-2xl"
              >
                Generate Email
              </button>
            </>
          )}

          {/* =========================
              AUTO REMINDERS
          ========================= */}

          {sendMode === "auto" && (
            <div className="space-y-5">

              <div>
                <h2 className="text-lg font-semibold">
                  Auto Reminder Sequence
                </h2>

                <p className="text-sm text-gray-500">
                  Configure automatic reminders
                </p>
              </div>

              {autoReminders.map(
                (reminder, index) => (
                  <div
                    key={index}
                    className="border rounded-2xl p-5 grid grid-cols-3 gap-4"
                  >

                    {/* TEMPLATE */}

                    <div>
                      <label className="text-sm font-medium">
                        Template
                      </label>

                      <select
                        value={
                          reminder.templateId
                        }
                        onChange={(e) => {
                          const updated = [
                            ...autoReminders,
                          ];

                          updated[index].templateId =
                            e.target.value;

                          setAutoReminders(
                            updated
                          );
                        }}
                        className="w-full mt-2 border rounded-xl px-3 py-2"
                      >
                        <option value="">
                          Select template
                        </option>

                        {templates.map((t) => (
                          <option
                            key={t.id}
                            value={t.id}
                          >
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* DELAY */}

                    <div>
                      <label className="text-sm font-medium">
                        Send After (Days)
                      </label>

                      <input
                        type="number"
                        value={reminder.delay}
                        onChange={(e) => {
                          const updated = [
                            ...autoReminders,
                          ];

                          updated[index].delay =
                            Number(
                              e.target.value
                            );

                          setAutoReminders(
                            updated
                          );
                        }}
                        className="w-full mt-2 border rounded-xl px-3 py-2"
                      />
                    </div>

                    {/* STEP */}

                    <div className="flex items-end">
                      <div className="bg-gray-100 rounded-xl px-4 py-2 w-full text-center font-medium">
                        Reminder #{reminder.step}
                      </div>
                    </div>

                  </div>
                )
              )}

            </div>
          )}

          {/* PREVIEW */}

          {preview && sendMode === "manual" && (
            <div className="border rounded-2xl p-6">
              <div
                dangerouslySetInnerHTML={{
                  __html: preview.html,
                }}
              />
            </div>
          )}

          {/* SEND */}

          <button
            onClick={send}
            disabled={sending}
            className="w-full bg-black text-white py-4 rounded-2xl font-semibold"
          >
            {sending
              ? "Processing..."
              : sendMode === "auto"
              ? "Save Auto Sequence"
              : "Send Reminder"}
          </button>

        </div>
      </div>
    </Layout>
  );
}