import Link from "next/link";
import { CheckCircle2, Circle } from "lucide-react";

type Step = {
  title: string;
  completed: boolean;
  href: string;
};

type Props = {
  progress: number;
  steps: Step[];
};

export default function GettingStarted({
  progress,
  steps,
}: Props) {
  return (
    <div className="bg-white border rounded-3xl p-8">
      <div className="flex justify-between items-center">

        <div>

          <h2 className="text-2xl font-semibold">
            Getting Started
          </h2>

          <p className="text-slate-500 mt-1">
            Complete these steps to setup your CRM.
          </p>

        </div>

        <div className="text-right">

          <div className="text-3xl font-bold">
            {progress}%
          </div>

          <div className="text-sm text-slate-500">
            Completed
          </div>

        </div>

      </div>

      <div className="mt-6 w-full h-3 rounded-full bg-slate-100">

        <div
          className="h-3 rounded-full bg-orange-500 transition-all"
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

      <div className="mt-8 space-y-3">

        {steps.map((step) => (

          <Link
            key={step.title}
            href={step.href}
            className="flex items-center justify-between rounded-xl border p-4 hover:bg-slate-50 transition"
          >

            <div className="flex items-center gap-3">

              {step.completed ? (
                <CheckCircle2
                  className="text-green-600"
                  size={20}
                />
              ) : (
                <Circle
                  className="text-slate-400"
                  size={20}
                />
              )}

              <span>{step.title}</span>

            </div>

          </Link>

        ))}

      </div>
    </div>
  );
}