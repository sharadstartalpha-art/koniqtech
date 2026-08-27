import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

import Link from "next/link";

import {
  notFound,
  redirect,
} from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    crewId: string;
  }>;
}

export default async function EditCrewPage({
  params,
}: PageProps) {

  const { crewId } =
    await params;

  const session =
    await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const orgId =
    (session.user as any).orgId;

  const crew =
    await prisma.crewMember.findFirst({

      where: {

        id: crewId,

        orgId,

      },

    });

  if (!crew) {
    notFound();
  }


  async function updateCrew(
    formData: FormData
  ) {

    "use server";

    const session =
      await auth();

    if (!session?.user) {
      redirect("/login");
    }

    const orgId =
      (session.user as any).orgId;

    const name =
      formData
        .get("name")
        ?.toString()
        .trim() ?? "";

    const email =
      formData
        .get("email")
        ?.toString()
        .trim() || null;

    const phone =
      formData
        .get("phone")
        ?.toString()
        .trim() || null;

    const role =
      formData
        .get("role")
        ?.toString()
        .trim() ?? "";

    const active =
      formData.get("active") === "true";

    if (!name) {
      throw new Error(
        "Name is required."
      );
    }

    if (!role) {
      throw new Error(
        "Role is required."
      );
    }

    if (email) {

      const existing =
        await prisma.crewMember.findFirst({

          where: {

            orgId,

            email,

            NOT: {
              id: crewId ,
            },

          },

        });

      if (existing) {

        throw new Error(
          "Another crew member already uses this email."
        );

      }

    }

    await prisma.crewMember.update({

      where: {

        id: crewId ,

      },

      data: {

        name,

        email,

        phone,

        role,

        active,

      },

    });

    redirect(
      `/crew/${crewId }`
    );

  }

  const roles = [

    "Technician",

    "Installer",

    "Electrician",

    "HVAC Technician",

    "Plumber",

    "Supervisor",

    "Crew Lead",

    "Foreman",

    "Helper",

    "Laborer",

    "Operator",

    "Inspector",

    "Project Manager",

    "Warehouse",

    "Driver",

    "Other",

  ];
    return (

    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold">
            Edit Crew Member
          </h1>

          <p className="mt-2 text-slate-600">
            Update crew member information.
          </p>

        </div>

        <Link
          href={`/crew/${crew.id}`}
          className="rounded-xl border border-slate-300 px-5 py-3 font-medium hover:bg-slate-50"
        >
          Back
        </Link>

      </div>

      <form
        action={updateCrew}
        className="space-y-8"
      >

        <div className="rounded-3xl border bg-white p-8">

          <h2 className="mb-6 text-xl font-semibold">
            Crew Information
          </h2>

          <div className="grid gap-6 md:grid-cols-2">

            <div>

              <label className="mb-2 block text-sm font-medium">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                required
                defaultValue={crew.name}
                className="w-full rounded-xl border px-4 py-3 focus:border-orange-500 focus:outline-none"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Role
              </label>

              <select
                name="role"
                defaultValue={crew.role}
                required
                className="w-full rounded-xl border px-4 py-3 focus:border-orange-500 focus:outline-none"
              >

                {roles.map((role) => (

                  <option
                    key={role}
                    value={role}
                  >
                    {role}
                  </option>

                ))}

              </select>

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Email
              </label>

              <input
                type="email"
                name="email"
                defaultValue={crew.email ?? ""}
                className="w-full rounded-xl border px-4 py-3 focus:border-orange-500 focus:outline-none"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Phone
              </label>

              <input
                type="tel"
                name="phone"
                defaultValue={crew.phone ?? ""}
                className="w-full rounded-xl border px-4 py-3 focus:border-orange-500 focus:outline-none"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Status
              </label>

              <select
                name="active"
                defaultValue={
                  crew.active
                    ? "true"
                    : "false"
                }
                className="w-full rounded-xl border px-4 py-3 focus:border-orange-500 focus:outline-none"
              >

                <option value="true">
                  Active
                </option>

                <option value="false">
                  Inactive
                </option>

              </select>

            </div>

          </div>

        </div>
                <div className="rounded-3xl border bg-white p-8">

          <h2 className="mb-6 text-xl font-semibold">
            Information
          </h2>

          <div className="rounded-2xl bg-slate-50 p-6">

            <ul className="space-y-3 text-sm text-slate-600">

              <li>
                • Name is required.
              </li>

              <li>
                • Role is required.
              </li>

              <li>
                • Email must be unique within your organization.
              </li>

              <li>
                • Inactive crew members remain in the system but should not be assigned to new jobs.
              </li>

              <li>
                • Existing job assignments are preserved when updating this crew member.
              </li>

            </ul>

          </div>

        </div>

        <div className="flex items-center justify-end gap-4">

          <Link
            href={`/crew/${crew.id}`}
            className="rounded-xl border border-slate-300 px-6 py-3 font-medium hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="rounded-xl bg-orange-500 px-6 py-3 font-medium text-white hover:bg-orange-600"
          >
            Save Changes
          </button>

        </div>

      </form>

    </div>

  );

}