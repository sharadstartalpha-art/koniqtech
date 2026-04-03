import "./globals.css";
import Navbar from "@/components/Navbar";
import SessionWrapper from "@/components/SessionWrapper";

export const metadata = {
  title: "KoniqTech",
  description: "AI Lead Generation SaaS",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-black">
        <SessionWrapper>
          <div className="max-w-5xl mx-auto p-6">
            <Navbar />
            {children}
          </div>
        </SessionWrapper>
      </body>
    </html>
  );
}