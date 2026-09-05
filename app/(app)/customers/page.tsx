import prisma from "@/shared/lib/prisma"
import { auth } from "@/auth"
import DataTable from "@/components/DataTable"
import { redirect } from "next/navigation"
import { canCreate, canDelete, canEdit, canView } from "@/shared/lib/permissions"
import type { Permission } from "@/shared/lib/permissions";

export const dynamic = "force-dynamic"

export default async function Page() {

 const session = await auth();

if (!session?.user) {
    redirect("/login");
}

const dbUser = await prisma.user.findUnique({
    where: {
        email: session.user.email!,
    },
    include: {
        organizationRole: {
            include: {
                permissions: true,
            },
        },
    },
});

if (!dbUser) {
    redirect("/login");
}

const permissions = dbUser.organizationRole?.permissions ?? [];

const isOwner =
    dbUser.organizationRole?.name === "Owner";

if (!canView(permissions, "Customers", isOwner)) {
    redirect("/unauthorized");
}

const orgId = session.user.orgId;

if (!orgId) {
  redirect("/welcome");
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


 canCreate={canCreate(permissions, "Customers", isOwner)}

canEdit={canEdit(permissions, "Customers", isOwner)}

canDelete={canDelete(permissions, "Customers", isOwner)}

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