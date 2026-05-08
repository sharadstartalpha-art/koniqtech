"use client";

import { useEffect, useState } from "react";

import axios from "axios";

import Layout from "@/components/Layout";

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

export default function CreateReminderPage() {
  const [invoices, setInvoices] =
    useState<Invoice[]>([]);

  const [templates, setTemplates] =
    useState<Template[]>([]);

  const [
    selectedTemplate,
    setSelectedTemplate,
  ] = useState<Template | null>(
    null
  );

  const [search, setSearch] =
    useState("");

  const [selected, setSelected] =
    useState<Invoice | null>(null);

  const [amount, setAmount] =
    useState("");

  const [preview, setPreview] =
    useState<EmailPreview | null>(
      null
    );

  const [tab, setTab] =
    useState<"text" | "html">(
      "html"
    );

  const [loading, setLoading] =
    useState(false);

  const [sending, setSending] =
    useState(false);

  const [showDropdown, setShowDropdown] =
    useState(false);

  /* =========================
     REMINDER MODE
  ========================= */

  const [mode, setMode] =
    useState<
      "manual" | "auto"
    >("manual");

  /* =========================
     LOAD DATA
  ========================= */

  useEffect(() => {
    loadInvoices();

    loadTemplates();
  }, []);

  /* =========================
     LOAD INVOICES
  ========================= */

  const loadInvoices =
    async () => {
      try {
        const res =
          await axios.get(
            "/api/invoices"
          );

        setInvoices(res.data);

      } catch (err) {
        console.error(err);
      }
    };

  /* =========================
     LOAD TEMPLATES
  ========================= */

  const loadTemplates =
    async () => {
      try {
        const res =
          await axios.get(
            "/api/templates"
          );

        console.log(
          "TEMPLATES:",
          res.data
        );

        setTemplates(
          Array.isArray(
            res.data
          )
            ? res.data
            : []
        );

      } catch (err) {
        console.error(err);

        setTemplates([]);
      }
    };

  /* =========================
     FILTER CLIENTS
  ========================= */

  const filtered =
    invoices.filter((inv) =>
      inv.clientEmail
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  /* =========================
     APPLY VARIABLES
  ========================= */

  const applyVariables = (
    content: string
  ) => {
    if (!content) return "";

    return content
      .replaceAll(
        "{{name}}",
        selected?.clientEmail?.split(
          "@"
        )[0] || "Customer"
      )

      .replaceAll(
        "{{amount}}",
        amount ||
          String(
            selected?.amount || 0
          )
      )

      .replaceAll(
        "{{email}}",
        selected?.clientEmail ||
          ""
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
     GENERATE EMAIL
  ========================= */

  const generate =
    async () => {
      if (!selected) {
        return alert(
          "Select client"
        );
      }

      if (
        mode === "manual" &&
        !amount
      ) {
        return alert(
          "Enter reminder amount"
        );
      }

      if (
        !selectedTemplate
      ) {
        return alert(
          "Select template"
        );
      }

      setLoading(true);

      try {
        const finalAmount =
          mode === "manual"
            ? amount
            : String(
                selected.amount
              );

        const html =
          applyVariables(
            selectedTemplate.html
          ).replaceAll(
            "{{amount}}",
            finalAmount
          );

        const text =
          selectedTemplate.text
            ? applyVariables(
                selectedTemplate.text
              ).replaceAll(
                "{{amount}}",
                finalAmount
              )
            : `
Hi ${
                selected.clientEmail.split(
                  "@"
                )[0]
              },

This is a reminder that your invoice payment of $${finalAmount} is pending.

Please complete the payment before the due date.

Thank you,
KoniqTech
`;

        setPreview({
          html,
          text,
        });

      } catch (err) {
        console.error(err);

        alert(
          "Failed to generate email"
        );

      } finally {
        setLoading(false);
      }
    };

  /* =========================
     SEND EMAIL
  ========================= */

  const send =
    async () => {
      if (
        !selected ||
        !preview
      ) {
        return alert(
          "Missing data"
        );
      }

      setSending(true);

      try {
        await axios.post(
          "/api/reminders/send-custom",
          {
            email:
              selected.clientEmail,

            subject:
              selectedTemplate?.subject ||
              "Invoice Reminder",

            html:
              preview.html,

            text:
              preview.text,

            amount:
              mode ===
              "manual"
                ? Number(
                    amount
                  )
                : selected.amount,
          }
        );

        alert(
          "✅ Reminder sent"
        );

        window.location.href =
          "/products/invoice-recovery/reminders";

      } catch (err) {
        console.error(err);

        alert(
          "Failed to send email"
        );

      } finally {
        setSending(false);
      }
    };

  return (
    <Layout>
      <div className="max-w-4xl space-y-6">

        {/* HEADER */}

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Send Reminder
          </h1>

          <p className="text-gray-500 mt-1">
            Send invoice reminders using saved templates
          </p>
        </div>

        {/* CARD */}

        <div className="bg-white border border-gray-200 rounded-3xl p-8 space-y-6 shadow-sm">

          {/* CLIENT */}

          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Client Email
            </label>

            <input
              placeholder="Search client email..."
              value={search}
              onChange={(e) => {
                setSearch(
                  e.target.value
                );

                setShowDropdown(
                  true
                );
              }}
              onFocus={() =>
                setShowDropdown(
                  true
                )
              }
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
            />

            {showDropdown && (
              <div className="absolute z-20 w-full bg-white border border-gray-200 rounded-2xl shadow-xl mt-2 max-h-52 overflow-y-auto">

                {filtered.length ===
                0 ? (
                  <div className="p-4 text-sm text-gray-500">
                    No clients found
                  </div>
                ) : (
                  filtered.map(
                    (inv) => (
                      <div
                        key={inv.id}
                        onClick={() => {
                          setSelected(
                            inv
                          );

                          setSearch(
                            inv.clientEmail
                          );

                          setShowDropdown(
                            false
                          );
                        }}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm"
                      >
                        {
                          inv.clientEmail
                        }
                      </div>
                    )
                  )
                )}
              </div>
            )}
          </div>

          {/* TOTAL */}

          {selected && (
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-5">

              <p className="text-sm text-orange-700">
                Total Invoice Due
              </p>

              <p className="text-4xl font-bold text-orange-600 mt-1">
                $
                {selected.amount}
              </p>

            </div>
          )}

          {/* MODE */}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Reminder Mode
            </label>

            <div className="flex gap-3">

              <button
                onClick={() =>
                  setMode(
                    "manual"
                  )
                }
                className={`px-5 py-2 rounded-xl border text-sm font-medium transition ${
                  mode ===
                  "manual"
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                Manual Amount
              </button>

              <button
                onClick={() =>
                  setMode("auto")
                }
                className={`px-5 py-2 rounded-xl border text-sm font-medium transition ${
                  mode ===
                  "auto"
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                Auto Full Amount
              </button>

            </div>
          </div>

          {/* MANUAL AMOUNT */}

          {mode ===
            "manual" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Reminder Amount
              </label>

              <input
                type="number"
                placeholder="Enter reminder amount"
                value={amount}
                onChange={(e) =>
                  setAmount(
                    e.target.value
                  )
                }
                className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
              />
            </div>
          )}

          {/* TEMPLATE */}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Template
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
                      e.target.value
                  );

                setSelectedTemplate(
                  found || null
                );
              }}
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 bg-white outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
            >
              <option value="">
                Choose template
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
                    }{" "}
                    (
                    {
                      template.type
                    }
                    )
                  </option>
                )
              )}
            </select>

            {templates.length ===
              0 && (
              <p className="text-sm text-red-500 mt-2">
                No templates found
              </p>
            )}
          </div>

          {/* GENERATE */}

          <button
            onClick={generate}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-2xl transition"
          >
            {loading
              ? "Generating..."
              : "Generate Email"}
          </button>

          {/* PREVIEW */}

          {preview && (
            <div className="space-y-5 pt-4">

              {/* TABS */}

              <div className="flex gap-6 border-b border-gray-200">

                <button
                  onClick={() =>
                    setTab(
                      "html"
                    )
                  }
                  className={`pb-3 text-sm font-medium ${
                    tab ===
                    "html"
                      ? "border-b-2 border-orange-500 text-orange-600"
                      : "text-gray-500"
                  }`}
                >
                  HTML Preview
                </button>

                <button
                  onClick={() =>
                    setTab(
                      "text"
                    )
                  }
                  className={`pb-3 text-sm font-medium ${
                    tab ===
                    "text"
                      ? "border-b-2 border-orange-500 text-orange-600"
                      : "text-gray-500"
                  }`}
                >
                  Text Version
                </button>

              </div>

              {/* TEXT */}

              {tab ===
                "text" && (
                <textarea
                  value={
                    preview.text
                  }
                  onChange={(e) =>
                    setPreview({
                      ...preview,
                      text: e
                        .target
                        .value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-2xl p-4 h-64 outline-none"
                />
              )}

              {/* HTML */}

              {tab ===
                "html" && (
                <div className="space-y-4">

                  <textarea
                    value={
                      preview.html
                    }
                    onChange={(e) =>
                      setPreview({
                        ...preview,
                        html: e
                          .target
                          .value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-2xl p-4 h-64 outline-none font-mono text-sm"
                  />

                  <div className="border border-gray-200 rounded-2xl p-6 bg-gray-50 overflow-hidden">
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          preview.html,
                      }}
                    />
                  </div>

                </div>
              )}

              {/* SEND */}

              <button
                onClick={send}
                disabled={sending}
                className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-3 rounded-2xl transition"
              >
                {sending
                  ? "Sending..."
                  : "Send Reminder"}
              </button>

            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}