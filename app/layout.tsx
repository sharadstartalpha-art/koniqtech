import Navbar from "@/components/Navbar";
import SessionWrapper from "@/components/SessionWrapper";
import "./globals.css";   // ✅ MUST BE HERE

export const metadata = {
  title: "KoniqTech",
  icons: {
    icon: "/favicon.png",
  },
};
export default function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-black">
        <SessionWrapper>
          <Navbar />   {/* ✅ ONLY NAVBAR */}
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}