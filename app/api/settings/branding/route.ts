import { NextResponse } from "next/server";
import prisma from "@/shared/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: Request) {

    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const formData = await req.formData();

    const logo = formData.get("logo") as File;

    const tenantName =
        formData.get("tenantName") as string;

    const primaryColor =
        formData.get("primaryColor") as string;

    //-----------------------------------
    // Upload logo
    //-----------------------------------

    const uploadedLogoUrl =
        "/uploads/company-logo.png";

    //-----------------------------------
    // Find current user
    //-----------------------------------

    const dbUser = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
    });

    if (!dbUser) {
        return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
        );
    }

    //-----------------------------------
    // Update organization
    //-----------------------------------

   // Update Organization
await prisma.organization.update({
    where: {
        id: dbUser.orgId,
    },
    data: {
        logo: uploadedLogoUrl,
        name: tenantName,
    },
});

// Update Branding Settings
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

    return NextResponse.json({
        success: true,
    });

}