import Navbar from "@/components/Navbar";
import SessionWrapper from "@/components/SessionWrapper";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { UpgradeProvider } from "@/components/UpgradeProvider";

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
          <UpgradeProvider>
            <Navbar />
            {children}
            <Toaster position="top-right" />
          </UpgradeProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}