"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  Crown,
  Rocket,
  ShieldCheck,
  Star,
  Gift,
} from "lucide-react";

export default function RegisterPlanPage() {
  const router = useRouter();

  const choosePlan = async (
    plan: "starter" | "professional"
  ) => {
    // TODO:
    // Call /api/paypal/create-subscription
    // Redirect to PayPal approval URL

    console.log("Selected Plan:", plan);

    // Temporary
    alert(`${plan.toUpperCase()} selected`);
  };

  const startTrial = async () => {
    // TODO:
    // POST /api/subscription/start-trial
    // router.push("/dashboard");

    alert("7-Day Trial Selected");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      <div className="mx-auto max-w-7xl px-6 py-16">

        {/* Header */}

        <div className="mx-auto max-w-3xl text-center">

          <div className="mb-6 inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Registration Completed Successfully
          </div>

          <h1 className="text-5xl font-bold tracking-tight text-slate-900">
            Choose Your Plan
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Your workspace has been created successfully.
            Select a subscription plan or start a
            limited 7-day free trial.
          </p>
        </div>

        {/* Pricing */}

        <div className="mt-16 grid gap-8 lg:grid-cols-3">

          {/* Starter */}

          <div className="rounded-3xl border bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">

            <Rocket className="h-12 w-12 rounded-xl bg-orange-100 p-2 text-orange-600" />

            <h2 className="mt-6 text-3xl font-bold">
              Starter
            </h2>

            <p className="mt-2 text-slate-600">
              Perfect for small businesses.
            </p>

            <div className="mt-8 flex items-end">
              <span className="text-6xl font-bold">
                $99
              </span>

              <span className="mb-2 ml-2 text-xl text-slate-500">
                /month
              </span>
            </div>

            <button
              onClick={() => choosePlan("starter")}
              className="mt-8 w-full rounded-xl bg-orange-600 py-4 font-semibold text-white transition hover:bg-orange-700"
            >
              Continue
            </button>

            <div className="mt-8 space-y-4">

              {[
                "Up to 5 Employees",
                "Unlimited Customers",
                "Unlimited Leads",
                "Scheduling",
                "Job Management",
                "Invoices",
                "Reports",
                "Mobile App",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3"
                >
                  <Check className="h-5 w-5 text-green-600" />
                  <span>{item}</span>
                </div>
              ))}

            </div>
          </div>

          {/* Professional */}

          <div className="relative rounded-3xl border-2 border-orange-500 bg-white p-8 shadow-2xl">

            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-orange-600 px-5 py-2 text-sm font-bold text-white">
              MOST POPULAR
            </div>

            <Crown className="h-12 w-12 rounded-xl bg-orange-100 p-2 text-orange-600" />

            <h2 className="mt-6 text-3xl font-bold">
              Professional
            </h2>

            <p className="mt-2 text-slate-600">
              Best value for growing companies.
            </p>

            <div className="mt-8 flex items-end">
              <span className="text-6xl font-bold">
                $199
              </span>

              <span className="mb-2 ml-2 text-xl text-slate-500">
                /month
              </span>
            </div>

            <button
              onClick={() =>
                choosePlan("professional")
              }
              className="mt-8 w-full rounded-xl bg-orange-600 py-4 font-semibold text-white transition hover:bg-orange-700"
            >
              Subscribe Now
            </button>

            <div className="mt-8 space-y-4">

              {[
                "Everything in Starter",
                "Unlimited Employees",
                "Dispatch Center",
                "Inventory",
                "Fleet",
                "AI Assistant",
                "AI Quotes",
                "SMS Automation",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3"
                >
                  <Check className="h-5 w-5 text-green-600" />
                  <span>{item}</span>
                </div>
              ))}

            </div>
          </div>

          {/* Enterprise */}

          <div className="rounded-3xl border bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">

            <Star className="h-12 w-12 rounded-xl bg-slate-100 p-2 text-slate-700" />

            <h2 className="mt-6 text-3xl font-bold">
              Enterprise
            </h2>

            <p className="mt-2 text-slate-600">
              Large organizations with custom
              requirements.
            </p>

            <div className="mt-8 text-5xl font-bold">
              Custom
            </div>

            <Link
              href="/contact"
              className="mt-8 flex w-full items-center justify-center rounded-xl bg-slate-900 py-4 font-semibold text-white transition hover:bg-slate-800"
            >
              Contact Sales
            </Link>

            <div className="mt-8 space-y-4">

              {[
                "Everything in Professional",
                "Multiple Branches",
                "White Label",
                "Dedicated Success Manager",
                "Custom Integrations",
                "Advanced Permissions",
                "Enterprise SLA",
                "SSO",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3"
                >
                  <Check className="h-5 w-5 text-green-600" />
                  <span>{item}</span>
                </div>
              ))}

            </div>
          </div>
        </div>

        {/* Trial */}

        <div className="mx-auto mt-20 max-w-3xl rounded-3xl border border-green-200 bg-green-50 p-10 text-center">

          <Gift className="mx-auto h-14 w-14 text-green-600" />

          <h2 className="mt-5 text-3xl font-bold">
            Not Ready Yet?
          </h2>

          <p className="mt-4 text-slate-600">
            Start a limited 7-day free trial.
            No credit card required.
            Upgrade anytime.
          </p>

          <button
            onClick={startTrial}
            className="mt-8 rounded-xl bg-green-600 px-8 py-4 font-semibold text-white transition hover:bg-green-700"
          >
            Continue 7-Day Trial
          </button>
        </div>

        {/* Trust */}

        <div className="mt-16 text-center text-sm text-slate-500">
          Secure payments powered by PayPal •
          Cancel anytime • Upgrade anytime •
          No hidden fees
        </div>
      </div>
    </main>
  );
}