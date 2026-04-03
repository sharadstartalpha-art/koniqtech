import Navbar from "@/components/Navbar";
import SessionWrapper from "@/components/SessionWrapper";

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