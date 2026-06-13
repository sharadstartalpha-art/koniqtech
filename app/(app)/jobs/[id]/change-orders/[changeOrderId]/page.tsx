import prisma from "@/shared/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect, notFound } from "next/navigation"

export default async function Page({
  params
}:any){

  const {
    id,
    changeOrderId
  } = await params

  const order =
    await prisma.changeOrder.findUnique({
      where:{
        id:changeOrderId
      }
    })

  if(!order){
    notFound()
  }

  async function save(
    formData:FormData
  ){

    "use server"

    await prisma.changeOrder.update({

      where:{
        id:changeOrderId
      },

      data:{
        title:String(formData.get("title")),
        amount:Number(formData.get("amount")),
        status:String(formData.get("status"))
      }

    })

    revalidatePath(`/jobs/${id}/change-orders`)

    redirect(`/jobs/${id}/change-orders`)
  }

  return(

    <div className="space-y-8">

      <h1 className="text-5xl font-bold">
        Edit Change Order
      </h1>

      <form
        action={save}
        className="bg-white border rounded-3xl p-8 space-y-5"
      >

        <input
          name="title"
          defaultValue={order.title}
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
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl">
          Save Changes
        </button>

      </form>

    </div>

  )

}