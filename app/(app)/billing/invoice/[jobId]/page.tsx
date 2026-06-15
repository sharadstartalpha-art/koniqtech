import prisma from "@/shared/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export default async function Page({
  params
}:{
  params:Promise<{jobId:string}>
}){

  const { jobId } = await params

  const job =
    await prisma.job.findUnique({

      where:{
        id:jobId
      },

      include:{
        customer:true,
        quotes:true
      }

    })

  if(!job){
    notFound()
  }

  const latestQuote =
    job.quotes?.[0]

  async function createInvoice(){

    "use server"

    const existing =
      await prisma.invoice.findFirst({

        where:{
          jobId
        }

      })

    if(existing){
      redirect("/billing")
    }

    await prisma.invoice.create({

      data:{

        orgId:job.orgId,

        customerId:
          job.customerId,

        jobId,

        invoiceNumber:
          `INV-${Date.now()}`,

        subtotal:
          Number(
            latestQuote?.total || 0
          ),

        tax:0,

        total:
          Number(
            latestQuote?.total || 0
          ),

        status:"draft"

      }

    })

    revalidatePath("/billing")

    redirect("/billing")
  }

  return(

    <div className="space-y-8">

      <div>

        <h1 className="text-5xl font-bold">
          Generate Invoice
        </h1>

        <p className="text-slate-500 mt-2">
          Review before creating invoice
        </p>

      </div>

      <div
        className="
        bg-white
        border
        rounded-3xl
        p-8
        "
      >

        <div className="grid md:grid-cols-2 gap-8">

          <div>

            <h2 className="font-semibold text-lg">
              Customer
            </h2>

            <div className="mt-4 space-y-2">

              <div>
                {job.customer?.firstName}
              </div>

              <div>
                {job.customer?.email}
              </div>

              <div>
                {job.customer?.phone}
              </div>

            </div>

          </div>

          <div>

            <h2 className="font-semibold text-lg">
              Job
            </h2>

            <div className="mt-4 space-y-2">

              <div>
                Job ID: {job.id}
              </div>

              <div>
                Status: {job.status}
              </div>

            </div>

          </div>

        </div>

      </div>

      <div
        className="
        bg-white
        border
        rounded-3xl
        p-8
        "
      >

        <h2 className="text-xl font-semibold">
          Invoice Summary
        </h2>

        <div className="mt-6 space-y-4">

          <div className="flex justify-between">

            <span>
              Quote Amount
            </span>

            <span>
              $
              {Number(
                latestQuote?.total || 0
              ).toFixed(2)}
            </span>

          </div>

          <div className="flex justify-between">

            <span>
              Tax
            </span>

            <span>
              $0.00
            </span>

          </div>

          <div className="border-t pt-4 flex justify-between font-bold text-lg">

            <span>
              Total
            </span>

            <span>
              $
              {Number(
                latestQuote?.total || 0
              ).toFixed(2)}
            </span>

          </div>

        </div>

      </div>

      <form action={createInvoice}>

        <button
          className="
          px-8
          py-4
          bg-blue-600
          text-white
          rounded-2xl
          "
        >
          Generate Invoice
        </button>

      </form>

    </div>

  )

}