import { getServerSession } from "next-auth"
import { authOptions } from "../../../lib/auth"
import { prisma } from "../../../lib/prisma"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 })
  }

  const formData = await req.formData()

const name = formData.get("name") as string
const productSlug = formData.get("productSlug") as string

  if (!productSlug) {
    return new Response("Product required", { status: 400 })
  }

  // ✅ get user
 let user = await prisma.user.findUnique({
  where: { email: session.user.email },
})

// 🔥 if user doesn't exist → create it
if (!user) {
  user = await prisma.user.create({
    data: {
      email: session.user.email,
     name: session.user.email || "User",
     image: null,
    },
  })
}

  if (!user) {
    return new Response("User not found", { status: 404 })
  }

  // ✅ get product
 const product = await prisma.product.findUnique({
  where: { slug: productSlug },
})

if (!product) {
  return new Response("Invalid product", { status: 400 })
}

  // ✅ create project
 await prisma.project.create({
  data: {
    name,
    userId: user.id,
    productId: product.id,
  },
})

  return Response.redirect("https://koniqtech.com/dashboard")
}