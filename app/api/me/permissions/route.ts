import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
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

  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  const permissions =
    user.organizationRole?.permissions.map((p) => ({
      module: String(p.module),
      canView: Boolean(p.canView),
      canCreate: Boolean(p.canCreate),
      canEdit: Boolean(p.canEdit),
      canDelete: Boolean(p.canDelete),
      canImport: Boolean(p.canImport),
      canExport: Boolean(p.canExport),
      canApprove: Boolean(p.canApprove),
      canAssign: Boolean(p.canAssign),
    })) ?? [];

  return NextResponse.json(permissions);
}