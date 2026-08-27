import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

import Link from "next/link";

import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CreateCrewPage() {

  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const orgId = (session.user as any).orgId;
  const userId = (session.user as any).id;

  async function createCrew(formData: FormData) {
    "use server";

    const session = await auth();

    if (!session?.user) {
      redirect("/login");
    }

    const orgId = (session.user as any).orgId;

    const name = formData
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
        "Crew member name is required."
      );
    }

    if (!role) {
      throw new Error(
        "Crew role is required."
      );
    }

    if (email) {

      const existing =
        await prisma.crewMember.findFirst({

          where: {
            orgId,
            email,
          },

        });

      if (existing) {
        throw new Error(
          "A crew member with this email already exists."
        );
      }

    }

    await prisma.crewMember.create({

      data: {

        orgId,

        name,

        email,

        phone,

        role,

        active,

      },

    });

    redirect("/crew");
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
            Add Crew Member
          </h1>

          <p className="mt-2 text-slate-600">
            Create a new crew member for your organization.
          </p>

        </div>

        <Link
          href="/crew"
          className="rounded-xl border border-slate-300 px-5 py-3 font-medium hover:bg-slate-50"
        >
          Back
        </Link>

      </div>

      <form
        action={createCrew}
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
                placeholder="John Smith"
                className="w-full rounded-xl border px-4 py-3 focus:border-orange-500 focus:outline-none"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Role
              </label>

              <select
                name="role"
                required
                className="w-full rounded-xl border px-4 py-3 focus:border-orange-500 focus:outline-none"
              >

                <option value="">
                  Select Role
                </option>

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
                placeholder="john@example.com"
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
                placeholder="+1 555 123 4567"
                className="w-full rounded-xl border px-4 py-3 focus:border-orange-500 focus:outline-none"
              />

            </div>
                        <div>

              <label className="mb-2 block text-sm font-medium">
                Status
              </label>

              <select
                name="active"
                defaultValue="true"
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
            Summary
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
                • Inactive crew members remain in history but cannot be assigned to new jobs.
              </li>

            </ul>

          </div>

        </div>

        <div className="flex items-center justify-end gap-4">

          <Link
            href="/crew"
            className="rounded-xl border border-slate-300 px-6 py-3 font-medium hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="rounded-xl bg-orange-500 px-6 py-3 font-medium text-white hover:bg-orange-600"
          >
            Create Crew Member
          </button>

        </div>

      </form>

    </div>

  );

}