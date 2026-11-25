
import prisma from "@/shared/lib/prisma";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import {
  canEdit,
  canDelete,
  canAssign,
  type Permission,
} from "@/shared/lib/permissions";

const STAGES = [
  "new",
  "qualified",
  "proposal",
  "negotiation",
  "won",
  "lost",
] as const;

async function getAuthorizedUser() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
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

  if (!user?.orgId) {
    return null;
  }

  const permissions: Permission[] =
    (user.organizationRole?.permissions as Permission[]) ?? [];

  const isOwner =
    user.organizationRole?.name?.toLowerCase() === "owner";

  return {
    user,
    permissions,
    isOwner,
  };
}

async function updateOpportunity(
  req: NextRequest,
  id: string,
  input: {
    title: unknown;
    stage: unknown;
    value: unknown;
    probability: unknown;
    expectedCloseDate: unknown;
    description: unknown;
    notes: unknown;
    ownerId: unknown;
  },
  responseType: "redirect" | "json"
) {
  const context = await getAuthorizedUser();

  if (!context) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { user, permissions, isOwner } = context;
  const orgId = user.orgId!;

  if (!canEdit(permissions, "Pipeline", isOwner)) {
    return NextResponse.json(
      { success: false, message: "You cannot edit opportunities." },
      { status: 403 }
    );
  }

  const existing = await prisma.opportunity.findFirst({
    where: {
      id,
      orgId,
    },
  });

  if (!existing) {
    return NextResponse.json(
      { success: false, message: "Opportunity not found." },
      { status: 404 }
    );
  }

  const title = String(input.title ?? "").trim();
  const stage = String(input.stage ?? "");
  const valueText = String(input.value ?? "").trim();
  const probabilityText = String(input.probability ?? "").trim();
  const closeText = String(input.expectedCloseDate ?? "").trim();
  const description = String(input.description ?? "").trim();
  const notes = String(input.notes ?? "").trim();

  if (!title || title.length > 200) {
    return NextResponse.json(
      { success: false, message: "Enter a valid opportunity title." },
      { status: 400 }
    );
  }

  if (!STAGES.includes(stage as (typeof STAGES)[number])) {
    return NextResponse.json(
      { success: false, message: "Invalid opportunity stage." },
      { status: 400 }
    );
  }

  const value =
    valueText === "" ? null : Number(valueText);

  const probability =
    probabilityText === "" ? 10 : Number(probabilityText);

  if (
    (value !== null && (!Number.isFinite(value) || value < 0)) ||
    !Number.isFinite(probability) ||
    probability < 0 ||
    probability > 100
  ) {
    return NextResponse.json(
      { success: false, message: "Enter a valid value and probability." },
      { status: 400 }
    );
  }

  const expectedCloseDate = closeText
    ? new Date(`${closeText}T00:00:00`)
    : null;

  if (
    expectedCloseDate &&
    Number.isNaN(expectedCloseDate.getTime())
  ) {
    return NextResponse.json(
      { success: false, message: "Invalid expected close date." },
      { status: 400 }
    );
  }

  let ownerId = existing.ownerId;

  if (canAssign(permissions, "Pipeline", isOwner)) {
    const submittedOwnerId = String(input.ownerId ?? "").trim();

    if (!submittedOwnerId) {
      ownerId = null;
    } else {
      const assignedUser = await prisma.user.findFirst({
        where: {
          id: submittedOwnerId,
          orgId,
        },
        select: {
          id: true,
        },
      });

      if (!assignedUser) {
        return NextResponse.json(
          { success: false, message: "Invalid sales representative." },
          { status: 400 }
        );
      }

      ownerId = assignedUser.id;
    }
  }

  const opportunity = await prisma.opportunity.update({
    where: {
      id,
      orgId,
    },
    data: {
      title,
      stage,
      value,
      probability,
      expectedCloseDate,
      description: description || null,
      notes: notes || null,
      ownerId,
    },
  });

  if (responseType === "redirect") {
    return NextResponse.redirect(
      new URL(`/pipeline/${opportunity.id}`, req.url)
    );
  }

  return NextResponse.json({
    success: true,
    opportunity,
  });
}


export async function POST(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        organizationRole: {
          include: { permissions: true },
        },
      },
    });

    if (!dbUser?.orgId) {
      return NextResponse.json(
        { success: false, message: "Organization not found" },
        { status: 401 }
      );
    }

    const permissions =
      dbUser.organizationRole?.permissions ?? [];

    const isOwner =
      dbUser.organizationRole?.name?.toLowerCase() === "owner";

    if (!canEdit(permissions, "Pipeline", isOwner)) {
      return NextResponse.json(
        { success: false, message: "Permission denied" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const form = await req.formData();

    const opportunity = await prisma.opportunity.findFirst({
      where: {
        id,
        orgId: dbUser.orgId,
      },
    });

    if (!opportunity) {
      return NextResponse.json(
        { success: false, message: "Opportunity not found" },
        { status: 404 }
      );
    }

    const title = String(form.get("title") ?? "").trim();
    const stage = String(form.get("stage") ?? "");
    const valueText = String(form.get("value") ?? "");
    const probabilityText = String(form.get("probability") ?? "");
    const closeDateText = String(form.get("expectedCloseDate") ?? "");
    const description = String(form.get("description") ?? "");
    const notes = String(form.get("notes") ?? "");

    const validStages = [
      "new",
      "qualified",
      "proposal",
      "negotiation",
      "won",
      "lost",
    ];

    if (!title || !validStages.includes(stage)) {
      return NextResponse.json(
        { success: false, message: "Invalid title or stage" },
        { status: 400 }
      );
    }

    const value =
      valueText.trim() === "" ? null : Number(valueText);

    const probability = Number(probabilityText);

    if (
      (value !== null && (!Number.isFinite(value) || value < 0)) ||
      !Number.isInteger(probability) ||
      probability < 0 ||
      probability > 100
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid value or probability" },
        { status: 400 }
      );
    }

    const expectedCloseDate =
      closeDateText.trim() === ""
        ? null
        : new Date(`${closeDateText}T00:00:00.000Z`);

    if (
      expectedCloseDate &&
      Number.isNaN(expectedCloseDate.getTime())
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid close date" },
        { status: 400 }
      );
    }

    const canChangeOwner = canAssign(
      permissions,
      "Pipeline",
      isOwner
    );

    const updateData: Record<string, unknown> = {
      title,
      stage,
      value,
      probability,
      expectedCloseDate,
      description: description.trim() || null,
      notes: notes.trim() || null,
    };

    if (canChangeOwner) {
      const ownerId = String(form.get("ownerId") ?? "").trim();

      if (ownerId) {
        const validOwner = await prisma.user.findFirst({
          where: {
            id: ownerId,
            orgId: dbUser.orgId,
          },
          select: { id: true },
        });

        if (!validOwner) {
          return NextResponse.json(
            { success: false, message: "Invalid representative" },
            { status: 400 }
          );
        }
      }

      updateData.ownerId = ownerId || null;
    }

    await prisma.opportunity.update({
      where: { id: opportunity.id },
      data: updateData,
    });

    return NextResponse.redirect(
      new URL(`/pipeline/${id}`, req.url),
      303
    );

  } catch (error) {
    console.error("Opportunity update error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Opportunity update failed",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    return await updateOpportunity(
      req,
      id,
      {
        title: body.title,
        stage: body.stage,
        value: body.value,
        probability: body.probability,
        expectedCloseDate: body.expectedCloseDate,
        description: body.description,
        notes: body.notes,
        ownerId: body.ownerId,
      },
      "json"
    );
  } catch (error) {
    console.error("Opportunity API error:", error);

    return NextResponse.json(
      { success: false, message: "Opportunity update failed." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const context = await getAuthorizedUser();

    if (!context) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { user, permissions, isOwner } = context;
    const { id } = await params;

    if (!canDelete(permissions, "Pipeline", isOwner)) {
      return NextResponse.json(
        { success: false, message: "You cannot delete opportunities." },
        { status: 403 }
      );
    }

    const existing = await prisma.opportunity.findFirst({
      where: {
        id,
        orgId: user.orgId!,
      },
      select: {
        id: true,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Opportunity not found." },
        { status: 404 }
      );
    }

    await prisma.opportunity.delete({
      where: {
        id: existing.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Opportunity deletion error:", error);

    return NextResponse.json(
      { success: false, message: "Opportunity deletion failed." },
      { status: 500 }
    );
  }
}
