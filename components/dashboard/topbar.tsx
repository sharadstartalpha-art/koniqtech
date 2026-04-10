export default function Topbar() {
  return (
    <div className="h-14 bg-white border-b flex items-center justify-between px-6">
      <div className="text-sm text-gray-500">
        Welcome back 👋
      </div>

      <div className="flex items-center gap-4">
        <div className="bg-black text-white px-3 py-1 rounded-md text-sm">
          120 credits
        </div>

        <div className="w-8 h-8 bg-gray-300 rounded-full" />
      </div>
    </div>
  );
}