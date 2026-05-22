import prisma from "@/shared/lib/prisma"
import Link from "next/link"
import { notFound } from "next/navigation"
import { revalidatePath } from "next/cache"

export const dynamic = "force-dynamic"

async function extendSubscription(
  formData: FormData
) {

  "use server"

  const orgId =
    String(
      formData.get("orgId")
    )

  const months =
    Number(
      formData.get("months")
    )

  if (!orgId) return

  const org =
    await prisma.organization.findUnique({

      where: {
        id: orgId
      }

    })

  if (!org) return

  const baseDate =

    org.subscriptionEndsAt &&
      org.subscriptionEndsAt > new Date()

      ? org.subscriptionEndsAt

      : new Date()

  const expires =
    new Date(baseDate)

  expires.setMonth(

    expires.getMonth() + months

  )

  await prisma.organization.update({

    where: {
      id: orgId
    },

    data: {

      subscriptionEndsAt:
        expires,

      active: true

    }

  })

  revalidatePath(

    `/admin/organizations/${orgId}`

  )

}

type Props = {

  params: Promise<{
    id: string
  }>

}

export default async function Page({

  params

}: Props) {

  const { id } =
    await params

  if (!id) {

    notFound()

  }

  const org =
    await prisma.organization.findUnique({

      where: {
        id
      },

      include: {

        users: true

      }

    })

  if (!org) {

    notFound()

  }

  const subscriptionActive =

    org.subscriptionEndsAt &&

    org.subscriptionEndsAt >

    new Date()

  return (

    <div className="max-w-7xl mx-auto p-10 space-y-8">

      <div className="flex justify-between items-start">

        <div>

          <h1 className="text-5xl font-bold">

            {org.name}

          </h1>

          <p className="text-slate-500 mt-2">

            {org.email}

          </p>

        </div>

        <div className="flex gap-4">

          <Link

            href={`/admin/organizations/${id}/users`}

            className="
            border
            px-6
            py-3
            rounded-xl
            "

          >

            Users

          </Link>

          <Link

            href={`/admin/organizations/${id}/billing`}

            className="
            border
            px-6
            py-3
            rounded-xl
            "

          >

            Billing

          </Link>

        </div>

      </div>

      <div className="grid grid-cols-5 gap-6">

        <div className="bg-white border rounded-3xl p-8">

          <p className="text-slate-500">

            CRM

          </p>

          <h2 className="text-2xl font-bold">

            {org.crmType}

          </h2>

        </div>

        <div className="bg-white border rounded-3xl p-8">

          <p className="text-slate-500">

            Plan

          </p>

          <h2 className="text-2xl font-bold">

            {org.plan}

          </h2>

        </div>

        <div className="bg-white border rounded-3xl p-8">

          <p className="text-slate-500">

            Users

          </p>

          <h2 className="text-2xl font-bold">

            {org.users.length}

          </h2>

        </div>

        <div className="bg-white border rounded-3xl p-8">

          <p className="text-slate-500">

            Expires

          </p>

          <h2 className="font-bold">

            {

              org.subscriptionEndsAt

                ?

                org.subscriptionEndsAt
                  .toDateString()

                :

                "No subscription"

            }

          </h2>

        </div>

        <div className="bg-white border rounded-3xl p-8">

          <p className="text-slate-500">

            Status

          </p>

          <h2 className={

            subscriptionActive

              ?

              "font-bold text-green-600"

              :

              "font-bold text-red-600"

          }>

            {

              subscriptionActive

                ?

                "ACTIVE"

                :

                "EXPIRED"

            }

          </h2>

        </div>

      </div>

      <div className="bg-white border rounded-3xl p-8">

        <h2 className="text-3xl font-bold mb-6">

          Grant Subscription

        </h2>

        <form

          action={extendSubscription}

          className="flex gap-4"

        >

          <input

            hidden

            name="orgId"

            value={org.id}

            readOnly

          />

          <select

            name="months"

            className="
            border
            p-4
            rounded-xl
            "

          >

            <option value="1">

              1 month

            </option>

            <option value="3">

              3 months

            </option>

            <option value="6">

              6 months

            </option>

            <option value="12">

              12 months

            </option>

            <option value="24">

              24 months

            </option>

          </select>

          <button

            type="submit"

            className="
            bg-black
            text-white
            px-8
            rounded-xl
            "

          >

            Grant Access

          </button>

        </form>

      </div>

      <div className="bg-white border rounded-3xl overflow-hidden">

        <div className="p-8 border-b">

          <h2 className="text-3xl font-bold">

            Users

          </h2>

        </div>

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="p-5 text-left">

                Name

              </th>

              <th>

                Email

              </th>

              <th>

                Role

              </th>

            </tr>

          </thead>

          <tbody>

            {

              org.users.map(user => (

                <tr

                  key={user.id}

                  className="border-t"

                >

                  <td className="p-5">

                    {user.name}

                  </td>

                  <td>

                    {user.email}

                  </td>

                  <td>

                    {user.role}

                  </td>

                </tr>

              ))

            }

          </tbody>

        </table>

      </div>

    </div>

  )

}