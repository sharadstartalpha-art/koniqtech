import { NextResponse } from "next/server";
import { switchWorkspace } from "@/lib/workspace";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { workspaceId } = await req.json();

  await switchWorkspace(session.user.id, workspaceId);

  return NextResponse.json({ success: true });
}