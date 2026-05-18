import {
authGuard
}

from "./auth.guard"

import {
permissions
}

from
"@/server/permissions/rbac"

export async function canAccess(

resource:string

){

const user=
await authGuard()

const rolePerm=

permissions[
user.role as keyof
typeof permissions
]

if(

rolePerm.includes(
"*"
)

)

return true

return rolePerm.includes(
resource
)

}