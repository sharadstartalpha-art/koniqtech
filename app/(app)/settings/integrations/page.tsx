import prisma from "@/shared/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function IntegrationsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      organizationRole: {
        include: {
          permissions: true,
        },
      },
    },
  });

  if (!currentUser) {
    redirect("/login");
  }

  const isOwner =
    currentUser.organizationRole?.name.toLowerCase() ===
    "owner";

  const permission =
    currentUser.organizationRole?.permissions.find(
      (p) => p.module === "Integrations"
    );

  if (
    !isOwner &&
    !permission?.canView
  ) {
    redirect("/dashboard");
  }

  const canEdit =
    isOwner ||
    permission?.canEdit;

  const integrations = [
    {
      name: "Stripe",
      description: "Payments and subscriptions",
    },
    {
      name: "Twilio",
      description: "SMS and phone calls",
    },
    {
      name: "OpenAI",
      description: "AI assistant and automations",
    },
    {
      name: "Google Calendar",
      description: "Scheduling and events",
    },
    {
      name: "QuickBooks",
      description: "Accounting integration",
    },
  ];

  return (
    <div className="max-w-6xl space-y-8">
      <div>
        <h1 className="text-4xl font-bold">
          Integrations
        </h1>

        <p className="text-slate-500 mt-2">
          Connect third-party services.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {integrations.map((item) => (
          <div
            key={item.name}
            className="bg-white border rounded-3xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  {item.name}
                </h2>

                <p className="text-slate-500 mt-1">
                  {item.description}
                </p>
              </div>

              <button
                type="button"
                disabled={!canEdit}
                className={`px-4 py-2 rounded-xl border ${
                  canEdit
                    ? "bg-orange-600 text-white"
                    : "bg-slate-100 text-slate-500 cursor-not-allowed"
                }`}
              >
                {canEdit
                  ? "Coming Soon"
                  : "No Permission"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}