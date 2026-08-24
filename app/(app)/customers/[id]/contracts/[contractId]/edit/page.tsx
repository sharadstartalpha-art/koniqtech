import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import {
  notFound,
  redirect
} from "next/navigation"

export const dynamic = "force-dynamic"

async function updateContract(
  formData: FormData
) {

  "use server"

  const session =
    await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const orgId =
    session.user.orgId

  if (!orgId) {
    redirect("/welcome")
  }

  const customerId =
    String(
      formData.get("customerId")
    )

  const contractId =
    String(
      formData.get("contractId")
    )

  await prisma.contract.update({

    where: {
      id: contractId
    },

    data: {

      title:
        String(
          formData.get("title") || ""
        ),

      contractNumber:
        String(
          formData.get("contractNumber") || ""
        ) || null,

      contractType:
        String(
          formData.get("contractType") || ""
        ) || null,

      status:
        String(
          formData.get("status") || "draft"
        ),

      description:
        String(
          formData.get("description") || ""
        ) || null,

      value:
        formData.get("value")
          ? Number(
              formData.get("value")
            )
          : null,

      startDate:
        formData.get("startDate")
          ? new Date(
              String(
                formData.get("startDate")
              )
            )
          : null,

      endDate:
        formData.get("endDate")
          ? new Date(
              String(
                formData.get("endDate")
              )
            )
          : null,

      renewalDate:
        formData.get("renewalDate")
          ? new Date(
              String(
                formData.get("renewalDate")
              )
            )
          : null

    }

  })

  redirect(
    `/customers/${customerId}/contracts/${contractId}`
  )

}

export default async function Page({

  params

}:{

  params:Promise<{
    id:string
    contractId:string
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

  const {
    id,
    contractId
  } = await params

  const contract =
    await prisma.contract.findFirst({

      where:{
        id:contractId,
        customerId:id,
        orgId
      }

    })

  if(!contract){
    notFound()
  }

  return(

    <form
      action={updateContract}
      className="max-w-4xl mx-auto space-y-8"
    >

      <input
        type="hidden"
        name="customerId"
        value={id}
      />

      <input
        type="hidden"
        name="contractId"
        value={contract.id}
      />

      <div>

        <h1 className="text-4xl font-bold">

          Edit Contract

        </h1>

        <p className="text-slate-500 mt-2">

          Update contract details.

        </p>

      </div>

      <div className="bg-white border rounded-3xl p-8 space-y-6">

        <div className="grid md:grid-cols-2 gap-5">

          <div>

            <label className="block mb-2 font-medium">
              Title
            </label>

            <input
              name="title"
              defaultValue={contract.title}
              required
              className="w-full border rounded-xl p-4"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Contract Number
            </label>

            <input
              name="contractNumber"
              defaultValue={
                contract.contractNumber ?? ""
              }
              className="w-full border rounded-xl p-4"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Contract Type
            </label>

            <input
              name="contractType"
              defaultValue={
                contract.contractType ?? ""
              }
              className="w-full border rounded-xl p-4"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Status
            </label>

            <select
              name="status"
              defaultValue={contract.status}
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

          <div>

            <label className="block mb-2 font-medium">
              Contract Value
            </label>

            <input
              type="number"
              step="0.01"
              name="value"
              defaultValue={
                contract.value ?? ""
              }
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
              defaultValue={
                contract.startDate
                  ?.toISOString()
                  .split("T")[0]
              }
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
              defaultValue={
                contract.endDate
                  ?.toISOString()
                  .split("T")[0]
              }
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
              defaultValue={
                contract.renewalDate
                  ?.toISOString()
                  .split("T")[0]
              }
              className="w-full border rounded-xl p-4"
            />

          </div>

        </div>

        <div>

          <label className="block mb-2 font-medium">
            Description
          </label>

          <textarea
            name="description"
            rows={6}
            defaultValue={
              contract.description ?? ""
            }
            className="w-full border rounded-xl p-4"
          />

        </div>

      </div>

      <div className="flex gap-4">

        <button
          type="submit"
          className="
          bg-orange-600
          hover:bg-orange-700
          text-white
          px-8
          py-4
          rounded-2xl
          "
        >
          Save Changes
        </button>

        <a
          href={`/customers/${id}/contracts/${contract.id}`}
          className="
          border
          px-8
          py-4
          rounded-2xl
          hover:bg-slate-50
          "
        >
          Cancel
        </a>

      </div>

    </form>

  )

}