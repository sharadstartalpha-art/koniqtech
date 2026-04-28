export function Card({ title, value }: any) {
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-2xl font-semibold">{value}</h2>
    </div>
  );
}