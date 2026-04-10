"use client";

export default function UpgradeModal({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="bg-white p-6 rounded-2xl w-[400px] shadow-xl">

        <h2 className="text-xl font-semibold">
          Upgrade your plan 🚀
        </h2>

        <p className="text-gray-500 mt-2">
          You’ve run out of credits. Upgrade to continue using the app.
        </p>

        <a
          href="/pricing"
          className="block mt-6 bg-black text-white py-2 text-center rounded-lg hover:opacity-90"
        >
          View Plans
        </a>

        <button
          onClick={onClose}
          className="mt-3 w-full text-gray-500 hover:text-black"
        >
          Cancel
        </button>

      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
  🔒 Premium features unlocked after upgrade  
  ⚡ Instant credit top-up  
  🚀 Priority processing
</div>
    </div>
  );
}