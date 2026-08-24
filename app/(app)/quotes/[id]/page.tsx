import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import Link from "next/link"
import {
  notFound,
  redirect
} from "next/navigation"

export const dynamic = "force-dynamic"

export default async function QuotePage({
  params
}:{
  params:Promise<{
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

  const quote =
    await prisma.quote.findFirst({

      where:{
        id,
        orgId
      },

      include:{

        customer:true,

        items:{

          orderBy:{
            itemName:"asc"
          }

        }

      }

    })

  if(!quote){
    notFound()
  }

  return(

    <div className="space-y-8">

      <div className="flex items-start justify-between">

        <div>

          <Link
            href="/quotes"
            className="text-slate-500 hover:text-orange-600"
          >
            ← Back to Quotes
          </Link>

          <h1 className="text-5xl font-bold mt-4">
            {quote.quoteNumber}
          </h1>

          <p className="text-slate-500 mt-2">
            Quote Details
          </p>

        </div>

        <div className="flex gap-3">

          <Link
            href={`/quotes/${quote.id}/pdf`}
            className="
            border
            rounded-xl
            px-5
            py-3
            hover:bg-slate-50
            "
          >
            PDF
          </Link>

          <Link
            href={`/quotes/${quote.id}/edit`}
            className="
            bg-orange-600
            hover:bg-orange-700
            text-white
            rounded-xl
            px-5
            py-3
            "
          >
            Edit Quote
          </Link>

        </div>

      </div>

      <div className="grid lg:grid-cols-2 gap-8">

        <div className="bg-white border rounded-3xl p-8">

          <h2 className="text-2xl font-bold mb-6">
            Quote Information
          </h2>

          <div className="space-y-5">

            <div className="flex justify-between">

              <span className="text-slate-500">
                Quote Number
              </span>

              <span className="font-semibold">
                {quote.quoteNumber}
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-slate-500">
                Status
              </span>

              <span className="
              bg-green-100
              text-green-700
              rounded-full
              px-3
              py-1
              text-sm
              capitalize
              ">
                {quote.status}
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-slate-500">
                Created
              </span>

              <span>
                {quote.createdAt.toLocaleDateString()}
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-slate-500">
                Valid Until
              </span>

              <span>

                {quote.validUntil
                  ? quote.validUntil.toLocaleDateString()
                  : "-"}

              </span>

            </div>

          </div>

        </div>

        <div className="bg-white border rounded-3xl p-8">

          <h2 className="text-2xl font-bold mb-6">
            Customer
          </h2>

          <div className="space-y-4">

            <div>

              <div className="font-semibold text-lg">

                {quote.customer.companyName ||

                  `${quote.customer.firstName} ${quote.customer.lastName ?? ""}`}

              </div>

            </div>

            <div>

              {quote.customer.email || "-"}

            </div>

            <div>

              {quote.customer.phone || "-"}

            </div>

            <div>

              {quote.customer.address || "-"}

            </div>

          </div>

        </div>

      </div>

      <div className="bg-white border rounded-3xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-50">

            <tr>

              <th className="text-left p-5">
                Item
              </th>

              <th className="text-left p-5">
                Qty
              </th>

              <th className="text-left p-5">
                Unit Price
              </th>

              <th className="text-right p-5">
                Total
              </th>

            </tr>

          </thead>

          <tbody>

            {quote.items.map(item=>(

              <tr
                key={item.id}
                className="border-t"
              >

                <td className="p-5">

                  {item.itemName}

                </td>

                <td className="p-5">

                  {item.qty}

                </td>

                <td className="p-5">

                  $
                  {Number(item.price).toLocaleString()}

                </td>

                <td className="p-5 text-right font-semibold">

                  $
                  {Number(item.total).toLocaleString()}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <div className="flex justify-end">

        <div className="
        w-full
        max-w-md
        bg-white
        border
        rounded-3xl
        p-8
        ">

          <div className="flex justify-between py-3">

            <span>
              Subtotal
            </span>

            <span>

              $

              {Number(
                quote.subtotal
              ).toLocaleString()}

            </span>

          </div>

          <div className="flex justify-between py-3">

            <span>
              Tax
            </span>

            <span>

              $

              {Number(
                quote.tax
              ).toLocaleString()}

            </span>

          </div>

          <hr className="my-5"/>

          <div className="flex justify-between text-2xl font-bold">

            <span>
              Total
            </span>

            <span className="text-orange-600">

              $

              {Number(
                quote.total
              ).toLocaleString()}

            </span>

          </div>

        </div>

      </div>

    </div>

  )

}