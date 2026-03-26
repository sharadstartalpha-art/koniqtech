import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  await prisma.product.createMany({
    data: [
      { name: "Meeting AI", slug: "meeting-ai" },
      { name: "Lead Finder", slug: "lead-finder" },
      { name: "Automation Tool", slug: "automation" },
    ],
  })

  console.log("🌱 Products seeded")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })