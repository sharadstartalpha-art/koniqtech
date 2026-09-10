import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AiChatClient from "./AiChatClient";
import prisma from "@/shared/lib/prisma";
import { canCreate, canView } from "@/shared/lib/permissions";

export const dynamic = "force-dynamic";

export default async function AiChatPage() {
  const session = await auth();
  if (!session?.user?.id || !session.user.orgId) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { organizationRole: { include: { permissions: true } } },
  });
  if (!user || user.orgId !== session.user.orgId) redirect("/login");

  const isOwner = user.organizationRole?.name === "Owner";
  const permissions = user.organizationRole?.permissions ?? [];
  if (!canView(permissions, "AI Assistant", isOwner) || !canCreate(permissions, "AI Assistant", isOwner)) redirect("/403");

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-5xl font-bold">AI Assistant</h1>
          <p className="mt-2 text-slate-600">Get a quick answer from the data already in your CRM.</p>
        </div>
        <Link href="/ai" className="shrink-0 rounded-xl border px-5 py-3 font-medium hover:bg-slate-50">AI Dashboard</Link>
      </div>
      <AiChatClient />
    </div>
  );
}
