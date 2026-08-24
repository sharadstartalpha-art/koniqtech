import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import DataTable from "@/components/DataTable"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function Page() {

  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const orgId = session.user.orgId

  if (!orgId) {
    redirect("/welcome")
  }

  const customers = await prisma.customer.findMany({

    where: {
      orgId
    },

    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      createdAt: true
    },

    orderBy: {
      createdAt: "desc"
    }

  })

  return (

    <DataTable

      title="Customers"

      buttonLabel="Add Customer"

      buttonHref="/customers/create"

      editPath="/customers/edit"

      rowHref="/customers"

      onDeletePath="/api/customers"

      columns={[

        {
          key: "name",
          label: "Name"
        },

        {
          key: "email",
          label: "Email"
        },

        {
          key: "phone",
          label: "Phone"
        }

      ]}

      rows={

        customers.map(customer => ({

          id: customer.id,

          name:
            `${customer.firstName} ${customer.lastName ?? ""}`.trim(),

          email:
            customer.email || "-",

          phone:
            customer.phone || "-"

        }))

      }

    />

  )

}