import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function CompanyPage({
  searchParams,
}: {
  searchParams: Promise<{
    saved?: string
  }>
}) {

  const params = await searchParams
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

async function saveCompany(
  formData: FormData
) {
  "use server"

  await prisma.organization.update({
    where: {
      id: orgId,
    },
    data: {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      website: formData.get("website") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      country: formData.get("country") as string,
      postalCode: formData.get("postalCode") as string,
    },
  })

  revalidatePath("/settings/company")

  redirect("/settings/company?saved=1")
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


{params.saved && (

  <div
    className="
    p-4
    rounded-xl
    bg-green-100
    text-green-700
    border
    "
  >
    Company information updated successfully.
  </div>

)}


     <form
  action={saveCompany}
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
  value={organization.email ?? ""}
  readOnly
  disabled
  className="w-full rounded-xl border bg-slate-100 text-slate-500 p-4 cursor-not-allowed"
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