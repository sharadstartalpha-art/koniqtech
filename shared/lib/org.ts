import { auth } from "@/auth"

export async function getOrg(){

const session=
await auth()

return (

session?.user as any

)?.orgId

}