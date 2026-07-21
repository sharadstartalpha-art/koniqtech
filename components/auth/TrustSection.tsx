"use client";

import {
  BadgeCheck,
  Clock3,
  CreditCard,
  Headphones,
  Lock,
  Server,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import clsx from "clsx";

export interface TrustItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

interface TrustSectionProps {
  title?: string;
  subtitle?: string;
  items?: TrustItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

const defaultItems: TrustItem[] = [
  {
    id: "security",
    title: "Enterprise Security",
    description:
      "SSL encryption, secure authentication and industry best practices.",
    icon: ShieldCheck,
  },
  {
    id: "cloud",
    title: "Cloud Hosted",
    description:
      "Reliable cloud infrastructure with automatic backups and monitoring.",
    icon: Server,
  },
  {
    id: "support",
    title: "Priority Support",
    description:
      "Friendly support team available whenever you need assistance.",
    icon: Headphones,
  },
  {
    id: "payments",
    title: "Secure Payments",
    description:
      "Encrypted checkout with trusted payment providers.",
    icon: CreditCard,
  },
  {
    id: "uptime",
    title: "99.9% Uptime",
    description:
      "Highly available platform built for growing businesses.",
    icon: Clock3,
  },
  {
    id: "compliance",
    title: "Trusted Platform",
    description:
      "Designed with security, privacy and reliability in mind.",
    icon: BadgeCheck,
  },
];

export default function TrustSection({
  title = "Why Businesses Trust KoniqTech",
  subtitle = "Everything is built with security, reliability and simplicity so you can focus on growing your business.",
  items = defaultItems,
  columns = 3,
  className,
}: TrustSectionProps) {
  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 xl:grid-cols-3",
    4: "md:grid-cols-2 xl:grid-cols-4",
  };

  return (
    <section className={clsx("space-y-10", className)}>
      <div className="space-y-3 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">
          <Lock className="h-4 w-4" />
          Trusted Platform
        </div>

        <h2 className="text-3xl font-bold text-slate-900">
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
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.id}
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
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 transition-transform duration-300 group-hover:scale-110">
                <Icon className="h-7 w-7" />
              </div>

              <h3 className="text-lg font-semibold text-slate-900">
                {item.title}
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="rounded-3xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-6">
        <div className="flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100">
            <Sparkles className="h-8 w-8 text-green-600" />
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-900">
              Start Your Free Trial Today
            </h3>

            <p className="mt-2 text-slate-600">
              No long-term contracts. Set up your workspace in minutes and see
              how KoniqTech can streamline your operations.
            </p>
          </div>

          <div className="rounded-full bg-green-600 px-5 py-2 text-sm font-semibold text-white">
            No Credit Card Required*
          </div>
        </div>

        <p className="mt-3 text-xs text-slate-500">
          *Update this message if your signup flow requires payment information
          before the trial begins.
        </p>
      </div>
    </section>
  );
}