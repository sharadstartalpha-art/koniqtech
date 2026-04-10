"use client";

export default function UsageMeter({
  used,
  total,
}: {
  used: number;
  total: number;
}) {
  const percent = Math.min((used / total) * 100, 100);

  return (
    <div className="bg-white p-5 rounded-xl border">

      <div className="flex justify-between text-sm text-gray-500">
        <span>Usage</span>
        <span>{used} / {total}</span>
      </div>

      <div className="w-full bg-gray-200 h-2 rounded mt-2">
        <div
          className="bg-black h-2 rounded"
          style={{ width: `${percent}%` }}
        />
      </div>

      {percent > 80 && (
        <p className="text-xs text-red-500 mt-2">
          You're close to your limit ⚠️
        </p>
      )}
    </div>
  );
}