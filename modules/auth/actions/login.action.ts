"use server"

import {
validateUser
}

from "../services/auth.service"

import {
signToken
}

from "../jwt/jwt"

import {
setSession
}

from "../cookies/session"

export async function loginAction(

email:string,

password:string

){

const user=
await validateUser(

email,
password

)

const token=
await signToken({

id:user.id,

orgId:user.orgId,

role:user.role

})

await setSession(
token
)

return{

success:true

}

}