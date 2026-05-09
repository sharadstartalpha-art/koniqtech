"use client";

import { useEffect, useState } from "react";

import axios from "axios";

import {
  Bell,
  Clock3,
  Globe,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function ReminderTab() {
  const [loading, setLoading] =
    useState(false);

  const [settings, setSettings] =
    useState({
      enabled: true,

      stopAfterPayment: true,

      smartReminder: true,

      sendWeekends: false,

      timezone:
        "Asia/Kolkata",

      senderName:
        "KoniqTech",

      replyTo:
        "",

      businessHours:
        "09:00 - 18:00",

      reminders: [
        {
          label:
            "Friendly Reminder",

          days: 1,
        },

        {
          label:
            "Firm Reminder",

          days: 3,
        },

        {
          label:
            "Final Notice",

          days: 7,
        },
      ],
    });

  /* =========================
     LOAD SETTINGS
  ========================= */

  const load = async () => {
    try {
      const res =
        await axios.get(
          "/api/settings"
        );

      if (res.data) {
        setSettings(
          res.data
        );
      }

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  /* =========================
     SAVE
  ========================= */

  const save = async () => {
    try {
      setLoading(true);

      await axios.post(
        "/api/settings",
        settings
      );

      alert(
        "Settings saved successfully"
      );

    } catch (err) {
      console.error(err);

      alert(
        "Failed to save settings"
      );

    } finally {
      setLoading(false);
    }
  };

  /* =========================
     TOGGLE
  ========================= */

  const toggle = (
    key: keyof typeof settings
  ) => {
    setSettings({
      ...settings,

      [key]:
        !settings[
          key
        ],
    });
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div>

        <div className="flex items-center gap-2 mb-2">

          <Sparkles
            size={18}
            className="text-orange-500"
          />

          <span className="text-sm font-medium text-orange-600">
            Automation Settings
          </span>

        </div>

        <h1 className="text-3xl font-bold text-gray-900">
          Reminder Settings
        </h1>

        <p className="text-gray-500 mt-2">
          Configure automation,
          sending behavior and
          recovery preferences.
        </p>

      </div>

      {/* GENERAL SETTINGS */}

      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6">

        <div className="flex items-center gap-2">

          <Bell size={18} />

          <h2 className="font-semibold text-lg">
            Automation
          </h2>

        </div>

        <ToggleRow
          title="Enable Auto Reminders"
          description="Automatically send reminder emails to unpaid invoices."
          enabled={
            settings.enabled
          }
          onClick={() =>
            toggle(
              "enabled"
            )
          }
        />

        <ToggleRow
          title="Stop After Payment"
          description="Immediately stop reminders once invoice is paid."
          enabled={
            settings.stopAfterPayment
          }
          onClick={() =>
            toggle(
              "stopAfterPayment"
            )
          }
        />

        <ToggleRow
          title="Smart Recovery AI"
          description="Automatically optimize reminder timing and tone."
          enabled={
            settings.smartReminder
          }
          onClick={() =>
            toggle(
              "smartReminder"
            )
          }
        />

        <ToggleRow
          title="Send On Weekends"
          description="Allow reminders to be sent during weekends."
          enabled={
            settings.sendWeekends
          }
          onClick={() =>
            toggle(
              "sendWeekends"
            )
          }
        />

      </div>

      {/* REMINDER FLOW */}

      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">

        <div className="flex items-center gap-2 mb-6">

          <Clock3
            size={18}
          />

          <h2 className="font-semibold text-lg">
            Reminder Timeline
          </h2>

        </div>

        <div className="space-y-4">

          {settings.reminders.map(
            (
              item,
              index
            ) => (
              <div
                key={
                  index
                }
                className="flex items-center justify-between border border-gray-200 rounded-2xl p-4"
              >

                <div>

                  <p className="font-medium text-gray-900">
                    {
                      item.label
                    }
                  </p>

                  <p className="text-sm text-gray-500">
                    Sends after{" "}
                    {
                      item.days
                    }{" "}
                    day(s)
                  </p>

                </div>

                <input
                  type="number"
                  value={
                    item.days
                  }
                  onChange={(
                    e
                  ) => {
                    const updated =
                      [
                        ...settings.reminders,
                      ];

                    updated[
                      index
                    ].days =
                      Number(
                        e.target
                          .value
                      );

                    setSettings(
                      {
                        ...settings,

                        reminders:
                          updated,
                      }
                    );
                  }}
                  className="border border-gray-300 rounded-xl px-4 py-2 w-24 outline-none focus:border-orange-500"
                />

              </div>
            )
          )}

        </div>

      </div>

      {/* SENDING */}

      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-5">

        <div className="flex items-center gap-2">

          <Mail size={18} />

          <h2 className="font-semibold text-lg">
            Sending Preferences
          </h2>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div>

            <label className="block text-sm font-medium mb-2">
              Sender Name
            </label>

            <input
              value={
                settings.senderName
              }
              onChange={(
                e
              ) =>
                setSettings({
                  ...settings,

                  senderName:
                    e.target
                      .value,
                })
              }
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-orange-500"
            />

          </div>

          <div>

            <label className="block text-sm font-medium mb-2">
              Reply-To Email
            </label>

            <input
              value={
                settings.replyTo
              }
              onChange={(
                e
              ) =>
                setSettings({
                  ...settings,

                  replyTo:
                    e.target
                      .value,
                })
              }
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-orange-500"
            />

          </div>

        </div>

      </div>

      {/* REGION */}

      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-5">

        <div className="flex items-center gap-2">

          <Globe size={18} />

          <h2 className="font-semibold text-lg">
            Regional Settings
          </h2>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div>

            <label className="block text-sm font-medium mb-2">
              Timezone
            </label>

            <select
              value={
                settings.timezone
              }
              onChange={(
                e
              ) =>
                setSettings({
                  ...settings,

                  timezone:
                    e.target
                      .value,
                })
              }
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 bg-white outline-none focus:border-orange-500"
            >
              <option>
                Asia/Kolkata
              </option>

              <option>
                UTC
              </option>

              <option>
                America/New_York
              </option>

            </select>

          </div>

          <div>

            <label className="block text-sm font-medium mb-2">
              Business Hours
            </label>

            <input
              value={
                settings.businessHours
              }
              onChange={(
                e
              ) =>
                setSettings({
                  ...settings,

                  businessHours:
                    e.target
                      .value,
                })
              }
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-orange-500"
            />

          </div>

        </div>

      </div>

      {/* SAVE */}

      <div className="flex justify-end">

        <button
          onClick={save}
          disabled={
            loading
          }
          className="bg-black hover:opacity-90 text-white px-6 py-3 rounded-2xl font-medium transition"
        >
          {loading
            ? "Saving..."
            : "Save Settings"}
        </button>

      </div>

    </div>
  );
}

/* =========================
   TOGGLE ROW
========================= */

function ToggleRow({
  title,
  description,
  enabled,
  onClick,
}: {
  title: string;

  description: string;

  enabled: boolean;

  onClick: () => void;
}) {
  return (
    <div className="flex items-center justify-between border border-gray-200 rounded-2xl p-4">

      <div>

        <p className="font-medium text-gray-900">
          {title}
        </p>

        <p className="text-sm text-gray-500 mt-1">
          {description}
        </p>

      </div>

      <button
        onClick={
          onClick
        }
        className={`w-14 h-7 rounded-full transition relative ${
          enabled
            ? "bg-green-500"
            : "bg-gray-300"
        }`}
      >

        <div
          className={`absolute top-1 w-5 h-5 bg-white rounded-full transition ${
            enabled
              ? "translate-x-8"
              : "translate-x-1"
          }`}
        />

      </button>

    </div>
  );
}