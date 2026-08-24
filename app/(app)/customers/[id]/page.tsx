import prisma from "@/shared/lib/prisma"
import Link from "next/link"
import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"


export const dynamic = "force-dynamic"

export default async function Page({
  params
}: {
  params: Promise<{ id: string }>
}) {

  const session = await auth()

if (!session?.user) {
  redirect("/login")
}

const orgId = session.user.orgId

if (!orgId) {
  redirect("/welcome")
}
  const { id } = await params

const customer =
await prisma.customer.findFirst({

  where:{
    id,
    orgId
  },

  include:{

    quotes:{
      orderBy:{
        createdAt:"desc"
      },
      take:5
    },

    jobs:{
      orderBy:{
        createdAt:"desc"
      },
      take:5
    },

    invoices:{
      orderBy:{
        createdAt:"desc"
      },
      take:5
    }

  }

})

  if (!customer) {
    notFound()
  }

  return(

    <div className="space-y-8">

      <div className="flex items-start justify-between">

        <div>

         <Link
href="/customers"
className="
inline-flex
items-center
gap-2
text-slate-500
hover:text-orange-600
mb-5
"
>
← Back to Customers
</Link>
          <h1 className="text-5xl font-bold">

            {customer.firstName} {customer.lastName}

          </h1>

          <p className="text-slate-500 mt-2">

            {customer.email}

          </p>

<p className="text-slate-500">
{customer.companyName || "No Company"}
</p>
        </div>




        <div className="flex gap-3">

          <Link
href={`/customers/edit/${customer.id}`}
className="
border
px-5
py-3
rounded-xl
bg-white
hover:bg-slate-50
"
>
Edit
</Link>

<Link
href={`/customers/${customer.id}/delete`}
className="
border
border-red-200
text-red-600
px-5
py-3
rounded-xl
hover:bg-red-50
"
>
Delete
</Link>

          <Link
            href={`/quotes/create?customerId=${customer.id}`}
            className="
            bg-blue-600
            text-white
            px-5
            py-3
            rounded-xl
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
            Customer Since
          </p>

          <h2 className="text-xl font-bold mt-2">
           {customer.createdAt.toLocaleDateString()}
          </h2>


         <p>
<strong>Status:</strong>{" "}
{customer.status}
</p>

<p>
<strong>Source:</strong>{" "}
{customer.source}
</p>

<p>
<strong>Customer ID:</strong>{" "}
{customer.id.slice(0,8)}
</p>
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

{customer.quotes.length === 0 ? (

  <p className="text-slate-500">
    No quotes yet.
  </p>

) : (

  customer.quotes.map((q) => (

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

  ))

)}
          </div>

        </div>

        <div className="bg-white border rounded-3xl p-6">

          <h2 className="font-bold mb-5">

            Recent Jobs

          </h2>

          <div className="space-y-3">

{customer.jobs.length===0 ? (

<p className="text-slate-500">
No jobs yet.
</p>

) : (

  customer.jobs.map((job) => (

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

  ))

)}
          </div>

        </div>



<div className="bg-white border rounded-3xl p-6">

  <h3 className="text-xl font-semibold">
    Customer Files
  </h3>

  <p className="text-slate-500 mt-2">
    Upload contracts, photos, invoices and documents.
  </p>

  <div className="mt-6 flex gap-3">

    <Link
      href={`/customers/${customer.id}/files`}
      className="px-5 py-3 rounded-xl border hover:bg-slate-50"
    >
      View Files
    </Link>

    <Link
      href={`/customers/${customer.id}/files/upload`}
      className="px-5 py-3 rounded-xl bg-orange-600 text-white"
    >
      Upload File
    </Link>

  </div>

</div>

<div className="bg-white border rounded-3xl p-6">

<h2 className="font-bold mb-5">
Recent Invoices
</h2>

<div className="space-y-3">

{customer.invoices.length===0 ? (

<p className="text-slate-500">
No invoices yet.
</p>

):(

customer.invoices.map(invoice=>(

<Link
key={invoice.id}
href={`/invoices/${invoice.id}`}
className="
block
border
rounded-xl
p-3
"
>

{invoice.invoiceNumber}

</Link>

))

)}

</div>

</div>


      </div>

    </div>

  )

}