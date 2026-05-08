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
  text: string;
};

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
    useState<EmailPreview | null>(
      null
    );

  const [tab, setTab] =
    useState<"text" | "html">(
      "text"
    );

  const [loading, setLoading] =
    useState(false);

  const [sending, setSending] =
    useState(false);

  const [showDropdown, setShowDropdown] =
    useState(false);

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

        setTemplates(res.data);

      } catch (err) {
        console.error(err);
      }
    };

  /* =========================
     FILTER
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
    return content
      .replaceAll(
        "{{name}}",
        selected?.clientEmail?.split(
          "@"
        )[0] || "Customer"
      )
      .replaceAll(
        "{{amount}}",
        amount
      )
      .replaceAll(
        "{{email}}",
        selected?.clientEmail ||
          ""
      )
      .replaceAll(
        "{{dueDate}}",
        new Date().toLocaleDateString()
      );
  };

  /* =========================
     GENERATE
  ========================= */

  const generate =
    async () => {
      if (!selected)
        return alert(
          "Select client"
        );

      if (!amount)
        return alert(
          "Enter reminder amount"
        );

      if (!selectedTemplate)
        return alert(
          "Select template"
        );

      setLoading(true);

      try {
        const finalHtml =
          applyVariables(
            selectedTemplate.html
          );

        const finalText =
          applyVariables(
            selectedTemplate.text
          );

        setPreview({
          html: finalHtml,
          text: finalText,
        });

      } catch {
        alert(
          "Failed to generate"
        );

      } finally {
        setLoading(false);
      }
    };

  /* =========================
     SEND
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

            html:
              preview.html,

            text:
              preview.text,

            amount:
              Number(amount),

            subject:
              selectedTemplate?.subject ||
              "Invoice Reminder",
          }
        );

        alert("✅ Sent");

        window.location.href =
          "/products/invoice-recovery/reminders";

      } catch {
        alert(
          "Failed to send"
        );

      } finally {
        setSending(false);
      }
    };

  return (
    <Layout>
      <div className="max-w-3xl space-y-6">

        {/* HEADER */}

        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Send Reminder
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Send branded invoice reminders
            using saved templates
          </p>
        </div>

        {/* CARD */}

        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5">

          {/* CLIENT */}

          <div className="relative">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Client Email
            </label>

            <input
              placeholder="Search client email..."
              className="border border-gray-300 p-3 w-full rounded-xl outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
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
            />

            {showDropdown && (
              <div className="absolute z-20 w-full border border-gray-200 mt-2 rounded-xl max-h-48 overflow-y-auto bg-white shadow-lg">

                {filtered.length ===
                0 ? (
                  <div className="p-3 text-sm text-gray-500">
                    No results
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
                        className="p-3 text-sm hover:bg-gray-50 cursor-pointer"
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
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="text-sm text-gray-500">
                Total Amount Due
              </p>

              <p className="text-3xl font-bold text-gray-900 mt-1">
                $
                {selected.amount}
              </p>
            </div>
          )}

          {/* REMINDER AMOUNT */}

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Reminder Amount
            </label>

            <input
              type="number"
              placeholder="Enter reminder amount"
              className="border border-gray-300 p-3 w-full rounded-xl outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
              value={amount}
              onChange={(e) =>
                setAmount(
                  e.target.value
                )
              }
            />
          </div>

          {/* TEMPLATE */}

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Select Template
            </label>

            <select
              value={
                selectedTemplate?.id ||
                ""
              }
              onChange={(e) => {
                const template =
                  templates.find(
                    (t) =>
                      t.id ===
                      e.target.value
                  );

                setSelectedTemplate(
                  template ||
                    null
                );
              }}
              className="border border-gray-300 p-3 w-full rounded-xl outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 bg-white"
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
                    }
                  </option>
                )
              )}
            </select>
          </div>

          {/* GENERATE */}

          <button
            onClick={generate}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-xl transition"
          >
            {loading
              ? "Generating..."
              : "Generate Email"}
          </button>

          {/* PREVIEW */}

          {preview && (
            <div className="space-y-4 pt-4">

              {/* TABS */}

              <div className="flex gap-5 border-b border-gray-200">
                <button
                  onClick={() =>
                    setTab(
                      "text"
                    )
                  }
                  className={`pb-2 text-sm ${
                    tab === "text"
                      ? "border-b-2 border-orange-500 text-orange-600 font-semibold"
                      : "text-gray-500"
                  }`}
                >
                  Text
                </button>

                <button
                  onClick={() =>
                    setTab(
                      "html"
                    )
                  }
                  className={`pb-2 text-sm ${
                    tab === "html"
                      ? "border-b-2 border-orange-500 text-orange-600 font-semibold"
                      : "text-gray-500"
                  }`}
                >
                  HTML
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
                  className="border border-gray-300 p-4 w-full h-56 rounded-xl outline-none"
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
                    className="border border-gray-300 p-4 w-full h-56 rounded-xl outline-none font-mono text-sm"
                  />

                  {/* LIVE PREVIEW */}

                  <div className="border border-gray-200 rounded-xl p-5 bg-gray-50">
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
                className="w-full bg-black hover:bg-gray-900 text-white font-medium py-3 rounded-xl transition"
              >
                {sending
                  ? "Sending..."
                  : "Send Email"}
              </button>

            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}