"use client";

import { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Trend = "up" | "down" | "neutral";

interface StatCardProps {
  title: string;

  value: string | number;

  subtitle?: string;

  icon: ReactNode;

  color?: string;

  trend?: Trend;

  trendValue?: string;

  footer?: ReactNode;

  loading?: boolean;

  className?: string;

  onClick?: () => void;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  color = "bg-blue-100 text-blue-600",
  trend = "neutral",
  trendValue,
  footer,
  loading = false,
  className,
  onClick,
}: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200",
        onClick &&
          "cursor-pointer hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg",
        className
      )}
    >
      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          {loading ? (
            <div className="mt-4 h-10 w-28 animate-pulse rounded bg-slate-200" />
          ) : (
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
              {value}
            </h2>
          )}

          {subtitle && (
            <p className="mt-2 text-sm text-slate-500">
              {subtitle}
            </p>
          )}

        </div>

        <div
          className={cn(
            "rounded-2xl p-4",
            color
          )}
        >
          {icon}
        </div>

      </div>

      {(trendValue || footer) && (
        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">

          {trendValue ? (
            <div className="flex items-center gap-2 text-sm">

              {trend === "up" && (
                <>
                  <ArrowUpRight className="h-4 w-4 text-green-600" />

                  <span className="font-semibold text-green-600">
                    {trendValue}
                  </span>
                </>
              )}

              {trend === "down" && (
                <>
                  <ArrowDownRight className="h-4 w-4 text-red-600" />

                  <span className="font-semibold text-red-600">
                    {trendValue}
                  </span>
                </>
              )}

              {trend === "neutral" && (
                <span className="font-medium text-slate-500">
                  {trendValue}
                </span>
              )}

            </div>
          ) : (
            <div />
          )}

          {footer}

        </div>
      )}
    </div>
  );
}