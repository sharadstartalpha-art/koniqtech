import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-[#fafafa]`}>
        {children}

        {/* 🔥 TOAST SYSTEM */}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}