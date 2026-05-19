import prisma from "@/shared/lib/prisma"
import {NextResponse} from "next/server"

export async function GET(){

return NextResponse.json(

await prisma.invoice.findMany()

)

}