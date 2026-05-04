"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";

type Template = {
  id: string;
  name: string;
  subject: string;
  html: string;
};

export default function TemplatePage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selected, setSelected] = useState<Template | null>(null);

  const [form, setForm] = useState({
    name: "",
    subject: "",
    html: "",
  });

  /* =========================
     LOAD
  ========================= */
  const load = async () => {
    const res = await axios.get("/api/reminder-templates");
    setTemplates(res.data);
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
    });
  };

  /* =========================
     SAVE
  ========================= */
  const save = async () => {
    await axios.post("/api/reminder-templates", {
      id: selected?.id,
      ...form,
    });

    setSelected(null);
    setForm({ name: "", subject: "", html: "" });
    load();
  };

  /* =========================
     DELETE
  ========================= */
  const remove = async (id: string) => {
    await axios.delete(`/api/reminder-templates?id=${id}`);
    load();
  };

  return (
    <Layout>
      <div className="grid grid-cols-3 gap-6">

        {/* LEFT: LIST */}
        <div className="border rounded p-4 space-y-2">
          <h2 className="font-semibold">Templates</h2>

          {templates.map((t) => (
            <div
              key={t.id}
              className="p-2 border rounded cursor-pointer hover:bg-gray-50 flex justify-between"
              onClick={() => selectTemplate(t)}
            >
              <span>{t.name}</span>

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

        {/* RIGHT: EDITOR */}
        <div className="col-span-2 space-y-4">

          <input
            placeholder="Template Name (Friendly / Firm / Final)"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="w-full border px-3 py-2 rounded"
          />

          <input
            placeholder="Email Subject"
            value={form.subject}
            onChange={(e) =>
              setForm({ ...form, subject: e.target.value })
            }
            className="w-full border px-3 py-2 rounded"
          />

          <textarea
            placeholder="HTML Email Content"
            value={form.html}
            onChange={(e) =>
              setForm({ ...form, html: e.target.value })
            }
            rows={12}
            className="w-full border px-3 py-2 rounded font-mono"
          />

          {/* LIVE PREVIEW */}
          <div className="border p-4 rounded bg-white">
            <div
              dangerouslySetInnerHTML={{ __html: form.html }}
            />
          </div>

          <button
            onClick={save}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Save Template
          </button>
        </div>
      </div>
    </Layout>
  );
}