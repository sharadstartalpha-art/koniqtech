
import BrandingForm from "@/modules/settings/components/BrandingForm";
import prisma from "@/shared/lib/prisma";
import { auth } from "@/auth";
import { getObjectUrl } from "@/shared/lib/storage";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Page() {
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

  if (!currentUser?.orgId) {
    redirect("/login");
  }

  const isOwner =
    currentUser.organizationRole?.name.toLowerCase() === "owner";

  const permission =
    currentUser.organizationRole?.permissions.find(
      (p) => p.module === "Branding"
    );

  if (!isOwner && !permission?.canView) {
    redirect("/dashboard");
  }

  const [organization, settings] = await Promise.all([
    prisma.organization.findUnique({
      where: {
        id: currentUser.orgId,
      },
      select: {
        name: true,
        logo: true,
      },
    }),

    prisma.organizationSettings.findUnique({
      where: {
        orgId: currentUser.orgId,
      },
      select: {
        branding: true,
      },
    }),
  ]);

  if (!organization) {
    redirect("/dashboard");
  }

  const branding =
    settings?.branding &&
    typeof settings.branding === "object" &&
    !Array.isArray(settings.branding)
      ? settings.branding as Record<string, unknown>
      : {};

  const primaryColor =
    typeof branding.primaryColor === "string"
      ? branding.primaryColor
      : "#f97316";

  let logoUrl: string | null = null;

  if (organization.logo) {
    try {
      logoUrl = await getObjectUrl(organization.logo);
    } catch (error) {
      console.error("Failed to generate logo URL:", error);
    }
  }

  return (
    <BrandingForm
      canEdit={isOwner || !!permission?.canEdit}
      initialTenantName={organization.name}
      initialLogoUrl={logoUrl}
      initialPrimaryColor={primaryColor}
    />
  );
}
