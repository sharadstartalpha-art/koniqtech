import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-4 gap-6">

      {[
        { title: "Users", value: "1" },
        { title: "Projects", value: "1" },
        { title: "Revenue", value: "$0" },
        { title: "Credits", value: "9999" },
      ].map((item) => (
        <div
          key={item.title}
          className="bg-white p-5 rounded-xl border shadow-sm hover:shadow-md transition"
        >
          <p className="text-sm text-gray-500">
            {item.title}
          </p>

          <h2 className="text-2xl font-semibold mt-2">
            {item.value}
          </h2>
        </div>
      ))}

    </div>
  );
}