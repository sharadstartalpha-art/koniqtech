import Link from "next/link";

export default function AdminLayout({ children }: any) {
  return (
    <div className="flex min-h-screen">

      {/* SIDEBAR */}
      <div className="w-60 bg-black text-white p-4 space-y-4">
        <h2 className="font-bold">Admin 🛠</h2>

        <Link href="/admin">Dashboard</Link>
        <Link href="/admin/users">Users</Link>
        <Link href="/admin/products">Products</Link>
        <Link href="/admin/payments">Payments</Link>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-6 bg-gray-50">
        {children}
      </div>

    </div>
  );
}