
"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-xl bg-orange-600 px-6 py-3 font-medium text-white hover:bg-orange-700"
    >
      Download / Print PDF
    </button>
  );
}
