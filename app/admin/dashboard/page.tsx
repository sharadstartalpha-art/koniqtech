import {
adminGuard
}

from
"@/modules/auth/guards/admin.guard"

export default async function Admin(){

await adminGuard()

return(

<div>

Admin Dashboard

</div>

)

}