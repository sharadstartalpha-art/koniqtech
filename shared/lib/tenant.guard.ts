import {cookies}

from "next/headers"

export async function enforceTenant(

orgId:string

){

const store=

await cookies()

const tenant=

store.get(

"tenant"

)?.value

if(

tenant!==orgId

){

throw new Error(

"tenant denied"

)

}

return true

}