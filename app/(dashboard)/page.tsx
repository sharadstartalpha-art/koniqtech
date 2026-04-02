import Link from "next/link"

export default function Dashboard() {
  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        Welcome to KoniqTech 🚀
      </h1>

      <p className="mb-6 text-gray-600">
        Let’s get your first leads in 30 seconds
      </p>

      <div className="grid gap-4 max-w-md">

        <Link
          href="/project/new"
          className="bg-black text-white p-4 rounded"
        >
          1️⃣ Create Project
        </Link>

        <Link
          href="/project/demo/lead-finder"
          className="bg-gray-100 p-4 rounded"
        >
          2️⃣ Find Leads
        </Link>

        <Link
          href="/dashboard/leads"
          className="bg-gray-100 p-4 rounded"
        >
          3️⃣ View CRM Pipeline
        </Link>

      </div>
    </div>
  )
}