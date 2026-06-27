import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"
import { revalidatePath } from "next/cache"
import Link from "next/link"

export default async function Page({
  params
}:{
  params:Promise<{id:string}>
}){

  const { id } = await params

  const [orders, vendors] = await Promise.all([
  prisma.purchaseOrder.findMany({
    where: { jobId: id },
    include: {
      vendor: true,
    },
  }),

  prisma.vendor.findMany({
    orderBy: {
      companyName: "asc",
    },
  }),
])

  async function createOrder(
    formData:FormData
  ){

    "use server"

    const session = await auth()

if (!session?.user?.orgId) {
  throw new Error("Organization not found")
}

   await prisma.purchaseOrder.create({
  data: {
    orgId: session.user.orgId,
    jobId: id,

    vendorId: String(formData.get("vendorId")),

    orderNumber: `PO-${Date.now()}`,

    subtotal: Number(formData.get("subtotal")),
    tax: 0,
    discount: 0,
    shipping: 0,
    total: Number(formData.get("subtotal")),

    status: "draft",
  },
})

    revalidatePath(
      `/jobs/${id}/purchase-orders`
    )
  }

  return(

    <div className="space-y-8">

      <h1 className="text-5xl font-bold">
        Purchase Orders
      </h1>

      <form
        action={createOrder}
        className="bg-white border rounded-3xl p-6 flex gap-4"
      >

        <select
    name="vendorId"
    className="flex-1 h-14 border rounded-2xl px-4"
>
    <option value="">
        Select Vendor
    </option>

    {vendors.map((vendor) => (
        <option
            key={vendor.id}
            value={vendor.id}
        >
            {vendor.companyName}
        </option>
    ))}
</select>

        <input
          name="subtotal"
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

      <div className="bg-white border rounded-3xl overflow-hidden">

        <table className="w-full">

          <thead>
            <tr className="bg-slate-50 border-b">
              <th className="p-4 text-left">Vendor</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>

            {orders.map(order=>(

              <tr
                key={order.id}
                className="border-b"
              >

                <td className="p-4">{order.vendor.companyName}</td>
                <td className="p-4">$${order.total.toFixed(2)}</td>
                <td className="p-4">{order.status}</td>

                <td className="p-4">

                  <div className="flex gap-2">

                    <Link
                      href={`/jobs/${id}/purchase-orders/${order.id}`}
                      className="px-3 py-2 bg-slate-100 rounded-xl"
                    >
                      Edit
                    </Link>

                    <form
                      action={async()=>{

                        "use server"

                        await prisma.purchaseOrder.delete({
                          where:{ id:order.id }
                        })

                        revalidatePath(
                          `/jobs/${id}/purchase-orders`
                        )

                      }}
                    >

                      <button
                        className="px-3 py-2 bg-red-600 text-white rounded-xl"
                      >
                        Delete
                      </button>

                    </form>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  )

}