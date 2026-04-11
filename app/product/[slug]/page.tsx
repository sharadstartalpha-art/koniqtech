import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Link from "next/link"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return <div className="p-10">Not logged in</div>
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return <div className="p-10">User not found</div>
  }

  const product = await prisma.product.findUnique({
    where: { slug },
  })

  if (!product) {
    return <div className="p-10">Product not found</div>
  }

  const projects = await prisma.project.findMany({
    where: {
      userId: user.id,
      productId: product.id,
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">
        {product.name}
      </h1>

      <p className="text-gray-500 mb-6">
        Your projects for {product.name}
      </p>

      {/* CREATE PROJECT */}
      <form onSubmit={(e) => { e.preventDefault(); }} action="/api/projects" method="POST" className="flex gap-2 mb-6">
        <input
          name="name"
          placeholder="New project name"
          className="border p-2 flex-1 rounded"
          required
        />

        <input type="hidden" name="productSlug" value={product.slug} />

        <button className="bg-black text-white px-4 py-2 rounded">
          Create
        </button>
      </form>

      {/* PROJECT LIST */}
      <div className="space-y-3">
        {projects.length === 0 && (
          <p className="text-gray-400">No projects yet</p>
        )}

        {projects.map((project) => (
          <div
            key={project.id}
            className="border rounded p-3 flex justify-between"
          >
            <div>
              {/* ✅ CLICKABLE */}
              <Link
                href={`/project/${project.id}`}
                className="font-medium hover:underline"
              >
                {project.name}
              </Link>

              <p className="text-xs text-gray-400">
                {new Date(project.createdAt).toLocaleString()}
              </p>
            </div>

            <form action={`/api/projects/${project.id}`} method="POST">
              <button className="text-red-500">Delete</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  )
}