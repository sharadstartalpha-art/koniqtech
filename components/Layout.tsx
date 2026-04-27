export default function Layout({ children }: any) {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-60 bg-white shadow p-4">
        <h2 className="font-bold mb-6">KoniqTech</h2>

        <a href="/products/invoice-recovery/dashboard" className="block mb-2">
          Dashboard
        </a>

        <a href="/products/invoice-recovery/invoices" className="block mb-2">
          Invoices
        </a>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {children}
      </div>
    </div>
  );
}