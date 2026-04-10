"use client";

import Link from "next/link";

export default function LockedFeature() {
  return (
    <div className="relative bg-white border rounded-xl p-6">

      {/* blur */}
      <div className="absolute inset-0 backdrop-blur-sm bg-white/60 flex items-center justify-center rounded-xl">

        <div className="text-center">
          <p className="font-semibold">
            Upgrade to unlock 🚀
          </p>

          <Link
            href="/pricing"
            className="mt-3 inline-block bg-black text-white px-4 py-2 rounded-lg"
          >
            Upgrade
          </Link>
        </div>

      </div>

      {/* fake content */}
      <div className="opacity-40">
        <h2 className="text-xl font-semibold">Premium Feature</h2>
        <p className="text-gray-500 mt-2">
          Advanced analytics & exports
        </p>
      </div>

    </div>
  );
}