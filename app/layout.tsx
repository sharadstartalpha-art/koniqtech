import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import { Toaster } from "react-hot-toast";

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {/* 🔥 GLOBAL NAV */}
          <Navbar />

          {/* 🔔 TOAST SYSTEM */}
          <Toaster position="top-right" />

          {/* 📦 MAIN */}
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}