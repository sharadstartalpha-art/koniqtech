import { prisma } from "@/lib/prisma";

export async function GET() {
  const templates = await prisma.reminderTemplate.findMany({
    orderBy: { createdAt: "desc" },
  });

  return Response.json(templates);
}

export async function POST(req: Request) {
  const body = await req.json();

  // If no ID → create new
  if (!body.id) {
    const template = await prisma.reminderTemplate.create({
      data: {
        userId: "user-id", // replace with auth later
        name: body.name,
        subject: body.subject,
        html: body.html,
        type: body.type, // ✅ REQUIRED FIELD
      },
    });

    return Response.json(template);
  }

  // If ID exists → update
  const template = await prisma.reminderTemplate.update({
    where: { id: body.id },
    data: {
      name: body.name,
      subject: body.subject,
      html: body.html,
      type: body.type, // ✅ keep consistent
    },
  });

  return Response.json(template);
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return Response.json({ error: "Missing id" }, { status: 400 });
  }

  await prisma.reminderTemplate.delete({
    where: { id },
  });

  return Response.json({ success: true });
}