import { redirect }
from "next/navigation"

import {
authGuard
}
from "./auth.guard"

export async function adminGuard(){

const user=
await authGuard()

if(
user.role!=="ADMIN"
){

redirect("/dashboard")

}

return user

}