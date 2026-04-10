"use client";

import { useState } from "react";

export default function UpgradeModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-black text-white px-4 py-2 rounded-lg"
      >
        Upgrade 🚀
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-xl w-96">

            <h2 className="text-xl font-semibold">
              Upgrade your plan
            </h2>

            <p className="text-gray-500 mt-2">
              Get more credits and unlock features
            </p>

            <a
              href="/pricing"
              className="block mt-6 bg-black text-white py-2 text-center rounded-lg"
            >
              View Plans
            </a>

            <button
              onClick={() => setOpen(false)}
              className="mt-3 w-full text-gray-500"
            >
              Cancel
            </button>

          </div>

        </div>
      )}
    </>
  );
}