import Sidebar from "@/components/dashboard/sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50">

      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1 p-6 overflow-y-auto">
        {children}
      </div>

    </div>
  );
}