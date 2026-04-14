"use client";

export default function Modal({
  open,
  onClose,
  children,
}: any) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-3 top-2 text-gray-500"
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
}