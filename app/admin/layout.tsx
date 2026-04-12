import AdminSidebar from "@/components/AdminSidebar";
import Navbar from "@/components/Navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>

      {/* TOP NAVBAR */}
      <Navbar />

      <div className="flex">

        {/* SIDEBAR */}
        <AdminSidebar />

        {/* CONTENT */}
        <div className="flex-1 p-6">
          {children}
        </div>

      </div>
    </div>
  );
}