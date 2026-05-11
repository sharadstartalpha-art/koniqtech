"use client";

import Layout from "@/components/Layout";

import {
  Crown,
  CheckCircle2,
} from "lucide-react";

export default function UpgradePage() {

  return (
    <Layout>

      <div className="min-h-screen bg-gray-50 px-6 py-10">

        <div className="max-w-4xl mx-auto">

          <div className="bg-gradient-to-r from-black via-zinc-900 to-black rounded-[32px] p-10 text-white overflow-hidden">

            <div className="max-w-2xl">

              <div className="w-16 h-16 rounded-3xl bg-orange-500/20 flex items-center justify-center mb-6">

                <Crown className="w-8 h-8 text-orange-400" />

              </div>

              <h1 className="text-5xl font-bold leading-tight">
                Upgrade to Pro
              </h1>

              <p className="text-zinc-300 mt-5 text-lg leading-8">
                Unlock advanced recovery automation, analytics, AI reminders, WhatsApp delivery, and unlimited invoices.
              </p>

              <div className="mt-8 space-y-4">

                <Feature text="Unlimited invoices" />

                <Feature text="AI-powered recovery flows" />

                <Feature text="WhatsApp & SMS reminders" />

                <Feature text="Advanced analytics dashboard" />

                <Feature text="Priority support" />

              </div>

              <div className="mt-10 flex items-center gap-4">

                <a
                  href="/products/invoice-recovery/upgrade"
                  className="h-14 px-8 rounded-2xl bg-white text-black font-semibold flex items-center justify-center"
                >
                  Upgrade Now
                </a>

                <a
                  href="/products/invoice-recovery/onboarding"
                  className="text-sm text-zinc-400"
                >
                  Maybe later
                </a>

              </div>

            </div>

          </div>

        </div>

      </div>

    </Layout>
  );
}

function Feature({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-center gap-3">

      <CheckCircle2 className="w-5 h-5 text-green-400" />

      <p className="text-zinc-200">
        {text}
      </p>

    </div>
  );
}