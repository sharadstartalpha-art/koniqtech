import Navbar from "@/components/Navbar";
import SessionWrapper from "@/components/SessionWrapper";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { UpgradeProvider } from "@/components/UpgradeProvider";
import { ProjectProvider } from "@/components/ProjectProvider";

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
  <ProjectProvider>   {/* 🔥 ADD THIS */}
    <Navbar />
    <UpgradeProvider>
      {children}
    </UpgradeProvider>
  </ProjectProvider>

  <Toaster />
</SessionWrapper>
      </body>
    </html>
  );
}