import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";
import crypto from "crypto";

async function sendInvitation(formData: FormData) {
  "use server";

  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const orgId = session.user.orgId!;
  const invitedById = session.user.id!;

  const name = (formData.get("name") as string).trim();
  const email = (formData.get("email") as string).trim().toLowerCase();
  const roleId = formData.get("roleId") as string;
  const teamId = (formData.get("teamId") as string) || null;

  if (!name || !email || !roleId) {
    throw new Error("Please complete all required fields.");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists.");
  }

  const existingInvitation = await prisma.teamInvitation.findFirst({
    where: {
      orgId,
      email,
      status: "pending",
    },
  });

  if (existingInvitation) {
    throw new Error("Invitation already sent.");
  }

  const token = crypto.randomUUID();

  await prisma.teamInvitation.create({
    data: {
      orgId,
      invitedById,
      name,
      email,
      roleId,
      teamId,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  // TODO:
  // await sendInvitationEmail(email, token)

  redirect("/settings/invitations");
}

export default async function NewTeamMemberPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const orgId = session.user.orgId!;

  const [roles, teams] = await Promise.all([
    prisma.organizationRole.findMany({
      where: {
        orgId,
        active: true,
      },
      orderBy: {
        name: "asc",
      },
    }),

    prisma.team.findMany({
      where: {
        orgId,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  return (
    <div className="max-w-4xl mx-auto">

      <div className="mb-8">
        <Link
          href="/settings/team"
          className="text-sm text-slate-500 hover:text-slate-900"
        >
          ← Back to Team
        </Link>

        <h1 className="mt-4 text-4xl font-bold">
          Invite Team Member
        </h1>

        <p className="mt-2 text-slate-500">
          Send an invitation email to join your organization.
        </p>
      </div>

      <form
        action={sendInvitation}
        className="space-y-6 rounded-3xl border bg-white p-8"
      >
        <div>
          <label className="mb-2 block font-medium">
            Full Name
          </label>

          <input
            name="name"
            required
            placeholder="John Smith"
            className="h-12 w-full rounded-xl border px-4"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Email Address
          </label>

          <input
            type="email"
            name="email"
            required
            placeholder="john@company.com"
            className="h-12 w-full rounded-xl border px-4"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">

          <div>
            <label className="mb-2 block font-medium">
              Role
            </label>

            <select
              name="roleId"
              required
              className="h-12 w-full rounded-xl border px-4"
            >
              {roles.length === 0 ? (
                <option value="">
                  No roles available
                </option>
              ) : (
                roles.map((role) => (
                  <option
                    key={role.id}
                    value={role.id}
                  >
                    {role.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Team
            </label>

            <select
              name="teamId"
              className="h-12 w-full rounded-xl border px-4"
            >
              <option value="">
                No Team
              </option>

              {teams.map((team) => (
                <option
                  key={team.id}
                  value={team.id}
                >
                  {team.name}
                </option>
              ))}
            </select>
          </div>

        </div>

        <div className="flex gap-3 pt-4">

          <button
            type="submit"
            disabled={roles.length === 0}
            className="rounded-xl bg-orange-600 px-6 py-3 font-medium text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            Send Invitation
          </button>

          <Link
            href="/settings/team"
            className="rounded-xl border px-6 py-3 font-medium"
          >
            Cancel
          </Link>

        </div>

        {roles.length === 0 && (
          <div className="rounded-xl border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-800">
            No active roles exist for this organization. Create organization
            roles before inviting team members.
          </div>
        )}
      </form>

    </div>
  );
}