export default function Topbar() {
  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      
      {/* Left */}
      <div className="text-sm font-medium">
        Dashboard
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        
        {/* Credits */}
        <div className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-medium">
          120 credits
        </div>

        {/* User */}
        <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-sm">
          S
        </div>
      </div>
    </div>
  );
}