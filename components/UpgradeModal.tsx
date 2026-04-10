"use client";

type Props = {
  onClose: () => void;
};

export default function UpgradeModal({ onClose }: Props) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-6 rounded-xl w-[400px]"
      >
        <h2 className="text-xl font-semibold mb-2">
          Upgrade Required 🚀
        </h2>

        <p className="text-gray-500 text-sm mb-4">
          You’ve run out of credits. Upgrade your plan to continue.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border py-2 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={() => (window.location.href = "/pricing")}
            className="flex-1 bg-black text-white py-2 rounded-lg"
          >
            Upgrade
          </button>
        </div>
      </div>
    </div>
  );
}