
import prisma from "@/shared/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import {
  canCreate,
  canEdit,
  type Permission,
} from "@/shared/lib/permissions";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        organizationRole: {
          include: {
            permissions: true,
          },
        },
      },
    });

    if (!user || !user.orgId) {
      return NextResponse.json(
        { error: "User or organization not found" },
        { status: 403 }
      );
    }

    const permissions: Permission[] =
      (user.organizationRole?.permissions as Permission[]) ?? [];

    const isOwner =
      user.organizationRole?.name?.toLowerCase() === "owner";

    if (
      !canEdit(permissions, "Leads", isOwner) ||
      !canCreate(permissions, "Customers", isOwner)
    ) {
      return NextResponse.json(
        { error: "You do not have permission to convert this lead." },
        { status: 403 }
      );
    }

    const { id } = await params;

    const lead = await prisma.lead.findFirst({
      where: {
        id,
        orgId: user.orgId,
      },
    });

    if (!lead) {
      return NextResponse.json(
        { error: "Lead not found" },
        { status: 404 }
      );
    }

    const customer = await prisma.$transaction(async (tx) => {
      const convertedCustomer = await tx.customer.upsert({
        where: {
          leadId: lead.id,
        },
        create: {
          firstName: lead.firstName,
          lastName: lead.lastName,
          email: lead.email,
          phone: lead.phone,
          companyName: lead.companyName,
          address: lead.address,
          orgId: lead.orgId,
          leadId: lead.id,
          locationId: lead.locationId,
        },
        update: {},
      });

      await tx.lead.update({
        where: {
          id: lead.id,
        },
        data: {
          status: "converted",
        },
      });

      return convertedCustomer;
    });

    return NextResponse.json({
      success: true,
      customerId: customer.id,
    });
  } catch (error) {
    console.error("Lead conversion error:", error);

    return NextResponse.json(
      { error: "Unable to convert lead. Please try again." },
      { status: 500 }
    );
  }
}
