
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "@/shared/lib/prisma";
import { auth } from "@/auth";
import { uploadObject, getObjectUrl } from "@/shared/lib/storage";
import {
  canView,
  canEdit,
} from "@/shared/lib/permissions";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();

    const logo = formData.get("logo");

    const tenantName =
      formData.get("tenantName")?.toString().trim() ?? "";

    const submittedColor =
      formData.get("primaryColor")?.toString().trim() ?? "";

    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        organizationRole: {
          include: {
            permissions: true,
          },
        },
      },
    });

    if (!dbUser?.orgId) {
      return NextResponse.json(
        { error: "Organization not found." },
        { status: 404 }
      );
    }

    const permissions =
      dbUser.organizationRole?.permissions ?? [];

    const isOwner =
      dbUser.organizationRole?.name?.toLowerCase() === "owner";

    const allowedToView = canView(
      permissions,
      "Branding",
      isOwner
    );

    const allowedToEdit = canEdit(
      permissions,
      "Branding",
      isOwner
    );

    if (!allowedToView || !allowedToEdit) {
      return NextResponse.json(
        { error: "You do not have permission to edit branding." },
        { status: 403 }
      );
    }

    const [organization, existingSettings] = await Promise.all([
      prisma.organization.findUnique({
        where: { id: dbUser.orgId },
        select: {
          id: true,
          name: true,
          logo: true,
        },
      }),

      prisma.organizationSettings.findUnique({
        where: { orgId: dbUser.orgId },
        select: {
          branding: true,
        },
      }),
    ]);

    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found." },
        { status: 404 }
      );
    }

    const existingBranding =
      existingSettings?.branding &&
      typeof existingSettings.branding === "object" &&
      !Array.isArray(existingSettings.branding)
        ? existingSettings.branding as Record<string, unknown>
        : {};

    const primaryColor =
      submittedColor ||
      (typeof existingBranding.primaryColor === "string"
        ? existingBranding.primaryColor
        : "#f97316");

    if (!/^#[0-9a-fA-F]{6}$/.test(primaryColor)) {
      return NextResponse.json(
        { error: "Invalid primary brand color." },
        { status: 400 }
      );
    }

    // Preserve existing logo unless a new one is uploaded.
    let logoKey = organization.logo;

    if (logo instanceof File && logo.size > 0) {
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp",
        "image/svg+xml",
      ];

      if (!allowedTypes.includes(logo.type)) {
        return NextResponse.json(
          { error: "Invalid logo format." },
          { status: 400 }
        );
      }

      if (logo.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Logo must be smaller than 5 MB." },
          { status: 400 }
        );
      }

      const extension =
        logo.name.split(".").pop()?.toLowerCase() || "png";

      logoKey =
        `organizations/${dbUser.orgId}/branding/logo-${Date.now()}.${extension}`;

      const buffer = Buffer.from(
        await logo.arrayBuffer()
      );

      await uploadObject(
        logoKey,
        buffer,
        logo.type
      );
    }

    // Update company details only when changed.
    const organizationData: Prisma.OrganizationUpdateInput = {};

    if (tenantName && tenantName !== organization.name) {
      organizationData.name = tenantName;
    }

    if (logoKey && logoKey !== organization.logo) {
      organizationData.logo = logoKey;
    }

    if (Object.keys(organizationData).length > 0) {
      await prisma.organization.update({
        where: { id: dbUser.orgId },
        data: organizationData,
      });
    }

    // Preserve other branding JSON properties.
    const brandingData = {
      ...existingBranding,
      primaryColor,
    } as Prisma.InputJsonObject;

    await prisma.organizationSettings.upsert({
      where: {
        orgId: dbUser.orgId,
      },

      update: {
        branding: brandingData,
      },

      create: {
        orgId: dbUser.orgId,
        branding: brandingData,
      },
    });

    // Generate a temporary URL for displaying the saved logo.
    const logoUrl = logoKey
      ? await getObjectUrl(logoKey)
      : null;

    return NextResponse.json({
      success: true,
      tenantName: tenantName || organization.name,
      logo: logoKey,
      logoUrl,
      primaryColor,
    });

  } catch (error) {
    console.error("BRANDING UPDATE ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to save branding.",
      },
      { status: 500 }
    );
  }
}
