"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Flame,
  Hammer,
  ShieldCheck,
  Star,
  Trees,
  Users,
  Zap,
} from "lucide-react";

type Industry = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
};

const industries: Industry[] = [
  {
    id: "roofing",
    title: "Roofing CRM",
    subtitle: "Built for Roofing Contractors",
    description:
      "Manage leads, estimates, crews, insurance claims and projects from one platform.",
    icon: Building2,
    gradient: "from-orange-500 to-red-500",
  },
  {
    id: "hvac",
    title: "HVAC CRM",
    subtitle: "Complete HVAC Business Platform",
    description:
      "Schedule technicians, maintenance contracts, dispatching and recurring service.",
    icon: Flame,
    gradient: "from-sky-500 to-cyan-500",
  },
  {
    id: "plumbing",
    title: "Plumbing CRM",
    subtitle: "Grow Your Plumbing Company",
    description:
      "Track service calls, emergency jobs, invoices and customer history.",
    icon: Hammer,
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    id: "landscaping",
    title: "Landscaping CRM",
    subtitle: "Recurring Maintenance Simplified",
    description:
      "Manage crews, recurring visits, routes, equipment and billing.",
    icon: Trees,
    gradient: "from-green-500 to-emerald-500",
  },
];

const stats = [
  {
    icon: Users,
    value: "10K+",
    label: "Businesses",
  },
  {
    icon: CheckCircle2,
    value: "99.9%",
    label: "Uptime",
  },
  {
    icon: Zap,
    value: "<2 min",
    label: "Setup",
  },
];

const features = [
  "Lead Management",
  "Scheduling & Dispatch",
  "Invoices & Estimates",
  "Customer Portal",
  "Technician Mobile App",
  "AI Automation",
];

export default function HeroSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((value) => (value + 1) % industries.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const industry = useMemo(
    () => industries[index],
    [index]
  );

  const Icon = industry.icon;

  return (
    <section className="relative hidden overflow-hidden bg-slate-950 lg:flex lg:w-1/2">
      {/* Background */}

      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />

      <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="relative z-10 flex min-h-screen w-full flex-col justify-between p-12 text-white">
        {/* Top */}

        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">
            <ShieldCheck className="h-5 w-5 text-green-400" />
            <span className="text-sm font-medium">
              Trusted by Service Businesses
            </span>
          </div>

          <div className="space-y-6">
            <div
              className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${industry.gradient}`}
            >
              <Icon className="h-8 w-8 text-white" />
            </div>

            <div>
              <h1 className="text-5xl font-bold leading-tight">
                Grow Your
                <br />
                <span className="bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
                  {industry.title}
                </span>
              </h1>

              <p className="mt-6 text-xl text-slate-300">
                {industry.subtitle}
              </p>

              <p className="mt-4 max-w-xl leading-8 text-slate-400">
                {industry.description}
              </p>
            </div>

            <div className="grid gap-3">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="h-5 w-5 text-green-400" />

                  <span className="text-slate-200">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}

        <div className="space-y-8">
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat) => {
              const StatIcon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
                >
                  <StatIcon className="mb-3 h-6 w-6 text-orange-400" />

                  <div className="text-2xl font-bold">
                    {stat.value}
                  </div>

                  <div className="text-sm text-slate-400">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Testimonial */}

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="mb-4 flex text-yellow-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5 fill-current"
                />
              ))}
            </div>

            <p className="leading-7 text-slate-300">
              “KoniqTech helped us replace three different
              software tools with one platform. Our team now
              manages leads, jobs and invoices from anywhere.”
            </p>

            <div className="mt-5 flex items-center justify-between">
              <div>
                <div className="font-semibold">
                  Michael Johnson
                </div>

                <div className="text-sm text-slate-400">
                  Roofing Company Owner
                </div>
              </div>

              <ArrowRight className="h-5 w-5 text-orange-400" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}