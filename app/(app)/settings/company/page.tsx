import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/shared/lib/prisma";

export default async function CompanyPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const orgId = (session.user as any).orgId;

  const organization = await prisma.organization.findUnique({
    where: {
      id: orgId,
    },
  });

  if (!organization) {
    redirect("/welcome");
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold">
          Company Information
        </h1>

        <p className="text-slate-500 mt-2">
          Manage your business profile.
        </p>
      </div>

      <form
        action="/api/settings/company"
        method="POST"
        className="bg-white border rounded-3xl p-8 space-y-6"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-slate-500 mb-2">
              Company Name
            </label>

            <input
              name="name"
              defaultValue={organization.name}
              className="w-full rounded-xl border p-4"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-500 mb-2">
              Email
            </label>

            <input
    defaultValue={organization.email ?? ""}
    readOnly
    className="
        w-full
        rounded-xl
        border
        bg-slate-50
        text-slate-500
        p-4
    "
/>
          </div>

          <div>
            <label className="block text-sm text-slate-500 mb-2">
              Phone
            </label>

            <input
              name="phone"
              defaultValue={organization.phone ?? ""}
              className="w-full rounded-xl border p-4"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-500 mb-2">
              Website
            </label>

            <input
              name="website"
              defaultValue={organization.website ?? ""}
              className="w-full rounded-xl border p-4"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-slate-500 mb-2">
              Address
            </label>

            <input
              name="address"
              defaultValue={organization.address ?? ""}
              className="w-full rounded-xl border p-4"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-500 mb-2">
              City
            </label>

            <input
              name="city"
              defaultValue={organization.city ?? ""}
              className="w-full rounded-xl border p-4"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-500 mb-2">
              State
            </label>

            <input
              name="state"
              defaultValue={organization.state ?? ""}
              className="w-full rounded-xl border p-4"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-500 mb-2">
              Country
            </label>

            <input
              name="country"
              defaultValue={organization.country ?? ""}
              className="w-full rounded-xl border p-4"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-500 mb-2">
              Postal Code
            </label>

            <input
              name="postalCode"
              defaultValue={organization.postalCode ?? ""}
              className="w-full rounded-xl border p-4"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-orange-600 text-white hover:bg-orange-700 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}