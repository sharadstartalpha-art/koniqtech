import {
authGuard
}

from
"@/modules/auth/guards/auth.guard"

export default async function Profile(){

const user=
await authGuard()

return(

<div className="p-10">

<h1 className="text-3xl">

Profile

</h1>

<div className="mt-5">

<p>

{user.role}

</p>

</div>

</div>

)

}