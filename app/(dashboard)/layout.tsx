import Navbar from "@/components/Navbar";

export default function DashboardLayout({ children }: any) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}