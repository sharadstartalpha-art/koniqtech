import {

authGuard

}

from
"@/modules/auth/guards/auth.guard"

export default async function Dashboard(){

const user=

await authGuard()

return(

<div className="p-10">

<h1
className=
"text-4xl font-bold">

Welcome

{user.role}

</h1>

</div>

)

}