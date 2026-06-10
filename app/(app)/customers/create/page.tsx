import prisma from "@/shared/lib/prisma"
import QuoteForm from "./QuoteForm"

export default async function Page() {

  const customers =
    await prisma.customer.findMany({

      orderBy:{
        firstName:"asc"
      }

    })

  return(

    <QuoteForm
      customers={customers}
    />

  )

}