import BrandingForm from "@/modules/settings/components/BrandingForm";
import prisma from "@/shared/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Page() {

  const session = await auth();

  if (!session?.user) {
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
      p => p.module === "Branding"
    );

  if (!isOwner && !permission?.canView) {
    redirect("/dashboard");
  }

  return (
    <BrandingForm
      canEdit={isOwner || !!permission?.canEdit}
    />
  );
}