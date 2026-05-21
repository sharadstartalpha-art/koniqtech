import prisma from "@/shared/lib/prisma"

export async function migrateData(){

const users=

await prisma.user.findMany()

console.log(

users.length

)

}