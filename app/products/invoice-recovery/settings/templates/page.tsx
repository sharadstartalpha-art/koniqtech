"use client";

import { useEffect, useState } from "react";

import axios from "axios";

import Layout from "@/components/Layout";

import {
  Plus,
  Trash2,
  Save,
  Eye,
  FileText,
} from "lucide-react";

/* =========================
   TYPES
========================= */

type Template = {
  id: string;

  userId: string;

  name: string;

  subject: string;

  html: string;

  type:
    | "friendly"
    | "firm"
    | "final"
    | "custom";

  isDefault: boolean;
};

/* =========================
   COMPONENT
========================= */

export default function TemplatePage() {
  const [templates, setTemplates] =
    useState<Template[]>([]);

  const [selected, setSelected] =
    useState<Template | null>(null);

  const [form, setForm] =
    useState({
      name: "",

      subject: "",

      html: "",

      type:
        "friendly" as Template["type"],
    });

  const [loading, setLoading] =
    useState(false);

  /* =========================
     LOAD TEMPLATES
  ========================= */

  const load = async () => {
    try {
      const res =
        await axios.get(
          "/api/reminder-templates"
        );

      const data =
        res.data.templates ||
        res.data ||
        [];

      setTemplates(data);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  /* =========================
     SELECT TEMPLATE
  ========================= */

  const selectTemplate = (
    t: Template
  ) => {
    setSelected(t);

    setForm({
      name: t.name,

      subject: t.subject,

      html: t.html,

      type: t.type,
    });
  };

  /* =========================
     SAVE TEMPLATE
  ========================= */

  const save = async () => {
    try {
      if (
        !form.name ||
        !form.subject ||
        !form.html
      ) {
        return alert(
          "All fields are required"
        );
      }

      setLoading(true);

      await axios.post(
        "/api/reminder-templates",
        {
          id: selected?.id,

          ...form,
        }
      );

      alert(
        selected
          ? "Template updated"
          : "Template created"
      );

      resetForm();

      load();

    } catch (err) {
      console.error(err);

      alert(
        "Error saving template"
      );

    } finally {
      setLoading(false);
    }
  };

  /* =========================
     DELETE TEMPLATE
  ========================= */

  const remove = async (
    id: string,
    isDefault: boolean
  ) => {
    /* DEFAULT TEMPLATES
       SHOULD NOT DELETE */

    if (isDefault) {
      return alert(
        "Default templates cannot be deleted"
      );
    }

    if (
      !confirm(
        "Delete this template?"
      )
    ) {
      return;
    }

    try {
      await axios.delete(
        `/api/reminder-templates?id=${id}`
      );

      if (
        selected?.id === id
      ) {
        resetForm();
      }

      load();

    } catch (err) {
      console.error(err);

      alert(
        "Failed to delete template"
      );
    }
  };

  /* =========================
     RESET FORM
  ========================= */

  const resetForm = () => {
    setSelected(null);

    setForm({
      name: "",

      subject: "",

      html: "",

      type: "friendly",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">

        {/* HEADER */}

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Email Templates
          </h1>

          <p className="text-gray-500 mt-1">
            Customize reminder
            templates for your
            SaaS emails
          </p>
        </div>

        {/* MAIN */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* =========================
              TEMPLATE LIST
          ========================= */}

          <div className="bg-white border border-gray-200 rounded-3xl p-5 space-y-4 shadow-sm h-fit">

            {/* TOP */}

            <div className="flex items-center justify-between">

              <h2 className="font-semibold text-lg text-gray-900">
                Templates
              </h2>

              <button
                onClick={
                  resetForm
                }
                className="flex items-center gap-1 text-sm border border-gray-300 hover:border-orange-500 hover:text-orange-600 px-3 py-1.5 rounded-xl transition"
              >
                <Plus size={14} />
                New
              </button>

            </div>

            {/* LIST */}

            <div className="space-y-3">

              {templates.map(
                (t) => (
                  <div
                    key={t.id}
                    onClick={() =>
                      selectTemplate(
                        t
                      )
                    }
                    className={`border rounded-2xl p-4 cursor-pointer transition ${
                      selected?.id ===
                      t.id
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">

                      <div className="min-w-0">

                        <div className="flex items-center gap-2">

                          <p className="font-semibold text-gray-900">
                            {t.name}
                          </p>

                          {t.isDefault && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                              Default
                            </span>
                          )}

                        </div>

                        <p className="text-xs text-gray-500 capitalize mt-1">
                          {t.type}
                        </p>

                      </div>

                      {/* DELETE */}

                      {!t.isDefault && (
                        <button
                          onClick={(
                            e
                          ) => {
                            e.stopPropagation();

                            remove(
                              t.id,
                              t.isDefault
                            );
                          }}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2
                            size={
                              15
                            }
                          />
                        </button>
                      )}

                    </div>
                  </div>
                )
              )}

            </div>
          </div>

          {/* =========================
              EDITOR
          ========================= */}

          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-5">

            {/* NAME */}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Template Name
              </label>

              <input
                placeholder="Ex: Friendly Reminder"
                value={form.name}
                onChange={(
                  e
                ) =>
                  setForm({
                    ...form,

                    name: e
                      .target
                      .value,
                  })
                }
                className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
              />
            </div>

            {/* TYPE */}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Reminder Type
              </label>

              <select
                value={
                  form.type
                }
                onChange={(
                  e
                ) =>
                  setForm({
                    ...form,

                    type:
                      e.target
                        .value as Template["type"],
                  })
                }
                className="w-full border border-gray-300 rounded-2xl px-4 py-3 bg-white outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
              >
                <option value="friendly">
                  Friendly
                </option>

                <option value="firm">
                  Firm
                </option>

                <option value="final">
                  Final
                </option>

                <option value="custom">
                  Custom
                </option>

              </select>
            </div>

            {/* SUBJECT */}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Subject
              </label>

              <input
                placeholder="Invoice Reminder"
                value={
                  form.subject
                }
                onChange={(
                  e
                ) =>
                  setForm({
                    ...form,

                    subject:
                      e.target
                        .value,
                  })
                }
                className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
              />
            </div>

            {/* HTML */}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                HTML Email Content
              </label>

              <textarea
                placeholder="Paste HTML email template..."
                value={
                  form.html
                }
                onChange={(
                  e
                ) =>
                  setForm({
                    ...form,

                    html: e
                      .target
                      .value,
                  })
                }
                rows={14}
                className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none font-mono text-sm focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
              />
            </div>

            {/* VARIABLES */}

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">

              <p className="text-sm font-semibold text-gray-700 mb-3">
                Available Variables
              </p>

              <div className="flex flex-wrap gap-2">

                <code className="bg-white border px-3 py-1 rounded-lg text-xs">
                  {"{{name}}"}
                </code>

                <code className="bg-white border px-3 py-1 rounded-lg text-xs">
                  {"{{amount}}"}
                </code>

                <code className="bg-white border px-3 py-1 rounded-lg text-xs">
                  {"{{link}}"}
                </code>

                <code className="bg-white border px-3 py-1 rounded-lg text-xs">
                  {"{{dueDate}}"}
                </code>

              </div>
            </div>

            {/* PREVIEW */}

            <div className="space-y-3">

              <div className="flex items-center gap-2">

                <Eye
                  size={18}
                />

                <h3 className="font-semibold text-gray-900">
                  Live Preview
                </h3>

              </div>

              <div className="border border-gray-200 rounded-2xl bg-gray-50 p-6 overflow-hidden">

                {form.html ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        form.html,
                    }}
                  />
                ) : (
                  <div className="flex items-center gap-2 text-gray-400">

                    <FileText
                      size={18}
                    />

                    <p className="text-sm">
                      Email preview will appear here
                    </p>

                  </div>
                )}

              </div>
            </div>

            {/* ACTIONS */}

            <div className="flex gap-3 pt-2">

              <button
                onClick={save}
                disabled={
                  loading
                }
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-2xl font-medium transition"
              >
                <Save
                  size={16}
                />

                {loading
                  ? "Saving..."
                  : selected
                  ? "Update Template"
                  : "Save Template"}
              </button>

              {selected && (
                <button
                  onClick={
                    resetForm
                  }
                  className="border border-gray-300 hover:bg-gray-50 px-5 py-3 rounded-2xl font-medium transition"
                >
                  Cancel
                </button>
              )}

            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}