"use client";

import {
  CheckCircle2,
  Circle,
} from "lucide-react";

interface PasswordStrengthProps {
  password: string;
}

interface Requirement {
  label: string;
  passed: boolean;
}

export default function PasswordStrength({
  password,
}: PasswordStrengthProps) {
  const requirements: Requirement[] = [
    {
      label: "At least 8 characters",
      passed: password.length >= 8,
    },
    {
      label: "One uppercase letter",
      passed: /[A-Z]/.test(password),
    },
    {
      label: "One lowercase letter",
      passed: /[a-z]/.test(password),
    },
    {
      label: "One number",
      passed: /\d/.test(password),
    },
    {
      label: "One special character",
      passed: /[^A-Za-z0-9]/.test(password),
    },
  ];

  const score = requirements.filter(
    (item) => item.passed
  ).length;

  const percentage = (score / requirements.length) * 100;

  const strength = (() => {
    if (score <= 1) {
      return {
        label: "Very Weak",
        color: "bg-red-500",
        text: "text-red-600",
      };
    }

    if (score === 2) {
      return {
        label: "Weak",
        color: "bg-orange-500",
        text: "text-orange-600",
      };
    }

    if (score === 3) {
      return {
        label: "Good",
        color: "bg-yellow-500",
        text: "text-yellow-600",
      };
    }

    if (score === 4) {
      return {
        label: "Strong",
        color: "bg-lime-500",
        text: "text-lime-600",
      };
    }

    return {
      label: "Excellent",
      color: "bg-green-600",
      text: "text-green-700",
    };
  })();

  if (!password) {
    return null;
  }

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      {/* Header */}

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">
          Password Strength
        </span>

        <span
          className={`text-sm font-semibold ${strength.text}`}
        >
          {strength.label}
        </span>
      </div>

      {/* Progress */}

      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      {/* Requirements */}

      <div className="space-y-2">
        {requirements.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2 text-sm"
          >
            {item.passed ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <Circle className="h-4 w-4 text-slate-300" />
            )}

            <span
              className={
                item.passed
                  ? "text-slate-700"
                  : "text-slate-400"
              }
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}