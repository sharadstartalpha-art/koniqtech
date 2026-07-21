"use client";

import {
  Bot,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  FileText,
  MapPinned,
  MessageSquare,
  PhoneCall,
  ShieldCheck,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import clsx from "clsx";

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  badge?: string;
}

interface FeatureListProps {
  title?: string;
  subtitle?: string;
  features?: FeatureItem[];
  columns?: 1 | 2 | 3;
  className?: string;
}

const defaultFeatures: FeatureItem[] = [
  {
    id: "crm",
    title: "Lead & Customer CRM",
    description:
      "Track every lead, customer, estimate and job from one dashboard.",
    icon: Users,
  },
  {
    id: "dispatch",
    title: "Scheduling & Dispatch",
    description:
      "Assign technicians, crews and appointments in seconds.",
    icon: CalendarDays,
  },
  {
    id: "quotes",
    title: "Quotes & Invoices",
    description:
      "Create professional estimates, invoices and collect payments.",
    icon: FileText,
  },
  {
    id: "communication",
    title: "SMS & Email",
    description:
      "Keep customers updated with automated communication.",
    icon: MessageSquare,
  },
  {
    id: "mobile",
    title: "Technician Mobile App",
    description:
      "Access jobs, customers and notes directly from the field.",
    icon: PhoneCall,
    badge: "Popular",
  },
  {
    id: "ai",
    title: "AI Automation",
    description:
      "Automate repetitive tasks with AI-powered workflows.",
    icon: Bot,
    badge: "New",
  },
  {
    id: "gps",
    title: "Route Optimization",
    description:
      "Reduce travel time using intelligent route planning.",
    icon: MapPinned,
  },
  {
    id: "service",
    title: "Work Orders",
    description:
      "Track every inspection, repair and maintenance visit.",
    icon: Wrench,
  },
  {
    id: "billing",
    title: "Online Payments",
    description:
      "Accept secure payments and manage subscriptions.",
    icon: CreditCard,
  },
];

export default function FeatureList({
  title = "Everything Your Business Needs",
  subtitle = "Powerful tools designed specifically for Roofing, HVAC, Plumbing and Landscaping businesses.",
  features = defaultFeatures,
  columns = 3,
  className,
}: FeatureListProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 xl:grid-cols-3",
  };

  return (
    <section className={clsx("space-y-10", className)}>
      {/* Header */}

      <div className="space-y-3 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">
          <Zap className="h-4 w-4" />
          Powerful Features
        </div>

        <h2 className="text-3xl font-bold text-slate-900">
          {title}
        </h2>

        <p className="mx-auto max-w-3xl text-slate-600">
          {subtitle}
        </p>
      </div>

      {/* Features */}

      <div
        className={clsx(
          "grid gap-6",
          gridCols[columns]
        )}
      >
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.id}
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
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-7 w-7" />
                </div>

                {feature.badge && (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    {feature.badge}
                  </span>
                )}
              </div>

              <h3 className="text-lg font-semibold text-slate-900">
                {feature.title}
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                {feature.description}
              </p>

              <div className="mt-6 flex items-center gap-2 text-sm font-medium text-orange-600">
                <CheckCircle2 className="h-4 w-4" />
                Included in all plans
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}

      <div className="rounded-3xl border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 p-8">
        <div className="flex flex-col items-center gap-6 text-center lg:flex-row lg:text-left">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100">
            <ShieldCheck className="h-8 w-8 text-orange-600" />
          </div>

          <div className="flex-1">
            <h3 className="text-2xl font-bold text-slate-900">
              Built for Service Businesses
            </h3>

            <p className="mt-2 text-slate-600">
              KoniqTech combines CRM, dispatching, scheduling,
              invoicing, customer communication and AI into one
              easy-to-use platform.
            </p>
          </div>

          <div className="rounded-full bg-orange-600 px-5 py-2 text-sm font-semibold text-white">
            One Platform. Unlimited Growth.
          </div>
        </div>
      </div>
    </section>
  );
}