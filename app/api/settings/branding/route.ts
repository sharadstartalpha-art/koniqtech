import { NextResponse } from "next/server";
import prisma from "@/shared/lib/prisma";
import { auth } from "@/auth";
import { uploadObject } from "@/shared/lib/storage";
import {
  canView,
  canEdit,
} from "@/shared/lib/permissions";

export async function POST(req: Request) {
  try {
    // -----------------------------------
    // AUTHENTICATION
    // -----------------------------------

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // -----------------------------------
    // FORM DATA
    // -----------------------------------

    const formData = await req.formData();

    const logo = formData.get("logo");

    const tenantName =
      formData
        .get("tenantName")
        ?.toString()
        .trim() ?? "";

    const primaryColor =
      formData
        .get("primaryColor")
        ?.toString()
        .trim() ?? "#f97316";

    // -----------------------------------
    // FIND CURRENT USER
    // -----------------------------------

    const dbUser =
      await prisma.user.findUnique({
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

    if (!dbUser) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    if (!dbUser.orgId) {
      return NextResponse.json(
        {
          error: "Organization not found",
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------------
    // CHECK PERMISSION
    // -----------------------------------

    const permissions =
      dbUser.organizationRole?.permissions ?? [];

    const isOwner =
      dbUser.organizationRole?.name?.toLowerCase() ===
      "owner";

    const canViewBranding = canView(
      permissions,
      "Branding",
      isOwner
    );

    const canEditBranding = canEdit(
      permissions,
      "Branding",
      isOwner
    );

    if (!canViewBranding || !canEditBranding) {
      return NextResponse.json(
        {
          error:
            "You do not have permission to edit branding.",
        },
        {
          status: 403,
        }
      );
    }

    // -----------------------------------
    // GET CURRENT ORGANIZATION
    // -----------------------------------

    const organization =
      await prisma.organization.findUnique({
        where: {
          id: dbUser.orgId,
        },
        select: {
          logo: true,
          name: true,
        },
      });

    if (!organization) {
      return NextResponse.json(
        {
          error: "Organization not found",
        },
        {
          status: 404,
        }
      );
    }

    // -----------------------------------
    // LOGO UPLOAD
    // -----------------------------------

    let logoKey =
      organization.logo ?? null;

    // Only upload when a new logo
    // was actually selected.

    if (logo instanceof File) {

      if (logo.size === 0) {
        return NextResponse.json(
          {
            error:
              "Uploaded logo is empty.",
          },
          {
            status: 400,
          }
        );
      }

      // -----------------------------------
      // VALIDATE FILE TYPE
      // -----------------------------------

      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp",
        "image/svg+xml",
      ];

      if (
        !allowedTypes.includes(
          logo.type
        )
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid logo format. Please upload PNG, JPG, WEBP or SVG.",
          },
          {
            status: 400,
          }
        );
      }

      // -----------------------------------
      // VALIDATE FILE SIZE
      // -----------------------------------

      const maxSize =
        5 * 1024 * 1024;

      if (logo.size > maxSize) {
        return NextResponse.json(
          {
            error:
              "Logo must be smaller than 5 MB.",
          },
          {
            status: 400,
          }
        );
      }

      // -----------------------------------
      // CREATE S3 KEY
      // -----------------------------------

      const fileExtension =
        logo.name
          .split(".")
          .pop()
          ?.toLowerCase() || "png";

      logoKey =
        `organizations/${dbUser.orgId}/branding/logo-${Date.now()}.${fileExtension}`;

      // -----------------------------------
      // CONVERT FILE TO BUFFER
      // -----------------------------------

      const logoBuffer =
        Buffer.from(
          await logo.arrayBuffer()
        );

      // -----------------------------------
      // UPLOAD TO S3
      // -----------------------------------

      await uploadObject(
        logoKey,
        logoBuffer,
        logo.type
      );
    }

    // -----------------------------------
    // UPDATE ORGANIZATION
    // -----------------------------------

    await prisma.organization.update({
      where: {
        id: dbUser.orgId,
      },
      data: {
        logo: logoKey,

        ...(tenantName
          ? {
              name: tenantName,
            }
          : {}),
      },
    });

    // -----------------------------------
    // UPDATE BRANDING SETTINGS
    // -----------------------------------

    await prisma.organizationSettings.upsert({
      where: {
        orgId: dbUser.orgId,
      },

      update: {
        branding: {
          primaryColor,
        },
      },

      create: {
        orgId: dbUser.orgId,

        branding: {
          primaryColor,
        },
      },
    });

    // -----------------------------------
    // SUCCESS
    // -----------------------------------

    return NextResponse.json({
      success: true,
      logo: logoKey,
    });

  } catch (error) {

    console.error(
      "BRANDING UPLOAD ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to save branding.",
      },
      {
        status: 500,
      }
    );
  }
}