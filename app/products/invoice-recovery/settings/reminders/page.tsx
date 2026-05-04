"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";

/* =========================
   TYPES
========================= */
type Template = {
  id: string;
  name: "friendly" | "firm" | "final";
};

type Schedule = {
  type: "friendly" | "firm" | "final";
  daysAfter: number;
  templateId: string;
};

/* =========================
   COMPONENT
========================= */
export default function ReminderSettingsPage() {
  const [enabled, setEnabled] = useState(true);

  const [templates, setTemplates] = useState<Template[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([
    { type: "friendly", daysAfter: 1, templateId: "" },
    { type: "firm", daysAfter: 3, templateId: "" },
    { type: "final", daysAfter: 7, templateId: "" },
  ]);

  const [loading, setLoading] = useState(false);

  /* =========================
     LOAD DATA
  ========================= */
  const load = async () => {
    try {
      const [tRes, sRes] = await Promise.all([
        axios.get("/api/reminder-templates"),
        axios.get("/api/reminder-schedule"),
      ]);

      setTemplates(tRes.data);

      if (sRes.data?.length) {
        setSchedules(sRes.data);
      }

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  /* =========================
     UPDATE FIELD
  ========================= */
const updateSchedule = (
  index: number,
  field: keyof Schedule,
  value: string | number
) => {
  const updated = [...schedules];
  updated[index] = {
    ...updated[index],
    [field]: value,
  };
  setSchedules(updated);
};
  /* =========================
     SAVE SETTINGS
  ========================= */
  const save = async () => {
    try {
      setLoading(true);

      await axios.post("/api/reminder-schedule", {
        enabled,
        schedules,
      });

      alert("✅ Settings saved");

    } catch (err) {
      console.error(err);
      alert("❌ Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-3xl">

        {/* HEADER */}
        <div>
          <h1 className="text-xl font-semibold">
            Reminder Settings
          </h1>
          <p className="text-sm text-gray-500">
            Configure automatic invoice reminders
          </p>
        </div>

        {/* ENABLE TOGGLE */}
        <div className="flex items-center justify-between border p-4 rounded-md">
          <div>
            <h2 className="font-medium">
              Auto Reminders
            </h2>
            <p className="text-sm text-gray-500">
              Automatically send reminders for unpaid invoices
            </p>
          </div>

          <button
            onClick={() => setEnabled(!enabled)}
            className={`w-12 h-6 rounded-full transition ${
              enabled ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full transform transition ${
                enabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* SCHEDULE TABLE */}
        <div className="border rounded-md overflow-hidden">

          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Send After (Days)</th>
                <th className="p-3 text-left">Template</th>
              </tr>
            </thead>

            <tbody>
              {schedules.map((s, i) => (
                <tr key={s.type} className="border-t">

                  {/* TYPE */}
                  <td className="p-3 capitalize font-medium">
                    {s.type}
                  </td>

                  {/* DAYS */}
                  <td className="p-3">
                    <input
                      type="number"
                      value={s.daysAfter}
                      onChange={(e) =>
                        updateSchedule(i, "daysAfter", Number(e.target.value))
                      }
                      className="border px-2 py-1 rounded w-20"
                    />
                  </td>

                  {/* TEMPLATE */}
                  <td className="p-3">
                    <select
                      value={s.templateId}
                      onChange={(e) =>
                        updateSchedule(i, "templateId", e.target.value)
                      }
                      className="border px-2 py-1 rounded w-full"
                    >
                      <option value="">
                        Select template
                      </option>

                      {templates
                        .filter((t) => t.name === s.type)
                        .map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                    </select>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SAVE BUTTON */}
        <div>
          <button
            onClick={save}
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded-md text-sm"
          >
            {loading ? "Saving..." : "Save Settings"}
          </button>
        </div>

      </div>
    </Layout>
  );
}