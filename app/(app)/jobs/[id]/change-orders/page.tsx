import prisma from "@/shared/lib/prisma"
import { revalidatePath } from "next/cache"
import Link from "next/link"

export default async function Page({ params }:any){

  const { id } = await params

  const orders =
    await prisma.changeOrder.findMany({
      where:{ jobId:id }
    })

  async function create(
    formData:FormData
  ){

    "use server"

    await prisma.changeOrder.create({

      data:{
        jobId:id,
        title:String(formData.get("title")),
        amount:Number(formData.get("amount"))
      }

    })

    revalidatePath(
      `/jobs/${id}/change-orders`
    )
  }

  return(

    <div className="space-y-8">

      <h1 className="text-5xl font-bold">
        Change Orders
      </h1>

      <form
        action={create}
        className="bg-white border rounded-3xl p-6 flex gap-4"
      >

        <input
          name="title"
          placeholder="Title"
          className="flex-1 h-14 border rounded-2xl px-4"
        />

        <input
          name="amount"
          type="number"
          placeholder="Amount"
          className="w-48 h-14 border rounded-2xl px-4"
        />

        <button
          className="px-8 bg-blue-600 text-white rounded-2xl"
        >
          Add
        </button>

      </form>

    </div>

  )

}