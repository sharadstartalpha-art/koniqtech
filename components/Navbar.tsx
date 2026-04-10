import AuthButtons from "./AuthButtons";

export default function Navbar() {
  return (
    <div className="flex justify-between items-center px-6 h-14 border-b bg-white">

      <div className="font-semibold">KoniqTech</div>

      <AuthButtons /> {/* 👈 client component */}

    </div>
  );
}