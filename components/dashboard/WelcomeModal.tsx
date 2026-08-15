"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function WelcomeModal() {
    const [open, setOpen] = useState(true);

    if (!open) return null;

    const startSetup = async () => {
  await fetch("/api/user/welcome", {
    method: "POST",
  });

  setOpen(false);
};
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

            <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg p-8">

                <div className="flex justify-between">

                    <h2 className="text-3xl font-bold">
                        Welcome to Koniqtech 👋
                    </h2>

                    <button
  onClick={startSetup}
  className="mt-8 w-full rounded-xl bg-orange-500 py-3 text-white"
>
  Start Setup
</button>

                </div>

                <p className="mt-4 text-slate-500">
                    We'll guide you through setting up your CRM.
                </p>

                <div className="mt-8 space-y-3">

                    <div>✔ Company Information</div>
                    <div>✔ Organization</div>
                    <div>✔ Branding</div>
                    <div>✔ Team</div>
                    <div>✔ First Lead</div>
                    <div>✔ First Customer</div>
                    <div>✔ First Job</div>
                    <div>✔ First Invoice</div>

                </div>

                <button
                    onClick={() => setOpen(false)}
                    className="mt-8 w-full rounded-xl bg-orange-500 py-3 text-white hover:bg-orange-600"
                >
                    Start Setup
                </button>

            </div>

        </div>
    );
}