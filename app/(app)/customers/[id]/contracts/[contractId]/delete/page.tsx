import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import Link from "next/link"
import {
  notFound,
  redirect
} from "next/navigation"

export const dynamic = "force-dynamic"

async function deleteContract(
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

  await prisma.contract.delete({

    where: {
      id: contractId
    }

  })

  redirect(
    `/customers/${customerId}/contracts`
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
      },

      include:{
        customer:true
      }

    })

  if(!contract){
    notFound()
  }

  return(

    <div className="max-w-2xl mx-auto">

      <form
        action={deleteContract}
        className="
        bg-white
        border
        rounded-3xl
        p-10
        shadow-sm
        space-y-8
        "
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

          <h1 className="
          text-4xl
          font-bold
          text-red-600
          ">
            Delete Contract
          </h1>

          <p className="text-slate-500 mt-3">

            You are about to permanently delete this
            contract. This action cannot be undone.

          </p>

        </div>

        <div className="
        rounded-2xl
        bg-red-50
        border
        border-red-200
        p-6
        ">

          <p>

            <strong>Title:</strong>{" "}

            {contract.title}

          </p>

          <p className="mt-3">

            <strong>Contract Number:</strong>{" "}

            {contract.contractNumber || "-"}

          </p>

          <p className="mt-3">

            <strong>Customer:</strong>{" "}

            {contract.customer.firstName}{" "}
            {contract.customer.lastName}

          </p>

          <p className="mt-3">

            <strong>Status:</strong>{" "}

            {contract.status}

          </p>

          <p className="mt-3">

            <strong>Contract Type:</strong>{" "}

            {contract.contractType || "-"}

          </p>

        </div>

        <div className="flex gap-4">

          <button
            type="submit"
            className="
            bg-red-600
            hover:bg-red-700
            text-white
            px-8
            py-4
            rounded-2xl
            "
          >
            Delete Contract
          </button>

          <Link
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
          </Link>

        </div>

      </form>

    </div>

  )

}