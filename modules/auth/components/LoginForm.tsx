"use client"

import { useState } from "react"

import {
    loginAction
}
from "../actions/login.action"

export default function LoginForm(){

const [
email,
setEmail
]=useState("")

const [
password,
setPassword
]=useState("")

async function submit(){

try{

await loginAction(

email,

password

)

window.location.href=
"/dashboard"

}catch(err){

console.error(err)

}

}

return(

<div className="min-h-screen flex items-center justify-center">

<div className="w-[420px] border rounded-xl p-8">

<h1 className="text-3xl font-bold">

Login

</h1>

<input

className=
"border p-3 w-full mt-5"

placeholder=
"Email"

value={email}

onChange={e=>

setEmail(
e.target.value
)

}

/>

<input

type="password"

className=
"border p-3 w-full mt-3"

placeholder=
"Password"

value={password}

onChange={e=>

setPassword(
e.target.value
)

}

/>

<button

onClick={submit}

className=
"bg-black text-white p-3 mt-5 w-full"

>

Sign In

</button>

</div>

</div>

)

}