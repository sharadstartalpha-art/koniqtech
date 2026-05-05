"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";

/* =========================
   TYPES
========================= */
type Template = {
  id: string;
  name: string;
  subject: string;
  html: string;
  type: "friendly" | "firm" | "final" | "custom";
};

/* =========================
   COMPONENT
========================= */
export default function TemplatePage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selected, setSelected] = useState<Template | null>(null);

  const [form, setForm] = useState({
    name: "",
    subject: "",
    html: "",
    type: "friendly" as Template["type"],
  });

  const [loading, setLoading] = useState(false);

  /* =========================
     LOAD TEMPLATES
  ========================= */
  const load = async () => {
    try {
      const res = await axios.get("/api/reminder-templates");
      setTemplates(res.data);
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
  const selectTemplate = (t: Template) => {
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
      setLoading(true);

      await axios.post("/api/reminder-templates", {
        id: selected?.id,
        ...form,
      });

      resetForm();
      load();
    } catch (err) {
      console.error(err);
      alert("Error saving template");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     DELETE TEMPLATE
  ========================= */
  const remove = async (id: string) => {
    if (!confirm("Delete this template?")) return;

    await axios.delete(`/api/reminder-templates?id=${id}`);
    load();
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
      <div className="grid grid-cols-3 gap-6">

        {/* =========================
            TEMPLATE LIST
        ========================= */}
        <div className="border rounded p-4 space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold">Templates</h2>

            <button
              onClick={resetForm}
              className="text-xs border px-2 py-1 rounded"
            >
              + New
            </button>
          </div>

          {templates.map((t) => (
            <div
              key={t.id}
              onClick={() => selectTemplate(t)}
              className="p-2 border rounded cursor-pointer hover:bg-gray-50 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{t.name}</p>
                <p className="text-xs text-gray-500">
                  {t.type}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  remove(t.id);
                }}
                className="text-red-500 text-xs"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* =========================
            EDITOR
        ========================= */}
        <div className="col-span-2 space-y-4">

          {/* NAME */}
          <input
            placeholder="Template Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="w-full border px-3 py-2 rounded"
          />

          {/* TYPE */}
          <select
            value={form.type}
            onChange={(e) =>
              setForm({
                ...form,
                type: e.target.value as Template["type"],
              })
            }
            className="w-full border px-3 py-2 rounded"
          >
            <option value="friendly">Friendly</option>
            <option value="firm">Firm</option>
            <option value="final">Final</option>
            <option value="custom">Custom</option>
          </select>

          {/* SUBJECT */}
          <input
            placeholder="Email Subject"
            value={form.subject}
            onChange={(e) =>
              setForm({ ...form, subject: e.target.value })
            }
            className="w-full border px-3 py-2 rounded"
          />

          {/* HTML */}
          <textarea
            placeholder="HTML Email Content"
            value={form.html}
            onChange={(e) =>
              setForm({ ...form, html: e.target.value })
            }
            rows={12}
            className="w-full border px-3 py-2 rounded font-mono"
          />

          {/* VARIABLES */}
          <div className="text-xs text-gray-500">
            Variables:
            <div className="space-x-2 mt-1">
              <code>{"{{name}}"}</code>
              <code>{"{{amount}}"}</code>
              <code>{"{{link}}"}</code>
              <code>{"{{dueDate}}"}</code>
            </div>
          </div>

          {/* PREVIEW */}
          <div className="border p-4 rounded bg-white">
            <div
              dangerouslySetInnerHTML={{ __html: form.html }}
            />
          </div>

          {/* ACTIONS */}
          <div className="flex gap-2">
            <button
              onClick={save}
              disabled={loading}
              className="bg-black text-white px-4 py-2 rounded"
            >
              {loading ? "Saving..." : "Save"}
            </button>

            {selected && (
              <button
                onClick={resetForm}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}