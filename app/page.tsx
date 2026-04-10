import Link from "next/link";

export default function HomePage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center">

      <h1 className="text-4xl font-bold">
        KoniqTech 🚀
      </h1>

      <p className="text-gray-500 mt-2">
        AI Lead Generation Platform
      </p>

      <div className="flex gap-4 mt-6">
        <Link href="/login" className="bg-black text-white px-4 py-2 rounded">
          Login
        </Link>

        <Link href="/register" className="border px-4 py-2 rounded">
          Register
        </Link>
      </div>

    </div>
  );
}