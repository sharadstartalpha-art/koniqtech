
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AppLayout from "@/app/components/AppLayout";
import { requireActiveSubscription } from "@/shared/lib/check-subscription";
import prisma from "@/shared/lib/prisma";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // Don't check subscription for super admins
  if (session.user.role !== "super_admin") {
    await requireActiveSubscription(session.user.orgId);
  }

  /*
   * Load locations assigned to the logged-in user.
   *
   * This uses the existing UserLocation table.
   * No database/schema change is required.
   */
  const userLocations = await prisma.userLocation.findMany({
    where: {
      userId: session.user.id,
      location: {
        orgId: session.user.orgId,
        active: true,
      },
    },
    select: {
      location: {
        select: {
          id: true,
          name: true,
          city: true,
          state: true,
          country: true,
          isDefault: true,
        },
      },
    },
    orderBy: [
      {
        location: {
          isDefault: "desc",
        },
      },
      {
        location: {
          name: "asc",
        },
      },
    ],
  });

  const locations = userLocations.map((item) => item.location);

  return (
    <AppLayout locations={locations}>
      {children}
    </AppLayout>
  );
}

