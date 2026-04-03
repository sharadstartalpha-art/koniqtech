"use client";

export default function UpgradeModal({ onClose }: any) {

  const upgrade = async (planId: string) => {
    const res = await fetch("/api/paypal/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ planId }),
    });

    const data = await res.json();

    const approveLink = data?.links?.find(
      (l: any) => l.rel === "approve"
    );

    if (approveLink?.href) {
      window.location.href = approveLink.href;
    } else {
      alert("Payment failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white p-6 rounded-xl w-[360px] text-center shadow-xl">

        <h2 className="text-xl font-bold mb-2">
          Upgrade Required 🚀
        </h2>

        <p className="text-red-500 text-sm mt-2">
          ⚠ You're out of credits
        </p>

        <ul className="text-sm text-gray-600 mt-4 space-y-1 text-left">
          <li>✔ Unlimited leads</li>
          <li>✔ AI scoring</li>
          <li>✔ Email automation</li>
          <li>✔ Priority processing</li>
        </ul>

        {/* 💰 CTA BUTTONS */}
        <button
          onClick={() => upgrade("PRO_PLAN_ID")}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg"
        >
          Upgrade Pro ($19)
        </button>

        <button
          onClick={() => upgrade("AGENCY_PLAN_ID")}
          className="mt-3 w-full bg-green-600 text-white py-2 rounded-lg"
        >
          Upgrade Agency ($49)
        </button>

        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-500"
        >
          Cancel
        </button>

      </div>
    </div>
  );
}