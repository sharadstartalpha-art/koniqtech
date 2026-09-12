import { NextResponse } from "next/server";
import prisma from "@/shared/lib/prisma";
import { auth } from "@/auth";
import { uploadObject } from "@/shared/lib/storage";

export async function POST(req: Request) {
  try {
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

    const formData = await req.formData();

    const logo = formData.get("logo");
    const tenantName =
      formData.get("tenantName")?.toString().trim() ?? "";

    const primaryColor =
      formData.get("primaryColor")?.toString() ?? "#f97316";

    // -----------------------------------
    // Validate user
    // -----------------------------------

    const dbUser = await prisma.user.findUnique({
      where: {
        id: session.user.id,
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
    // Validate logo
    // -----------------------------------

    if (!(logo instanceof File)) {
      return NextResponse.json(
        {
          error: "Please upload a company logo.",
        },
        {
          status: 400,
        }
      );
    }

    if (logo.size === 0) {
      return NextResponse.json(
        {
          error: "Uploaded logo is empty.",
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------------
    // Validate file type
    // -----------------------------------

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
      "image/svg+xml",
    ];

    if (!allowedTypes.includes(logo.type)) {
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
    // Validate file size
    // -----------------------------------

    const maxSize = 5 * 1024 * 1024;

    if (logo.size > maxSize) {
      return NextResponse.json(
        {
          error: "Logo must be smaller than 5 MB.",
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------------
    // Upload logo to S3
    // -----------------------------------

    const fileExtension =
      logo.name.split(".").pop()?.toLowerCase() || "png";

    const logoKey =
      `organizations/${dbUser.orgId}/branding/logo-${Date.now()}.${fileExtension}`;

    const logoBuffer = Buffer.from(
      await logo.arrayBuffer()
    );

    await uploadObject(
      logoKey,
      logoBuffer,
      logo.type
    );

    // -----------------------------------
    // Update Organization
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
    // Update Branding Settings
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
    // Success
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