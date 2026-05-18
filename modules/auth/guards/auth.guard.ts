import { redirect }
from "next/navigation"

import {
getSession
}
from "../cookies/session"

export async function authGuard(){

const user=
await getSession()

if(!user){

redirect("/login")

}

return user

}