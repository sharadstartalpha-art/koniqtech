import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-64 bg-white border-r h-full p-4">
      <h1 className="text-xl font-bold mb-6">KoniqTech</h1>

      <nav className="space-y-2">
        <Link href="/dashboard" className="block p-2 rounded hover:bg-gray-100">
          Dashboard
        </Link>
        <Link href="/projects" className="block p-2 rounded hover:bg-gray-100">
          Projects
        </Link>
        <Link href="/products" className="block p-2 rounded hover:bg-gray-100">
          Products
        </Link>
        <Link href="/billing" className="block p-2 rounded hover:bg-gray-100">
          Billing
        </Link>
      </nav>
    </div>
  );
}