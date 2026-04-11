
import Sidebar from "@/components/dashboard/Sidebar";
import UpgradeProvider from "@/components/UpgradeProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UpgradeProvider>
      <div className="flex h-screen">

  <Sidebar />

  <div className="flex-1 flex flex-col">

    {/* TOPBAR */}
    <div className="h-14 border-b flex items-center justify-between px-6">
      <p className="font-semibold">KoniqTech 🚀</p>
    </div>

    {/* CONTENT */}
    <div className="p-6 bg-gray-50 flex-1 overflow-auto">
      {children}
    </div>

  </div>

</div>
    </UpgradeProvider>
  );
}