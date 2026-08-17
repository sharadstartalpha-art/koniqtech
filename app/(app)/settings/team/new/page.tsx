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

  const orgId = session.user.orgId as string;
  const invitedById = session.user.id as string;

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const roleId = formData.get("roleId") as string;
  const teamId = formData.get("teamId") as string;

  if (!name || !email || !roleId) {
    throw new Error("Please fill all required fields.");
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("A user with this email already exists.");
  }

  const existingInvite =
    await prisma.teamInvitation.findFirst({
      where: {
        email,
        orgId,
        status: "pending",
      },
    });

  if (existingInvite) {
    throw new Error("An invitation has already been sent.");
  }

  const token = crypto.randomUUID();

  await prisma.teamInvitation.create({
    data: {
      orgId,
      invitedById,
      name,
      email,
      roleId,
      teamId: teamId || null,
      token,
      expiresAt: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ),
    },
  });

  // TODO:
  // Send email here
  //
  // Invitation URL:
  //
  // https://koniqtech.com/invitation/${token}

  redirect("/settings/invitations");
}

export default async function NewTeamMemberPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const orgId = session.user.orgId as string;

  const roles =
    await prisma.organizationRole.findMany({
      where: {
        orgId,
        active: true,
      },
      orderBy: {
        name: "asc",
      },
    });

  const teams =
    await prisma.team.findMany({
      where: {
        orgId,
      },
      orderBy: {
        name: "asc",
      },
    });

  return (
    <div className="max-w-4xl mx-auto">

      <div className="mb-8">
        <Link
          href="/settings/team"
          className="text-sm text-slate-500 hover:text-slate-900"
        >
          ← Back to Team
        </Link>

        <h1 className="text-4xl font-bold mt-4">
          Invite Team Member
        </h1>

        <p className="text-slate-500 mt-2">
          Send an invitation email to join your organization.
        </p>
      </div>

      <form
        action={sendInvitation}
        className="bg-white border rounded-3xl p-8 space-y-6"
      >
        <div>
          <label className="block mb-2 font-medium">
            Full Name
          </label>

          <input
            name="name"
            required
            placeholder="John Smith"
            className="w-full h-12 px-4 rounded-xl border"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Email Address
          </label>

          <input
            type="email"
            name="email"
            required
            placeholder="john@company.com"
            className="w-full h-12 px-4 rounded-xl border"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <label className="block mb-2 font-medium">
              Role
            </label>

            <select
              name="roleId"
              required
              className="w-full h-12 px-4 rounded-xl border"
            >
              {roles.map((role) => (
                <option
                  key={role.id}
                  value={role.id}
                >
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Team
            </label>

            <select
              name="teamId"
              className="w-full h-12 px-4 rounded-xl border"
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

        <div className="pt-4 flex gap-3">

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-orange-600 text-white hover:bg-orange-700"
          >
            Send Invitation
          </button>

          <Link
            href="/settings/team"
            className="px-6 py-3 border rounded-xl"
          >
            Cancel
          </Link>

        </div>

      </form>

    </div>
  );
}