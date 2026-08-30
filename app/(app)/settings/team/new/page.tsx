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

 const organizationRoleId =
  formData.get("organizationRoleId") as string

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




const organization = await prisma.organization.findUnique({
  where: {
    id: orgId,
  },
  select: {
  usersLimit: true,
  plan: true,
},
})

if (!organization) {
  throw new Error("Organization not found")
}

const currentUsers = await prisma.user.count({
  where: {
    orgId,
  },
})

if (
  session?.user?.role !== "super_admin" &&
  organization &&
  currentUsers >= organization.usersLimit
) {
  throw new Error(
    `Your current plan allows only ${organization.usersLimit} team members. Please upgrade your subscription to add more users.`
  )
}

await prisma.user.create({
  data: {
    orgId,
    name,
    email,
    passwordHash,
    organizationRoleId,
    status,
  },
})
redirect("/settings/team")

}

export default async function NewTeamMemberPage() {

const session = await auth()

const orgId = session?.user?.orgId

if (!orgId) {
  redirect("/login")
}


const organization = await prisma.organization.findUnique({
  where: {
    id: orgId,
  },
  select: {
  usersLimit: true,
  plan: true,
},
})

if (!organization) {
  redirect("/login")
}

const currentUsers = await prisma.user.count({
  where: {
    orgId,
  },
})

const limitReached =
  session.user.role !== "super_admin" &&
  currentUsers >= (organization?.usersLimit ?? 5)

if (limitReached) {
  return (
    <div className="max-w-2xl mx-auto rounded-3xl border bg-white p-10">

      <h1 className="text-3xl font-bold">
        Team Member Limit Reached
      </h1>

      <p className="mt-4 text-slate-600">
  Team Members Used
</p>

<p className="mt-2 text-3xl font-bold">
  {currentUsers} / {organization.usersLimit}
</p>

<p className="mt-2 text-slate-600">
  Current Plan:
  <strong className="ml-2 capitalize">
    {organization.plan}
  </strong>
</p>

<p className="mt-4 text-slate-600">
  You've reached the maximum number of team members for your current subscription.
</p>

      <p className="mt-2 text-slate-600">
        Upgrade your plan to add more employees.
      </p>

      <Link
        href="/billing/plans"
        className="mt-8 inline-flex rounded-xl bg-orange-600 px-6 py-3 text-white hover:bg-orange-700"
      >
        Upgrade Plan
      </Link>

    </div>
  )
}


const roles = await prisma.organizationRole.findMany({
  where: {
    orgId,
    active: true,
  },
  orderBy: {
    name: "asc",
  },
})
  
if (roles.length === 0) {
  return (
    <div className="max-w-2xl mx-auto bg-white border rounded-3xl p-8">

      <h1 className="text-3xl font-bold">
        No Roles Found
      </h1>

      <p className="mt-3 text-slate-500">
        Create at least one role before inviting team members.
      </p>

      <Link
        href="/settings/roles/new"
        className="
        inline-block
        mt-6
        px-6
        py-3
        bg-orange-600
        text-white
        rounded-xl
        hover:bg-orange-700
        "
      >
        + Create Role
      </Link>

    </div>
  )
}



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

            <p className="text-sm text-slate-500 mb-2">
  Select the role that determines this user's permissions.
</p>
<select
  name="organizationRoleId"
  className="
    w-full
    h-12
    px-4
    rounded-xl
    border
  "
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


<div className="mt-2">

  <Link
    href="/settings/roles/new"
    className="
    text-sm
    text-orange-600
    hover:underline
    "
  >
    + Create another role
  </Link>

</div>

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