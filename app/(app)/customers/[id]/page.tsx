import prisma from "@/shared/lib/prisma"
import Link from "next/link"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function Page({
  params
}: any) {

  const customer =
    await prisma.customer.findUnique({

      where:{
        id:params.id
      },

      include:{

        quotes:{
          orderBy:{
            createdAt:"desc"
          },
          take:5
        },

        jobs:{
          take:5
        },

        invoices:{
          take:5
        }

      }

    })

  if(!customer){
    notFound()
  }

  return(

    <div className="space-y-8">

      <div className="flex items-start justify-between">

        <div>

          <h1 className="text-5xl font-bold">

            {customer.firstName} {customer.lastName}

          </h1>

          <p className="text-slate-500 mt-2">

            {customer.email}

          </p>

        </div>

        <div className="flex gap-3">

          <Link
  href={`/quotes/create?customerId=${customer.id}`}
  className="
  px-5
  py-3
  rounded-xl
  bg-blue-600
  text-white
  "
>
  Create Quote
</Link>

          <Link
            href={`/customers/${customer.id}/timeline`}
            className="
            border
            px-5
            py-3
            rounded-xl
            "
          >
            Timeline
          </Link>

          <Link
            href={`/customers/${customer.id}/notes`}
            className="
            border
            px-5
            py-3
            rounded-xl
            "
          >
            Notes
          </Link>

        </div>

      </div>

      <div className="grid grid-cols-4 gap-6">

        <div className="bg-white border rounded-3xl p-6">

          <p className="text-slate-500 text-sm">
            Quotes
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {customer.quotes.length}
          </h2>

        </div>

        <div className="bg-white border rounded-3xl p-6">

          <p className="text-slate-500 text-sm">
            Jobs
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {customer.jobs.length}
          </h2>

        </div>

        <div className="bg-white border rounded-3xl p-6">

          <p className="text-slate-500 text-sm">
            Invoices
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {customer.invoices.length}
          </h2>

        </div>

        <div className="bg-white border rounded-3xl p-6">

          <p className="text-slate-500 text-sm">
            Phone
          </p>

          <h2 className="text-xl font-bold mt-2">
            {customer.phone || "-"}
          </h2>

        </div>

      </div>

      <div className="grid grid-cols-3 gap-6">

        <div className="bg-white border rounded-3xl p-6">

          <h2 className="font-bold mb-5">

            Customer Information

          </h2>

          <div className="space-y-3">

            <p>
              <strong>Name:</strong>{" "}
              {customer.firstName} {customer.lastName}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {customer.email}
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              {customer.phone}
            </p>

            <p>
              <strong>Company:</strong>{" "}
              {customer.companyName}
            </p>

            <p>
              <strong>Address:</strong>{" "}
              {customer.address}
            </p>

          </div>

        </div>

        <div className="bg-white border rounded-3xl p-6">

          <h2 className="font-bold mb-5">

            Recent Quotes

          </h2>

          <div className="space-y-3">

            {customer.quotes.map(q=>(

              <Link
                key={q.id}
                href={`/quotes/${q.id}`}
                className="
                block
                border
                rounded-xl
                p-3
                "
              >

                {q.quoteNumber}

              </Link>

            ))}

          </div>

        </div>

        <div className="bg-white border rounded-3xl p-6">

          <h2 className="font-bold mb-5">

            Recent Jobs

          </h2>

          <div className="space-y-3">

            {customer.jobs.map(job=>(

              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="
                block
                border
                rounded-xl
                p-3
                "
              >

                {job.title}

              </Link>

            ))}

          </div>

        </div>

      </div>

    </div>

  )

}