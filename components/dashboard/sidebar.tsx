import Link from "next/link";
import { LayoutDashboard, Folder, CreditCard } from "lucide-react";

const nav = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: Folder },
  { name: "Billing", href: "/billing", icon: CreditCard },
];

export default function Sidebar() {
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full p-4 flex flex-col">
      {/* Logo */}
      <div className="text-xl font-semibold mb-8">KoniqTech</div>

      {/* Nav */}
      <nav className="space-y-1">
        {nav.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition"
          >
            <item.icon size={18} />
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="mt-auto text-xs text-gray-400">
        © 2026 KoniqTech
      </div>
    </div>
  );
}