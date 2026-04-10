import { UpgradeProvider } from "@/components/UpgradeProvider";

export default function RootLayout({ children }: any) {
  return (
    <html>
      <body>
        <UpgradeProvider>
          {children}
        </UpgradeProvider>
      </body>
    </html>
  );
}