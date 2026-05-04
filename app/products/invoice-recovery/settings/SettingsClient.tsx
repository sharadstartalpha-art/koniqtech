"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Layout from "@/components/Layout";
import ReminderTab from "./ReminderTab";

export default function SettingsClient() {
  const router = useRouter();
  const params = useSearchParams();

  const tab = params.get("tab") || "reminders";

  const setTab = (t: string) => {
    router.push(`?tab=${t}`);
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl">

        {/* HEADER */}
        <h1 className="text-xl font-semibold">Settings</h1>

        {/* TABS */}
        <div className="flex gap-2 border-b pb-2">
          {["reminders", "general", "billing"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1 text-sm rounded-md capitalize ${
                tab === t
                  ? "bg-black text-white"
                  : "border"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        {tab === "reminders" && <ReminderTab />}

        {tab === "general" && (
          <div className="text-sm text-gray-500">
            General settings coming soon
          </div>
        )}

        {tab === "billing" && (
          <div className="text-sm text-gray-500">
            Billing coming soon
          </div>
        )}
      </div>
    </Layout>
  );
}