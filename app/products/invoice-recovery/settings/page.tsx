"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import ReminderTab from "./ReminderTab";

/* =========================
   TABS
========================= */
type Tab = "reminders" | "general" | "billing";

export default function SettingsPage() {
  const [activeTab, setActiveTab] =
    useState<Tab>("reminders");

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl">

        {/* HEADER */}
        <div>
          <h1 className="text-xl font-semibold">
            Settings
          </h1>
          <p className="text-sm text-gray-500">
            Manage your product settings
          </p>
        </div>

        {/* TAB NAV */}
        <div className="flex gap-2 border-b pb-2">
          {[
            { key: "reminders", label: "Reminders" },
            { key: "general", label: "General" },
            { key: "billing", label: "Billing" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() =>
                setActiveTab(tab.key as Tab)
              }
              className={`px-3 py-1 text-sm rounded-md ${
                activeTab === tab.key
                  ? "bg-black text-white"
                  : "border"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENT */}
        <div>
          {activeTab === "reminders" && (
            <ReminderTab />
          )}

          {activeTab === "general" && (
            <div className="text-sm text-gray-500">
              General settings coming soon
            </div>
          )}

          {activeTab === "billing" && (
            <div className="text-sm text-gray-500">
              Billing settings coming soon
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
}