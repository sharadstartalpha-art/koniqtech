import { prisma } from "@/lib/prisma";

/* =========================
   GET ALL TEMPLATES
========================= */
export async function GET() {
  try {
    const templates = await prisma.reminderTemplate.findMany({
      orderBy: { createdAt: "desc" },
    });

    return Response.json(templates);
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}

/* =========================
   CREATE / UPDATE TEMPLATE
========================= */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { id, name, subject, html, type } = body;

    if (!name || !subject || !html || !type) {
      return Response.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    // CREATE
    if (!id) {
      const template = await prisma.reminderTemplate.create({
        data: {
          userId: "user-id", // 🔥 replace with auth later
          name,
          subject,
          html,
          type,
        },
      });

      return Response.json(template);
    }

    // UPDATE
    const template = await prisma.reminderTemplate.update({
      where: { id },
      data: {
        name,
        subject,
        html,
        type,
      },
    });

    return Response.json(template);

  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "Failed to save template" },
      { status: 500 }
    );
  }
}

/* =========================
   DELETE TEMPLATE
========================= */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json(
        { error: "Missing id" },
        { status: 400 }
      );
    }

    await prisma.reminderTemplate.delete({
      where: { id },
    });

    return Response.json({ success: true });

  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "Failed to delete template" },
      { status: 500 }
    );
  }
}