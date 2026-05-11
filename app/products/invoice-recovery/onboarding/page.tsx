// app/products/invoice-recovery/onboarding/page.tsx

"use client";

import { useEffect, useState } from "react";

import axios from "axios";

import Layout from "@/components/Layout";

import {
  CheckCircle2,
  ArrowRight,
  Mail,
  FileText,
  Workflow,
  Send,
  Crown,
  Sparkles,
} from "lucide-react";

type ProgressType = {
  percentage: number;

  completed?: boolean;

  steps: {
    connectedEmail: boolean;

    createdInvoice: boolean;

    setupWorkflow: boolean;

    sentReminder: boolean;

    upgradedPlan: boolean;
  };
};

export default function OnboardingPage() {

  const [progress, setProgress] =
    useState<ProgressType | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  /* =========================================
     LOAD
  ========================================= */

  const load =
    async () => {

      try {

        const res =
          await axios.get(
            "/api/onboarding/progress"
          );

        setProgress(
          res.data
        );

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {
    load();
  }, []);

  /* =========================================
     STEPS
  ========================================= */

  const steps = [
    {
      title:
        "Connect business email",

      description:
        "Setup your sending email for automated reminders.",

      icon: Mail,

      href:
        "/products/invoice-recovery/onboarding/connect-email",

      completed:
        progress?.steps
          .connectedEmail,
    },

    {
      title:
        "Create first invoice",

      description:
        "Create your first unpaid invoice.",

      icon: FileText,

      href:
        "/products/invoice-recovery/onboarding/create-invoice",

      completed:
        progress?.steps
          .createdInvoice,
    },

    {
      title:
        "Setup recovery workflow",

      description:
        "Configure automated reminder sequences.",

      icon: Workflow,

      href:
        "/products/invoice-recovery/onboarding/setup-workflow",

      completed:
        progress?.steps
          .setupWorkflow,
    },

    {
      title:
        "Send first reminder",

      description:
        "Send your first reminder email.",

      icon: Send,

      href:
        "/products/invoice-recovery/onboarding/send-reminder",

      completed:
        progress?.steps
          .sentReminder,
    },

    {
      title:
        "Upgrade to Pro",

      description:
        "Unlock AI recovery, WhatsApp and analytics.",

      icon: Crown,

      href:
        "/products/invoice-recovery/onboarding/upgrade",

      completed:
        progress?.steps
          .upgradedPlan,
    },
  ];

  return (
    <Layout>

      <div className="min-h-screen bg-gray-50 px-6 py-10">

        <div className="max-w-6xl mx-auto">

          {/* =========================================
              HERO
          ========================================= */}

          <div className="rounded-[32px] overflow-hidden bg-gradient-to-r from-black via-zinc-900 to-black text-white p-10 border border-zinc-800">

            <div className="flex items-start justify-between flex-wrap gap-8">

              <div className="max-w-2xl">

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm mb-6">

                  <Sparkles size={16} />

                  Quick Setup

                </div>

                <h1 className="text-5xl font-bold leading-tight">

                  Launch your recovery system

                </h1>

                <p className="text-zinc-300 text-lg mt-5 leading-8">

                  Complete onboarding to activate automated invoice recovery, reminders, analytics, and AI workflows.

                </p>

              </div>

              {/* PROGRESS */}

              <div className="min-w-[280px] bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">

                <div className="flex items-center justify-between mb-3">

                  <p className="text-sm text-zinc-400">
                    Completion
                  </p>

                  <p className="text-sm font-semibold">
                    {progress?.percentage || 0}%
                  </p>

                </div>

                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-orange-500 rounded-full transition-all"
                    style={{
                      width: `${progress?.percentage || 0}%`,
                    }}
                  />

                </div>

                <p className="text-sm text-zinc-400 mt-4 leading-6">

                  Finish onboarding to unlock the complete recovery automation engine.

                </p>

              </div>

            </div>

          </div>

          {/* =========================================
              LOADING
          ========================================= */}

          {loading && (
            <div className="py-20 text-center text-gray-500">
              Loading onboarding...
            </div>
          )}

          {/* =========================================
              STEPS
          ========================================= */}

          {!loading && (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

              {steps.map(
                (
                  step,
                  index
                ) => {

                  const Icon =
                    step.icon;

                  return (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 rounded-3xl p-7 hover:shadow-md transition"
                    >

                      <div className="flex items-start justify-between">

                        <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center">

                          <Icon className="w-7 h-7 text-orange-600" />

                        </div>

                        {step.completed && (

                          <div className="flex items-center gap-2 text-green-600 text-sm font-medium">

                            <CheckCircle2 className="w-5 h-5" />

                            Completed

                          </div>
                        )}

                      </div>

                      <div className="mt-6">

                        <h2 className="text-2xl font-bold text-gray-900">

                          {step.title}

                        </h2>

                        <p className="text-gray-500 mt-3 leading-7">

                          {step.description}

                        </p>

                      </div>

                      <a
                        href={step.href}
                        className={`mt-8 h-12 px-5 rounded-2xl inline-flex items-center gap-2 font-semibold transition ${
                          step.completed
                            ? "bg-green-100 text-green-700"
                            : "bg-black text-white hover:bg-zinc-800"
                        }`}
                      >

                        {step.completed
                          ? "Completed"
                          : "Continue"}

                        {!step.completed && (
                          <ArrowRight className="w-4 h-4" />
                        )}

                      </a>

                    </div>
                  );
                }
              )}

            </div>
          )}

          {/* =========================================
              COMPLETE STATE
          ========================================= */}

          {progress?.completed && (

            <div className="mt-10 rounded-3xl border border-green-200 bg-green-50 p-8">

              <div className="flex items-center gap-4">

                <div className="w-16 h-16 rounded-3xl bg-green-100 flex items-center justify-center">

                  <CheckCircle2 className="w-8 h-8 text-green-600" />

                </div>

                <div>

                  <h2 className="text-3xl font-bold text-gray-900">

                    Onboarding completed 🎉

                  </h2>

                  <p className="text-gray-600 mt-2">

                    Your invoice recovery system is fully active and ready to automate collections.

                  </p>

                </div>

              </div>

            </div>
          )}

        </div>

      </div>

    </Layout>
  );
}