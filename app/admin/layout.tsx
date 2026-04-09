import Link from "next/link";

export default function AdminLayout({ children }: any) {
  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}
      <div className="w-64 bg-black text-white p-6">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

        <nav className="space-y-3">
          <Link href="/admin">Dashboard</Link><br />
          <Link href="/admin/users">Users</Link><br />
          <Link href="/admin/products">Products</Link><br />
          <Link href="/admin/projects">Projects</Link><br />
          <Link href="/admin/payments">Payments</Link><br />
          <Link href="/admin/analytics">Analytics</Link>
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 bg-gray-100">
        {children}
      </div>
    </div>
  );
}