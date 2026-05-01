"use client";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  html: string;
  date: string;
};

export default function EmailViewerModal({
  isOpen,
  onClose,
  email,
  html,
  date,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">

      <div className="bg-white w-[700px] max-h-[90vh] rounded-lg shadow-lg overflow-hidden">

        {/* HEADER */}
        <div className="border-b p-4 flex justify-between items-center">
          <div>
            <p className="font-semibold">KoniqTech</p>
            <p className="text-sm text-gray-500">
              to {email}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-sm text-gray-500"
          >
            ✕
          </button>
        </div>

        {/* META */}
        <div className="px-4 py-2 text-xs text-gray-500 border-b">
          {new Date(date).toLocaleString()}
        </div>

        {/* BODY */}
        <div className="p-5 overflow-y-auto max-h-[60vh]">
          <div
            className="prose text-sm"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>

        {/* FOOTER */}
        <div className="border-t p-3 flex justify-end">
          <button className="text-sm px-3 py-1 border rounded">
            Reply
          </button>
        </div>

      </div>
    </div>
  );
}