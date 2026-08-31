"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function WelcomeModal() {
    const [open, setOpen] = useState(true);

    if (!open) return null;

  const startSetup = async () => {
  try {
    const res = await fetch("/api/user/welcome", {
      method: "POST",
    });

    if (!res.ok) {
      throw new Error("Failed to update welcome status");
    }

    setOpen(false);

    window.location.reload();
  } catch (err) {
    console.error(err);
    alert("Unable to continue.");
  }
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

               

            </div>

        </div>
    );
}