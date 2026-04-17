import Sidebar from "@/components/dashboard/Sidebar";
import UpgradeProvider from "@/components/UpgradeProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UpgradeProvider>
      <div className="flex min-h-screen bg-gray-50">

        {/* SIDEBAR */}
        <Sidebar />

        {/* MAIN */}
        <div className="flex-1 flex flex-col">

          {/* TOPBAR */}
          <div className="h-14 border-b bg-white flex items-center justify-between px-6 shadow-sm">
            <p className="font-semibold text-gray-800">KoniqTech 🚀</p>
          </div>

          {/* CONTENT */}
          <div className="flex-1 p-6 overflow-auto">
            {children}
          </div>

        </div>
      </div>
    </UpgradeProvider>
  );
}