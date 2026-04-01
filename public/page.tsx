const products = await prisma.product.findMany()
products.map(p => (
  <Link href={`/dashboard/${p.slug}`}>{p.name}</Link>
))