import Link from "next/link"
import prisma from "@/shared/lib/prisma"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"
import { auth } from "@/auth"

async function createUser(
  formData: FormData
) {
  "use server"

  const name =
    formData.get("name") as string

  const email =
    formData.get("email") as string

  const password =
    formData.get("password") as string

  const role =
    formData.get("role") as string

  const status =
    formData.get("status") as string

  
  if (
    !name ||
    !email ||
    !password
  ) {
    throw new Error(
      "Missing required fields"
    )
  }

  const existing =
    await prisma.user.findUnique({
      where: {
        email
      }
    })

  if (existing) {
    throw new Error(
      "Email already exists"
    )
  }

  const passwordHash =
    await bcrypt.hash(
      password,
      10
    )

const session = await auth()

const orgId =
  session?.user?.orgId

if (!orgId) {
  throw new Error(
    "Organization not found"
  )
}

await prisma.user.create({
  data: {
    orgId,
    name,
    email,
    passwordHash,
    role: role as any,
    status
  }
})


 

  redirect("/settings/team")
}

export default function NewTeamMemberPage() {

  return (

    <div className="max-w-4xl mx-auto">

      <div className="mb-8">

        <Link
          href="/settings/team"
          className="
          text-sm
          text-slate-500
          hover:text-slate-900
          "
        >
          ← Back to Team
        </Link>

        <h1 className="text-4xl font-bold mt-4">
          Add Team Member
        </h1>

        <p className="text-slate-500 mt-2">
          Create a new user account
        </p>

      </div>

      <form
        action={createUser}
        className="
        bg-white
        border
        rounded-3xl
        p-8
        space-y-6
        "
      >

        <div>

          <label className="block mb-2 font-medium">
            Full Name
          </label>

          <input
            name="name"
            required
            placeholder="John Smith"
            className="
            w-full
            h-12
            px-4
            rounded-xl
            border
            "
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
            className="
            w-full
            h-12
            px-4
            rounded-xl
            border
            "
          />

        </div>

        <div>

          <label className="block mb-2 font-medium">
            Password
          </label>

          <input
            type="password"
            name="password"
            required
            placeholder="Minimum 8 characters"
            className="
            w-full
            h-12
            px-4
            rounded-xl
            border
            "
          />

        </div>

        <div className="grid grid-cols-2 gap-6">

          <div>

            <label className="block mb-2 font-medium">
              Role
            </label>

            <select
              name="role"
              className="
              w-full
              h-12
              px-4
              rounded-xl
              border
              "
            >

              <option value="owner">
                Owner
              </option>

              <option value="admin">
                Admin
              </option>

              <option value="manager">
                Manager
              </option>

              <option value="sales">
                Sales
              </option>

              <option value="support">
                Support
              </option>

              <option value="accountant">
                Accountant
              </option>

              <option value="technician">
                Technician
              </option>

            </select>

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Status
            </label>

            <select
              name="status"
              className="
              w-full
              h-12
              px-4
              rounded-xl
              border
              "
            >

              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>

            </select>

          </div>

        </div>

        <div className="pt-4 flex gap-3">

          <button
            type="submit"
            className="
            px-6
            py-3
            bg-orange-600
            text-white
            rounded-xl
            font-medium
            hover:bg-orange-700
            "
          >
            Create User
          </button>

          <Link
            href="/settings/team"
            className="
            px-6
            py-3
            border
            rounded-xl
            font-medium
            "
          >
            Cancel
          </Link>

        </div>

      </form>

    </div>

  )
}