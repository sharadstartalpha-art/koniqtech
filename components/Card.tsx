export function Card({ title, value }: any) {
  return (
    <div className="bg-white border border-gray-200 rounded-md px-4 py-3">
      <p className="text-xs text-gray-500">{title}</p>
      <h2 className="text-lg font-semibold text-gray-900">{value}</h2>
    </div>
  );
}