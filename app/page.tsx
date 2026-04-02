import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function HomePage() {
  const products = await prisma.product.findMany()

  return (
    <div>
      <h1>KoniqTech</h1>

      {products.map((p) => (
        <Link key={p.id} href={`/dashboard/${p.slug}`}>
          {p.name}
        </Link>
      ))}
    </div>
  )
}