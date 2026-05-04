import { prisma } from "@/lib/prisma";

export async function GET() {
  const templates = await prisma.reminderTemplate.findMany({
    orderBy: { createdAt: "desc" },
  });

  return Response.json(templates);
}

export async function POST(req: Request) {
  const body = await req.json();

  const template = await prisma.reminderTemplate.upsert({
    where: { id: body.id || "" },
    update: {
      name: body.name,
      subject: body.subject,
      html: body.html,
    },
    create: {
      userId: "user-id", // replace later with auth
      name: body.name,
      subject: body.subject,
      html: body.html,
    },
  });

  return Response.json(template);
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return Response.json({ error: "Missing id" });

  await prisma.reminderTemplate.delete({
    where: { id },
  });

  return Response.json({ success: true });
}