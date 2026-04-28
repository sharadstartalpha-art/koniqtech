import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-[#fafafa]`}>
        {children}
      </body>
    </html>
  );
}