"use client";

import clsx from "clsx";
import { Check } from "lucide-react";

export interface Step {
  id: number;
  title: string;
  description?: string;
}

interface StepIndicatorProps {
  currentStep: number;
  steps: Step[];
  className?: string;
}

export default function StepIndicator({
  currentStep,
  steps,
  className,
}: StepIndicatorProps) {
  return (
    <div className={clsx("w-full", className)}>
      <nav aria-label="Progress">
        <ol className="flex items-start justify-between">
          {steps.map((step, index) => {
            const completed = currentStep > step.id;
            const active = currentStep === step.id;
            const last = index === steps.length - 1;

            return (
              <li
                key={step.id}
                className={clsx(
                  "relative flex flex-1",
                  last && "flex-none"
                )}
              >
                <div className="flex w-full flex-col items-center">
                  {/* Circle */}

                  <div
                    className={clsx(
                      "z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-300",
                      completed &&
                        "border-green-600 bg-green-600 text-white",
                      active &&
                        "border-orange-500 bg-orange-500 text-white ring-4 ring-orange-100",
                      !completed &&
                        !active &&
                        "border-slate-300 bg-white text-slate-500"
                    )}
                  >
                    {completed ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      step.id
                    )}
                  </div>

                  {/* Text */}

                  <div className="mt-4 text-center">
                    <h4
                      className={clsx(
                        "text-sm font-semibold",
                        active
                          ? "text-orange-600"
                          : completed
                          ? "text-green-600"
                          : "text-slate-500"
                      )}
                    >
                      {step.title}
                    </h4>

                    {step.description && (
                      <p className="mt-1 max-w-[140px] text-xs leading-5 text-slate-500">
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Connector */}

                {!last && (
                  <div
                    className="absolute left-1/2 top-6 h-0.5 w-full -translate-y-1/2"
                    aria-hidden="true"
                  >
                    <div className="mx-8 h-full rounded-full bg-slate-200">
                      <div
                        className={clsx(
                          "h-full rounded-full transition-all duration-500",
                          completed
                            ? "w-full bg-green-600"
                            : "w-0 bg-green-600"
                        )}
                      />
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}