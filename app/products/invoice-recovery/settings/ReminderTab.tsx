"use client";

import { useEffect, useState } from "react";
import axios from "axios";

/* ========================= */
type Template = {
  id: string;
  name: "friendly" | "firm" | "final";
};

type Schedule = {
  type: "friendly" | "firm" | "final";
  daysAfter: number;
  templateId: string;
};
/* ========================= */

export default function ReminderTab() {
  const [enabled, setEnabled] = useState(true);

  const [templates, setTemplates] = useState<Template[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([
    { type: "friendly", daysAfter: 1, templateId: "" },
    { type: "firm", daysAfter: 3, templateId: "" },
    { type: "final", daysAfter: 7, templateId: "" },
  ]);

  const [loading, setLoading] = useState(false);

  /* LOAD */
  const load = async () => {
    const [tRes, sRes] = await Promise.all([
      axios.get("/api/reminder-templates"),
      axios.get("/api/reminder-schedule"),
    ]);

    setTemplates(tRes.data);

    if (sRes.data?.length) {
      setSchedules(sRes.data);
    }
  };

  useEffect(() => {
    load();
  }, []);

  /* FIXED TS ERROR */
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

  /* SAVE */
  const save = async () => {
    try {
      setLoading(true);

      await axios.post("/api/reminder-schedule", {
        enabled,
        schedules,
      });

      alert("Saved");
    } catch {
      alert("Error saving");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* ENABLE */}
      <div className="flex justify-between border p-4 rounded">
        <div>
          <p className="font-medium">
            Auto Reminders
          </p>
        </div>

        <button
          onClick={() => setEnabled(!enabled)}
          className={`w-12 h-6 rounded-full ${
            enabled ? "bg-green-500" : "bg-gray-300"
          }`}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full transition ${
              enabled
                ? "translate-x-6"
                : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* TABLE */}
      <div className="border rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Days</th>
              <th className="p-3 text-left">Template</th>
            </tr>
          </thead>

          <tbody>
            {schedules.map((s, i) => (
              <tr key={s.type} className="border-t">

                <td className="p-3 capitalize">
                  {s.type}
                </td>

                <td className="p-3">
                  <input
                    type="number"
                    value={s.daysAfter}
                    onChange={(e) =>
                      updateSchedule(
                        i,
                        "daysAfter",
                        Number(e.target.value)
                      )
                    }
                    className="border px-2 py-1 rounded w-20"
                  />
                </td>

                <td className="p-3">
                  <select
                    value={s.templateId}
                    onChange={(e) =>
                      updateSchedule(
                        i,
                        "templateId",
                        e.target.value
                      )
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

      {/* SAVE */}
      <button
        onClick={save}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {loading ? "Saving..." : "Save Settings"}
      </button>

    </div>
  );
}