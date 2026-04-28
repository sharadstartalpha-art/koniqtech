export function Card({ title, value }: any) {
  return (
    <div className="bg-white border rounded-md p-4">
      <p className="text-xs text-gray-500">{title}</p>
      <h2 className="text-xl font-semibold">{value}</h2>
    </div>
  );
}