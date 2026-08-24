import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"

async function createContract(
  formData: FormData
) {

  "use server"

  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const orgId = session.user.orgId

  if (!orgId) {
    redirect("/welcome")
  }

  const customerId =
    String(formData.get("customerId"))

  const title =
    String(formData.get("title") || "").trim()

  if (!title) {
    throw new Error("Contract title is required.")
  }

  await prisma.contract.create({

    data: {

      orgId,

      customerId,

      contractNumber:
        String(formData.get("contractNumber") || "") || null,

      title,

      description:
        String(formData.get("description") || "") || null,

      contractType:
        String(formData.get("contractType") || "") || null,

      startDate:
        formData.get("startDate")
          ? new Date(String(formData.get("startDate")))
          : null,

      endDate:
        formData.get("endDate")
          ? new Date(String(formData.get("endDate")))
          : null,

      renewalDate:
        formData.get("renewalDate")
          ? new Date(String(formData.get("renewalDate")))
          : null,

      value:
        formData.get("value")
          ? Number(formData.get("value"))
          : null,

      status:
        String(formData.get("status") || "draft")

    }

  })

  redirect(`/customers/${customerId}/contracts`)

}

export default async function Page({

  params

}:{

  params: Promise<{
    id:string
  }>

}){

  const session =
    await auth()

  if(!session?.user){
    redirect("/login")
  }

  const orgId =
    session.user.orgId

  if(!orgId){
    redirect("/welcome")
  }

  const { id } =
    await params

  const customer =
    await prisma.customer.findFirst({

      where:{
        id,
        orgId
      }

    })

  if(!customer){
    notFound()
  }

  return(

    <form
      action={createContract}
      className="max-w-4xl space-y-8"
    >

      <input
        type="hidden"
        name="customerId"
        value={customer.id}
      />

      <div>

        <h1 className="text-4xl font-bold">

          New Contract

        </h1>

        <p className="text-slate-500 mt-2">

          Create a contract for {customer.firstName} {customer.lastName}

        </p>

      </div>

      <div className="bg-white border rounded-3xl p-8 space-y-6">

        <div className="grid md:grid-cols-2 gap-5">

          <div>

            <label className="block mb-2 font-medium">

              Contract Number

            </label>

            <input
              name="contractNumber"
              className="w-full border rounded-xl p-4"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">

              Status

            </label>

            <select
              name="status"
              defaultValue="draft"
              className="w-full border rounded-xl p-4"
            >

              <option value="draft">
                Draft
              </option>

              <option value="active">
                Active
              </option>

              <option value="expired">
                Expired
              </option>

              <option value="cancelled">
                Cancelled
              </option>

            </select>

          </div>

          <div className="md:col-span-2">

            <label className="block mb-2 font-medium">

              Title *

            </label>

            <input
              required
              name="title"
              className="w-full border rounded-xl p-4"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">

              Contract Type

            </label>

            <input
              name="contractType"
              placeholder="AMC, Service, Warranty..."
              className="w-full border rounded-xl p-4"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">

              Contract Value

            </label>

            <input
              type="number"
              step="0.01"
              name="value"
              className="w-full border rounded-xl p-4"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">

              Start Date

            </label>

            <input
              type="date"
              name="startDate"
              className="w-full border rounded-xl p-4"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">

              End Date

            </label>

            <input
              type="date"
              name="endDate"
              className="w-full border rounded-xl p-4"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">

              Renewal Date

            </label>

            <input
              type="date"
              name="renewalDate"
              className="w-full border rounded-xl p-4"
            />

          </div>

        </div>

        <div>

          <label className="block mb-2 font-medium">

            Description

          </label>

          <textarea
            rows={5}
            name="description"
            className="w-full border rounded-xl p-4"
          />

        </div>

      </div>

      <div className="flex gap-4">

        <button
          type="submit"
          className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-2xl"
        >

          Create Contract

        </button>

        <a
          href={`/customers/${customer.id}/contracts`}
          className="border px-8 py-4 rounded-2xl hover:bg-slate-50"
        >

          Cancel

        </a>

      </div>

    </form>

  )

}