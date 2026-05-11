// app/products/invoice-recovery/settings/templates/page.tsx

"use client";

import { useEffect, useState } from "react";

import axios from "axios";

import Layout from "@/components/Layout";

import toast from "react-hot-toast";

import {
  Plus,
  Trash2,
  Save,
  Eye,
  Mail,
  Sparkles,
  FileText,
} from "lucide-react";

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

export default function TemplatePage() {

  /* =========================================
     STATE
  ========================================= */

  const [templates, setTemplates] =
    useState<Template[]>([]);

  const [selected, setSelected] =
    useState<Template | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({
      name: "",

      subject: "",

      html: "",

      type:
        "friendly" as Template["type"],
    });

  /* =========================================
     LOAD
  ========================================= */

  const load =
    async () => {
      try {

        const res =
          await axios.get(
            "/api/reminder-templates"
          );

        setTemplates(
          res.data.templates || []
        );

      } catch (err) {

        console.error(err);

        toast.error(
          "Failed to load templates"
        );
      }
    };

  useEffect(() => {
    load();
  }, []);

  /* =========================================
     SELECT
  ========================================= */

  const selectTemplate =
    (template: Template) => {

      setSelected(template);

      setForm({
        name: template.name,

        subject:
          template.subject,

        html: template.html,

        type: template.type,
      });
    };

  /* =========================================
     RESET
  ========================================= */

  const resetForm =
    () => {

      setSelected(null);

      setForm({
        name: "",

        subject: "",

        html: "",

        type: "friendly",
      });
    };

  /* =========================================
     SAVE
  ========================================= */

  const save =
    async () => {
      try {

        if (
          !form.name ||
          !form.subject ||
          !form.html
        ) {
          toast.error(
            "All fields are required"
          );

          return;
        }

        setLoading(true);

        await axios.post(
          "/api/reminder-templates",
          {
            id: selected?.id,

            ...form,
          }
        );

        toast.success(
          selected
            ? "Template updated"
            : "Template created"
        );

        resetForm();

        load();

      } catch (err) {

        console.error(err);

        toast.error(
          "Failed to save template"
        );

      } finally {

        setLoading(false);
      }
    };

  /* =========================================
     DELETE
  ========================================= */

  const remove =
    async (
      id: string,
      isDefault: boolean
    ) => {

      if (isDefault) {

        toast.error(
          "Default templates cannot be deleted"
        );

        return;
      }

      const ok =
        confirm(
          "Delete this template?"
        );

      if (!ok) return;

      try {

        await axios.delete(
          `/api/reminder-templates?id=${id}`
        );

        toast.success(
          "Template deleted"
        );

        if (
          selected?.id === id
        ) {
          resetForm();
        }

        load();

      } catch (err) {

        console.error(err);

        toast.error(
          "Delete failed"
        );
      }
    };

  return (
    <Layout>

      <div className="space-y-8">

        {/* =========================================
           HEADER
        ========================================= */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          <div>

            <div className="flex items-center gap-2 mb-3">

              <Sparkles
                size={18}
                className="text-orange-500"
              />

              <span className="text-sm font-medium text-orange-600">
                Recovery Templates
              </span>

            </div>

            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Reminder Templates
            </h1>

            <p className="text-gray-500 mt-2 text-base max-w-2xl">
              Create reusable recovery templates
              for email reminders and automated
              collection workflows.
            </p>

          </div>

          <button
            onClick={resetForm}
            className="
              h-12 px-5 rounded-2xl
              bg-black text-white
              flex items-center gap-2
              font-semibold
              hover:bg-gray-900
              transition
            "
          >

            <Plus size={18} />

            New Template

          </button>

        </div>

        {/* =========================================
           STATS
        ========================================= */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <StatCard
            label="Total Templates"
            value={templates.length}
          />

          <StatCard
            label="Default"
            value={
              templates.filter(
                (t) =>
                  t.isDefault
              ).length
            }
          />

          <StatCard
            label="Custom"
            value={
              templates.filter(
                (t) =>
                  !t.isDefault
              ).length
            }
          />

        </div>

        {/* =========================================
           MAIN
        ========================================= */}

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

          {/* =========================================
             SIDEBAR
          ========================================= */}

          <div className="
            bg-white
            border border-gray-200
            rounded-3xl
            p-5
            shadow-sm
            h-fit
          ">

            <div className="flex items-center gap-2 mb-5">

              <Mail size={18} />

              <h2 className="font-semibold text-lg">
                Templates
              </h2>

            </div>

            <div className="space-y-3">

              {templates.map(
                (template) => (

                  <div
                    key={template.id}
                    onClick={() =>
                      selectTemplate(
                        template
                      )
                    }
                    className={`
                      p-4 rounded-2xl border
                      cursor-pointer transition
                      ${
                        selected?.id ===
                        template.id
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }
                    `}
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div className="min-w-0">

                        <div className="flex items-center gap-2">

                          <h3 className="font-semibold truncate">
                            {template.name}
                          </h3>

                          {template.isDefault && (

                            <span className="
                              text-[10px]
                              bg-blue-100
                              text-blue-700
                              px-2 py-1
                              rounded-full
                            ">
                              Default
                            </span>

                          )}

                        </div>

                        <p className="text-xs text-gray-500 mt-1 capitalize">
                          {template.type}
                        </p>

                      </div>

                      {!template.isDefault && (

                        <button
                          onClick={(e) => {
                            e.stopPropagation();

                            remove(
                              template.id,
                              template.isDefault
                            );
                          }}
                          className="text-red-500 hover:text-red-600"
                        >

                          <Trash2 size={15} />

                        </button>

                      )}

                    </div>

                  </div>
                )
              )}

            </div>

          </div>

          {/* =========================================
             EDITOR
          ========================================= */}

          <div className="
            xl:col-span-3
            bg-white
            border border-gray-200
            rounded-3xl
            shadow-sm
            overflow-hidden
          ">

            {/* TOP BAR */}

            <div className="
              border-b border-gray-200
              px-6 py-5
              flex items-center justify-between
            ">

              <div>

                <h2 className="text-xl font-semibold">

                  {selected
                    ? "Edit Template"
                    : "Create Template"}

                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Build invoice reminder templates
                </p>

              </div>

              <button
                onClick={save}
                disabled={loading}
                className="
                  h-12 px-5 rounded-2xl
                  bg-orange-500 hover:bg-orange-600
                  text-white font-semibold
                  flex items-center gap-2
                  transition
                "
              >

                <Save size={16} />

                {loading
                  ? "Saving..."
                  : "Save Template"}

              </button>

            </div>

            {/* CONTENT */}

            <div className="p-6 space-y-6">

              {/* GRID */}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* NAME */}

                <div>

                  <label className="
                    block text-sm font-semibold
                    text-gray-700 mb-2
                  ">
                    Template Name
                  </label>

                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        name:
                          e.target.value,
                      })
                    }
                    placeholder="Friendly Reminder"
                    className="
                      w-full border border-gray-300
                      rounded-2xl px-4 py-3
                      outline-none
                      focus:border-orange-500
                      focus:ring-4
                      focus:ring-orange-100
                    "
                  />

                </div>

                {/* TYPE */}

                <div>

                  <label className="
                    block text-sm font-semibold
                    text-gray-700 mb-2
                  ">
                    Reminder Type
                  </label>

                  <select
                    value={form.type}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        type:
                          e.target
                            .value as Template["type"],
                      })
                    }
                    className="
                      w-full border border-gray-300
                      rounded-2xl px-4 py-3
                      bg-white outline-none
                      focus:border-orange-500
                      focus:ring-4
                      focus:ring-orange-100
                    "
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

              </div>

              {/* SUBJECT */}

              <div>

                <label className="
                  block text-sm font-semibold
                  text-gray-700 mb-2
                ">
                  Subject
                </label>

                <input
                  value={form.subject}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      subject:
                        e.target.value,
                    })
                  }
                  placeholder="Invoice Reminder"
                  className="
                    w-full border border-gray-300
                    rounded-2xl px-4 py-3
                    outline-none
                    focus:border-orange-500
                    focus:ring-4
                    focus:ring-orange-100
                  "
                />

              </div>

              {/* VARIABLES */}

              <div className="
                bg-gray-50 border border-gray-200
                rounded-2xl p-5
              ">

                <p className="font-semibold text-sm mb-3">
                  Available Variables
                </p>

                <div className="flex flex-wrap gap-2">

                  {[
                    "{{name}}",
                    "{{amount}}",
                    "{{link}}",
                    "{{dueDate}}",
                    "{{email}}",
                  ].map((item) => (

                    <code
                      key={item}
                      className="
                        bg-white border
                        px-3 py-2
                        rounded-xl text-xs
                      "
                    >
                      {item}
                    </code>

                  ))}

                </div>

              </div>

              {/* HTML */}

              <div>

                <label className="
                  block text-sm font-semibold
                  text-gray-700 mb-2
                ">
                  Email HTML
                </label>

                <textarea
                  rows={14}
                  value={form.html}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      html:
                        e.target.value,
                    })
                  }
                  placeholder="Paste email HTML..."
                  className="
                    w-full border border-gray-300
                    rounded-2xl px-4 py-4
                    font-mono text-sm
                    outline-none
                    focus:border-orange-500
                    focus:ring-4
                    focus:ring-orange-100
                  "
                />

              </div>

              {/* PREVIEW */}

              <div>

                <div className="flex items-center gap-2 mb-4">

                  <Eye size={18} />

                  <h3 className="font-semibold text-lg">
                    Live Preview
                  </h3>

                </div>

                <div className="
                  border border-gray-200
                  rounded-3xl overflow-hidden
                  bg-gray-100
                ">

                  <div className="
                    bg-white min-h-[320px]
                    p-8
                  ">

                    {form.html ? (

                      <div
                        dangerouslySetInnerHTML={{
                          __html:
                            form.html,
                        }}
                      />

                    ) : (

                      <div className="
                        h-[320px]
                        flex flex-col items-center justify-center
                        text-gray-400
                      ">

                        <FileText size={40} />

                        <p className="mt-3 text-sm">
                          Preview will appear here
                        </p>

                      </div>

                    )}

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </Layout>
  );
}

/* =========================================
   STAT CARD
========================================= */

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="
      bg-white border border-gray-200
      rounded-3xl p-5 shadow-sm
    ">

      <p className="text-sm text-gray-500">
        {label}
      </p>

      <h3 className="text-3xl font-bold mt-2">
        {value}
      </h3>

    </div>
  );
}