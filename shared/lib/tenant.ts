import {cookies}

from "next/headers"

export async function tenantId(){

const store=

await cookies()

return store

.get(

"tenant"

)

?.value

}