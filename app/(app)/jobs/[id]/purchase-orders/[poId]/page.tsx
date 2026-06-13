import prisma from "@/shared/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"

export default async function Page({
  params
}:any){

  const {
    id,
    poId
  } = await params

  const order =
    await prisma.purchaseOrder.findUnique({
      where:{ id:poId }
    })

  if(!order){
    notFound()
  }

  async function save(
    formData:FormData
  ){

    "use server"

    await prisma.purchaseOrder.update({

      where:{
        id:poId
      },

      data:{
        vendor:String(formData.get("vendor")),
        amount:Number(formData.get("amount")),
        status:String(formData.get("status"))
      }

    })

    revalidatePath(`/jobs/${id}/purchase-orders`)

    redirect(`/jobs/${id}/purchase-orders`)
  }

  return(

    <div className="space-y-8">

      <h1 className="text-5xl font-bold">
        Edit Purchase Order
      </h1>

      <form
        action={save}
        className="bg-white border rounded-3xl p-8 space-y-5"
      >

        <input
          name="vendor"
          defaultValue={order.vendor}
          className="w-full h-14 border rounded-2xl px-4"
        />

        <input
          name="amount"
          type="number"
          defaultValue={order.amount}
          className="w-full h-14 border rounded-2xl px-4"
        />

        <select
          name="status"
          defaultValue={order.status}
          className="w-full h-14 border rounded-2xl px-4"
        >
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="approved">Approved</option>
        </select>

        <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl">
          Save Changes
        </button>

      </form>

    </div>

  )

}