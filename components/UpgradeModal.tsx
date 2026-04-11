"use client";

export default function UpgradeModal({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[400px] space-y-4">

        <h2 className="text-xl font-bold">
          Upgrade Required 🚀
        </h2>

        <p className="text-gray-500 text-sm">
          You’ve reached your limit. Upgrade to continue.
        </p>

        <button
          onClick={onClose}
          className="w-full bg-black text-white py-2 rounded"
        >
          Close
        </button>

      </div>
    </div>
  );
}