"use client";

import {
  Activity,
  CheckCircle2,
  Clock3,
  Globe2,
  ShieldCheck,
  Users,
} from "lucide-react";
import clsx from "clsx";

export interface StatItem {
  id: string;
  value: string;
  label: string;
  description?: string;
  icon?: React.ElementType;
}

interface StatsSectionProps {
  title?: string;
  subtitle?: string;
  stats?: StatItem[];
  columns?: 2 | 3 | 4 | 5 | 6;
  className?: string;
}

const defaultStats: StatItem[] = [
  {
    id: "customers",
    value: "10K+",
    label: "Businesses",
    description: "Service companies using KoniqTech",
    icon: Users,
  },
  {
    id: "uptime",
    value: "99.9%",
    label: "Platform Uptime",
    description: "Reliable cloud infrastructure",
    icon: ShieldCheck,
  },
  {
    id: "setup",
    value: "<2 min",
    label: "Average Setup",
    description: "Start using your CRM quickly",
    icon: Clock3,
  },
  {
    id: "countries",
    value: "25+",
    label: "Countries",
    description: "Customers worldwide",
    icon: Globe2,
  },
];

export default function StatsSection({
  title = "Trusted by Growing Service Businesses",
  subtitle = "Everything you need to manage customers, jobs, teams and revenue from one modern platform.",
  stats = defaultStats,
  columns = 4,
  className,
}: StatsSectionProps) {
  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-2 xl:grid-cols-4",
    5: "md:grid-cols-3 xl:grid-cols-5",
    6: "md:grid-cols-3 xl:grid-cols-6",
  };

  return (
    <section className={clsx("space-y-10", className)}>
      <div className="space-y-3 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          {title}
        </h2>

        <p className="mx-auto max-w-2xl text-slate-600">
          {subtitle}
        </p>
      </div>

      <div
        className={clsx(
          "grid gap-6",
          gridCols[columns]
        )}
      >
        {stats.map((stat) => {
          const Icon = stat.icon ?? Activity;

          return (
            <div
              key={stat.id}
              className="
                group
                rounded-3xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-orange-300
                hover:shadow-xl
              "
            >
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 transition group-hover:scale-110">
                <Icon className="h-7 w-7" />
              </div>

              <div className="space-y-2">
                <h3 className="text-4xl font-extrabold text-slate-900">
                  {stat.value}
                </h3>

                <p className="font-semibold text-slate-800">
                  {stat.label}
                </p>

                {stat.description && (
                  <p className="text-sm leading-6 text-slate-500">
                    {stat.description}
                  </p>
                )}
              </div>

              <div className="mt-6 flex items-center gap-2 text-sm font-medium text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                Verified Platform Metric
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}