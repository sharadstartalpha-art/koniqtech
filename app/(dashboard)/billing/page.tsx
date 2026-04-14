import {prisma} from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function BillingPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <div className="p-6">Unauthorized</div>;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      subscriptions: {
        include: {
          plan: true,
        },
      },
      teamMembers: {
        include: {
          team: {
            include: { members: true },
          },
        },
      },
    },
  });

  const team = user?.teamMembers[0]?.team;
  const teamSize = team?.members.length || 1;

  const pricePerSeat = 10;
  const total = teamSize * pricePerSeat;

  // ✅ get latest subscription
  const subscription = user?.subscriptions?.[0];

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">Billing 💳</h1>

      {/* PLAN */}
      <div className="border p-6 rounded-xl space-y-2">
        <p><strong>Plan:</strong> {subscription?.plan?.name || "Free"}</p>

        <p>
          <strong>Status:</strong>{" "}
          <span
            className={`px-2 py-1 rounded text-sm ${
              subscription?.status === "ACTIVE"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {subscription?.status || "INACTIVE"}
          </span>
        </p>

        <p><strong>Team Size:</strong> {teamSize}</p>
        <p><strong>Total:</strong> ${total}/month</p>
      </div>

      {/* ACTIONS */}
      <div className="space-y-4">

        {/* UPGRADE */}
        <div className="grid md:grid-cols-3 gap-4">
          {["STARTER", "PRO", "ENTERPRISE"].map((plan) => (
            <form key={plan} action="/api/paypal/subscribe" method="POST">
              <input type="hidden" name="planId" value={plan} />
              <input type="hidden" name="teamId" value={team?.id} />

              <button className="border p-4 rounded-xl hover:shadow w-full">
                Upgrade to {plan}
              </button>
            </form>
          ))}
        </div>

        {/* CANCEL */}
        {subscription && (
          <form action="/api/paypal/cancel-subscription" method="POST">
            <input
              type="hidden"
              name="subscriptionId"
              value={subscription.id}
            />
            <button className="bg-red-500 text-white px-4 py-2 rounded">
              Cancel Subscription
            </button>
          </form>
        )}

      </div>

    </div>
  );
}