import Sidebar from "@/components/dashboard/Sidebar";
import { UpgradeProvider } from "@/components/UpgradeProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UpgradeProvider>
      <div className="flex">
        <Sidebar />

        <div className="flex-1 bg-gray-50 min-h-screen p-6">
          {children}
        </div>
      </div>
    </UpgradeProvider>
  );
}