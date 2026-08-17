import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

export default async function CompanyPage() {
  const session = await auth();

  const orgId = (session?.user as any).orgId;

  const organization = await prisma.organization.findUnique({
    where: {
      id: orgId,
    },
  });

  return (
    <pre>
      {JSON.stringify(
        {
          orgId,
          organization,
        },
        null,
        2
      )}
    </pre>
  );
}