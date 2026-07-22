"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  Globe,
  Mail,
  ShieldCheck,
  Sparkles,
  Star,
  User,
  Wrench,
  Home,
  Trees,
  Snowflake,
} from "lucide-react";
import RegisterForm from "@/components/auth/RegisterForm";

type Industry = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
};

const industries: Industry[] = [
  {
    id: "roofing",
    title: "Roofing CRM",
    subtitle: "For Roofing Contractors",
    description:
      "Estimate, schedule, dispatch crews and manage insurance claims.",
    icon: <Home className="h-7 w-7 text-orange-500" />,
    features: [
      "Roof Measurements",
      "Insurance Claims",
      "Crew Scheduling",
    ],
  },
  {
    id: "hvac",
    title: "HVAC CRM",
    subtitle: "Heating & Cooling",
    description:
      "Service agreements, maintenance scheduling and technician dispatch.",
    icon: <Snowflake className="h-7 w-7 text-sky-500" />,
    features: [
      "Maintenance Plans",
      "Equipment History",
      "Recurring Service",
    ],
  },
  {
    id: "plumbing",
    title: "Plumbing CRM",
    subtitle: "Residential & Commercial",
    description:
      "Manage emergency jobs, invoices and technician routes.",
    icon: <Wrench className="h-7 w-7 text-green-500" />,
    features: [
      "Emergency Dispatch",
      "Job Costing",
      "Digital Invoices",
    ],
  },
  {
    id: "landscaping",
    title: "Landscaping CRM",
    subtitle: "Outdoor Services",
    description:
      "Recurring lawn care scheduling with automated reminders.",
    icon: <Trees className="h-7 w-7 text-emerald-500" />,
    features: [
      "Recurring Visits",
      "Route Optimization",
      "Season Planning",
    ],
  },
];

const stats = [
  {
    value: "10K+",
    label: "Jobs Managed",
  },
  {
    value: "99.99%",
    label: "Platform Uptime",
  },
  {
    value: "24/7",
    label: "Support",
  },
];

const features = [
  "Lead Management",
  "Job Scheduling",
  "Dispatch Board",
  "Invoices",
  "Customer Portal",
  "Mobile Technician App",
  "AI Automation",
  "Analytics Dashboard",
];

const testimonial = {
  quote:
    "KoniqTech helped us replace spreadsheets with a professional CRM. Dispatching crews is now effortless.",
  author: "Michael Anderson",
  company: "Anderson Roofing",
};

export default function RegisterPage() {
  const [selectedIndustry, setSelectedIndustry] = useState("roofing");

  const currentIndustry = useMemo(
    () =>
      industries.find((x) => x.id === selectedIndustry) ??
      industries[0],
    [selectedIndustry]
  );

  return (
    <main className="min-h-screen bg-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* LEFT PANEL */}
        <section className="relative hidden overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,.35),transparent_35%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(251,146,60,.25),transparent_30%)]" />

          <div className="relative z-10 flex w-full flex-col justify-between px-16 py-14 text-white">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <Image
                src="/logo.png"
                alt="KoniqTech"
                width={60}
                height={60}
                className="rounded-xl bg-white p-1"
              />

              <div>
                <h1 className="text-3xl font-bold">
                  KoniqTech
                </h1>

                <p className="text-slate-300">
                  Field Service CRM
                </p>
              </div>
            </div>

            {/* Hero */}
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/20 px-5 py-2 text-sm font-medium text-orange-300">
                <Sparkles className="h-4 w-4" />
                CRM Platform
              </div>

              <h2 className="mt-8 text-7xl font-black leading-tight">
                Create Your

                <span className="block text-orange-400">
                  Service
                </span>

                Business Workspace
              </h2>

              <p className="mt-8 text-xl leading-9 text-slate-300">
                Launch your CRM with scheduling,
                dispatching, estimates,
                invoicing, customer management,
                AI automation and analytics.
              </p>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-5">
                {stats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur"
                  >
                    <div className="text-3xl font-bold">
                      {item.value}
                    </div>

                    <div className="mt-2 text-sm text-slate-300">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Features */}
              <div className="mt-12 space-y-4">
                {features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="h-5 w-5 text-orange-400" />

                    <span className="text-slate-200">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial */}
            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
              <div className="mb-4 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className="h-4 w-4 fill-orange-400 text-orange-400"
                  />
                ))}
              </div>

              <p className="leading-8 text-slate-200">
                "{testimonial.quote}"
              </p>

              <div className="mt-6">
                <p className="font-semibold">
                  {testimonial.author}
                </p>

                <p className="text-sm text-slate-400">
                  {testimonial.company}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT PANEL */}
        <section className="flex items-center justify-center bg-slate-50 px-6 py-12 lg:px-10">
          <div className="w-full max-w-xl rounded-[34px] border border-slate-200 bg-white p-8 shadow-[0_25px_80px_rgba(0,0,0,.08)] lg:p-10">

            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-medium text-orange-600">
                <ShieldCheck className="h-4 w-4" />
                Secure Registration
              </div>

              <h1 className="mt-5 text-5xl font-black tracking-tight text-slate-900">
                Create Account
              </h1>

              <p className="mt-3 text-lg text-slate-500">
                Build your professional field service CRM in just a few minutes.
              </p>

              {/* Progress */}
              
            </div>

           {/* FORM */}





            {/* Registration Form */}
            <RegisterForm />
            {/* Industry Cards */}
            {/* Trust Section */}
            {/* Terms */}
            {/* OTP */}
            {/* Buttons */}
          </div>
        </section>
      </div>
    </main>
  );
}