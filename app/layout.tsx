import "./globals.css";
import Header from "@/components/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        {/* ✅ Global Header */}
        <Header />

        {/* ✅ Centered Content */}
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </body>
    </html>
  );
}