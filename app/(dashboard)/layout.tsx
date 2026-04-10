import Sidebar from "@/components/dashboard/sidebar";
import { ReactNode } from "react";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#f8fafc]">

      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1 flex flex-col">

        {/* Topbar */}
        <div className="h-14 bg-white border-b flex items-center justify-between px-6">
          <h1 className="text-sm font-medium text-gray-600">
            Dashboard
          </h1>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              Welcome back 👋
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {children}
        </div>

      </div>
    </div>
  );
}