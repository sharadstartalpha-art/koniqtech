import { prisma } from "@/lib/prisma"
import SidebarClient from "./SidebarClient"

export default async function Sidebar() {
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
  })

  return <SidebarClient products={products} />
}