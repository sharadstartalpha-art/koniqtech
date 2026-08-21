import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export default async function Page() {

  const session = await auth()

  if (!session?.user) {
    redirect("/signin")
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id!,
    },
  })

  if (!user) {
    redirect("/signin")
  }

  async function saveProfile(formData: FormData) {
    "use server"

    const session = await auth()

    if (!session?.user) {
      redirect("/signin")
    }

    const name = String(formData.get("name"))
    const email = String(formData.get("email"))

    await prisma.user.update({
      where: {
        id: session.user.id!,
      },
      data: {
        name,
        email,
      },
    })

    revalidatePath("/profile")
  }

  return (

    <div className="max-w-4xl space-y-8">

      <div>

        <h1 className="text-4xl font-bold">
          Profile Settings
        </h1>

        <p className="text-slate-500 mt-2">
          Update your personal information.
        </p>

      </div>

      <form
        action={saveProfile}
        className="
        bg-white
        border
        rounded-3xl
        p-8
        space-y-6
        "
      >

        <div>

          <label className="block text-sm mb-2">
            Full Name
          </label>

          <input
            name="name"
            defaultValue={user.name ?? ""}
            className="
            w-full
            h-12
            border
            rounded-xl
            px-4
            "
          />

        </div>

        <div>

          <label className="block text-sm mb-2">
            Email Address
          </label>

          <input
            name="email"
            type="email"
            defaultValue={user.email ?? ""}
            className="
            w-full
            h-12
            border
            rounded-xl
            px-4
            "
          />

        </div>

        <div>

          <label className="block text-sm mb-2">
            Profile Photo
          </label>

          <input
            type="file"
            disabled
            className="
            w-full
            h-12
            border
            rounded-xl
            px-3
            py-2
            bg-slate-50
            "
          />

          <p className="text-sm text-slate-500 mt-2">
            Profile photo upload coming soon.
          </p>

        </div>

        <button
          className="
          h-12
          px-8
          bg-orange-600
          text-white
          rounded-xl
          "
        >
          Save Profile
        </button>

      </form>

    </div>

  )

}