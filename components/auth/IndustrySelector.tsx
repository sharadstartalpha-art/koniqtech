"use client";

import {
  Building2,
  Flame,
  Hammer,
  Trees,
  Check,
} from "lucide-react";

import clsx from "clsx";

export type IndustryType =
  | "roofing"
  | "hvac"
  | "plumbing"
  | "landscaping";

interface Industry {
  id: IndustryType;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const industries: Industry[] = [
  {
    id: "roofing",
    title: "Roofing",
    description:
      "Roof inspections, estimates, crews & insurance jobs.",
    icon: Building2,
    color:
      "from-orange-500 to-red-500",
  },
  {
    id: "hvac",
    title: "HVAC",
    description:
      "Installations, maintenance contracts & dispatch.",
    icon: Flame,
    color:
      "from-sky-500 to-cyan-500",
  },
  {
    id: "plumbing",
    title: "Plumbing",
    description:
      "Service calls, emergency repairs & estimates.",
    icon: Hammer,
    color:
      "from-blue-500 to-indigo-500",
  },
  {
    id: "landscaping",
    title: "Landscaping",
    description:
      "Recurring maintenance, crews & scheduling.",
    icon: Trees,
    color:
      "from-green-500 to-emerald-500",
  },
];

interface Props {
  value?: IndustryType;

  onChange: (
    value: IndustryType
  ) => void;

  disabled?: boolean;
}

export default function IndustrySelector({
  value,
  onChange,
  disabled = false,
}: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {industries.map((industry) => {
        const Icon = industry.icon;

        const active =
          value === industry.id;

        return (
          <button
            key={industry.id}
            type="button"
            disabled={disabled}
            onClick={() =>
              onChange(industry.id)
            }
            className={clsx(
              "relative overflow-hidden rounded-2xl border bg-white p-5 text-left transition-all duration-200",
              "hover:-translate-y-1 hover:shadow-lg",
              disabled &&
                "cursor-not-allowed opacity-60",

              active
                ? "border-orange-500 ring-2 ring-orange-200 shadow-lg"
                : "border-slate-200 hover:border-orange-300"
            )}
          >
            {/* Icon */}

            <div
              className={clsx(
                "mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white",
                industry.color
              )}
            >
              <Icon className="h-6 w-6" />
            </div>

            {/* Title */}

            <h3 className="text-lg font-semibold text-slate-900">
              {industry.title}
            </h3>

            {/* Description */}

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {industry.description}
            </p>

            {/* Selected */}

            {active && (
              <div className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-white">
                <Check className="h-4 w-4" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}