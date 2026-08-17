import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/shared/lib/prisma";

export default async function CompanyPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const orgId = (session.user as any).orgId;

  const organization = await prisma.organization.findUnique({
    where: {
      id: orgId,
    },
  });

  if (!organization) {
    redirect("/welcome");
  }

  return (
    <div>
      {organization.name}
    </div>
  );
}