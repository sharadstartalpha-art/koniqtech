import {

redirect

}

from
"next/navigation"

import {

getSession

}

from
"../cookies/session"

import {

verifyToken,

UserToken

}

from
"../jwt/jwt"

export async function authGuard()

:Promise<UserToken>{

const session=

await getSession()

if(!session){

redirect(
"/login"
)

}

const user=

await verifyToken(
session
)

if(!user){

redirect(
"/login"
)

}

return user

}