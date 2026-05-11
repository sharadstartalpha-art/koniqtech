"use client";

import { useRouter, useSearchParams } from "next/navigation";

import Layout from "@/components/Layout";

import ReminderTab from "./ReminderTab";

import {
  Bell,
  Settings,
  CreditCard,
  ShieldCheck,
  Sparkles,
  ChevronRight,
} from "lucide-react";

export default function SettingsClient() {

  const router =
    useRouter();

  const params =
    useSearchParams();

  const tab =
    params.get("tab") ||
    "reminders";

  /* =========================================
     CHANGE TAB
  ========================================= */

  const setTab = (
    value: string
  ) => {
    router.push(
      `?tab=${value}`
    );
  };

  /* =========================================
     TABS
  ========================================= */

  const tabs = [
    {
      id: "reminders",
      label:
        "Reminder Settings",
      icon: Bell,
      desc:
        "Templates, automation & delivery",
    },

    {
      id: "general",
      label:
        "General",
      icon: Settings,
      desc:
        "Workspace preferences",
    },

    {
      id: "billing",
      label:
        "Billing",
      icon: CreditCard,
      desc:
        "Plans & subscription",
    },
  ];

  return (
    <Layout>

      <div className="space-y-8">

        {/* =========================================
           HERO
        ========================================= */}

        <div className="
          rounded-[30px]
          overflow-hidden
          bg-gradient-to-r
          from-black
          via-zinc-950
          to-slate-900
          text-white
          p-8
          border border-zinc-800
        ">

          <div className="
            flex flex-col lg:flex-row
            lg:items-center
            lg:justify-between
            gap-6
          ">

            <div className="max-w-2xl">

              <div className="
                inline-flex
                items-center
                gap-2
                px-3 py-1
                rounded-full
                bg-white/10
                text-xs
                mb-5
                border border-white/10
              ">

                <Sparkles size={14} />

                Settings Center

              </div>

              <h1 className="
                text-4xl
                font-bold
                leading-tight
              ">
                Manage your workspace settings
              </h1>

              <p className="
                text-zinc-300
                mt-4
                text-[15px]
                leading-7
              ">
                Configure reminder automation,
                billing preferences, security,
                and recovery workflows.
              </p>

            </div>

            {/* QUICK STATUS */}

            <div className="
              grid grid-cols-1 md:grid-cols-3
              gap-4 min-w-[320px]
            ">

              <HeroCard
                title="Automation"
                value="Active"
                icon={Bell}
              />

              <HeroCard
                title="Security"
                value="Protected"
                icon={ShieldCheck}
              />

              <HeroCard
                title="Billing"
                value="Connected"
                icon={CreditCard}
              />

            </div>

          </div>

        </div>

        {/* =========================================
           SETTINGS LAYOUT
        ========================================= */}

        <div className="
          grid grid-cols-1
          xl:grid-cols-4
          gap-6
        ">

          {/* =========================================
             SIDEBAR
          ========================================= */}

          <div className="
            bg-white
            border border-zinc-200
            rounded-3xl
            p-4
            h-fit
          ">

            <div className="space-y-2">

              {tabs.map((item) => {

                const active =
                  tab === item.id;

                const Icon =
                  item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() =>
                      setTab(
                        item.id
                      )
                    }
                    className={`
                      w-full
                      flex items-center justify-between
                      rounded-2xl
                      px-4 py-4
                      transition-all
                      text-left
                      ${
                        active
                          ? "bg-black text-white"
                          : "hover:bg-zinc-100 text-zinc-700"
                      }
                    `}
                  >

                    <div className="
                      flex items-center gap-3
                    ">

                      <div
                        className={`
                          w-10 h-10
                          rounded-xl
                          flex items-center justify-center
                          ${
                            active
                              ? "bg-white/10"
                              : "bg-zinc-100"
                          }
                        `}
                      >

                        <Icon size={18} />

                      </div>

                      <div>

                        <p className="
                          font-semibold
                          text-sm
                        ">
                          {item.label}
                        </p>

                        <p
                          className={`
                            text-xs mt-1
                            ${
                              active
                                ? "text-zinc-300"
                                : "text-zinc-500"
                            }
                          `}
                        >
                          {item.desc}
                        </p>

                      </div>

                    </div>

                    {active && (
                      <ChevronRight
                        size={16}
                      />
                    )}

                  </button>
                );
              })}

            </div>

          </div>

          {/* =========================================
             CONTENT
          ========================================= */}

          <div className="
            xl:col-span-3
            bg-white
            border border-zinc-200
            rounded-3xl
            overflow-hidden
          ">

            {/* HEADER */}

            <div className="
              border-b border-zinc-100
              px-8 py-6
            ">

              <h2 className="
                text-2xl
                font-bold
              ">

                {tab ===
                "reminders"
                  ? "Reminder Settings"
                  : tab ===
                    "general"
                  ? "General Settings"
                  : "Billing Settings"}

              </h2>

              <p className="
                text-sm text-zinc-500
                mt-1
              ">

                {tab ===
                "reminders"
                  ? "Configure reminders, templates and automation flows"
                  : tab ===
                    "general"
                  ? "Manage workspace and application preferences"
                  : "Manage plans, invoices and subscriptions"}

              </p>

            </div>

            {/* BODY */}

            <div className="p-8">

              {/* REMINDERS */}

              {tab ===
                "reminders" && (
                <ReminderTab />
              )}

              {/* GENERAL */}

              {tab ===
                "general" && (
                <div className="
                  rounded-3xl
                  border border-zinc-200
                  p-8
                  text-center
                ">

                  <div className="
                    w-16 h-16
                    rounded-2xl
                    bg-zinc-100
                    mx-auto
                    flex items-center justify-center
                  ">

                    <Settings
                      size={28}
                    />

                  </div>

                  <h3 className="
                    text-xl
                    font-semibold
                    mt-5
                  ">
                    General Settings
                  </h3>

                  <p className="
                    text-zinc-500
                    mt-2
                    max-w-md
                    mx-auto
                    leading-7
                  ">
                    Workspace branding,
                    timezone preferences,
                    notification controls,
                    and more settings
                    will appear here.
                  </p>

                </div>
              )}

              {/* BILLING */}

              {tab ===
                "billing" && (
                <div className="
                  rounded-3xl
                  border border-zinc-200
                  p-8
                  text-center
                ">

                  <div className="
                    w-16 h-16
                    rounded-2xl
                    bg-zinc-100
                    mx-auto
                    flex items-center justify-center
                  ">

                    <CreditCard
                      size={28}
                    />

                  </div>

                  <h3 className="
                    text-xl
                    font-semibold
                    mt-5
                  ">
                    Billing & Plans
                  </h3>

                  <p className="
                    text-zinc-500
                    mt-2
                    max-w-md
                    mx-auto
                    leading-7
                  ">
                    Subscription management,
                    invoice billing,
                    payment methods,
                    and plan upgrades
                    will appear here.
                  </p>

                  <a
                    href="/products/invoice-recovery/account"
                    className="
                      inline-flex
                      items-center gap-2
                      mt-6
                      bg-black
                      text-white
                      px-5 py-3
                      rounded-2xl
                      font-medium
                      hover:bg-zinc-900
                      transition
                    "
                  >

                    Open Billing

                    <ChevronRight
                      size={16}
                    />

                  </a>

                </div>
              )}

            </div>

          </div>

        </div>

      </div>

    </Layout>
  );
}

/* =========================================
   HERO CARD
========================================= */

function HeroCard({
  title,
  value,
  icon: Icon,
}: any) {
  return (
    <div className="
      bg-white/5
      backdrop-blur
      border border-white/10
      rounded-2xl
      p-5
    ">

      <div className="
        flex items-center justify-between
      ">

        <div>

          <p className="
            text-zinc-400
            text-sm
          ">
            {title}
          </p>

          <h3 className="
            text-2xl
            font-bold
            mt-2
          ">
            {value}
          </h3>

        </div>

        <div className="
          w-11 h-11
          rounded-xl
          bg-white/10
          flex items-center justify-center
        ">

          <Icon size={18} />

        </div>

      </div>

    </div>
  );
}