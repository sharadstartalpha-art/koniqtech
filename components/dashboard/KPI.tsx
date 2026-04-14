"use client";

export default function KPI({ title, value }: any) {
  return (
    <div className="p-6 bg-white border rounded-xl shadow-sm">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold mt-2">{value}</h2>
    </div>
  );
}