import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function BillingPage() {
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email! },
  });

  const teamSize = await prisma.user.count({
    where: { workspaceId: user?.workspaceId },
  });

  const pricePerSeat = 10;

  return (
    <div className="space-y-6">

      <h1 className="text-xl font-bold">Billing 💳</h1>

      <div className="bg-white p-6 rounded-xl border">
        <p>Seats: {teamSize}</p>
        <p>Total: ${teamSize * pricePerSeat}/month</p>
      </div>

    </div>
  );
}