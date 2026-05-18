"use client"

import { useActionState }
from "react"

import {
loginAction
}
from "../actions/login.action"

const initialState={
error:""
}

export default function LoginForm(){

const [
state,
action,
pending
]=useActionState(
loginAction,
initialState
)

return(

<form
action={action}
className="
max-w-md
space-y-4
rounded-xl
border
p-6
bg-white
"
>

<h1
className="
text-3xl
font-bold
"
>
Login
</h1>

<input
name="email"
type="email"
placeholder="Email"
defaultValue="
admin@koniqtech.com
"
className="
w-full
border
p-3
rounded
"
/>

<input
name="password"
type="password"
placeholder="Password"
defaultValue="
password
"
className="
w-full
border
p-3
rounded
"
/>

<button
disabled={pending}
className="
bg-black
text-white
px-5
py-3
rounded
w-full
"
>

{
pending
?
"Signing in..."
:
"Sign In"
}

</button>

{
state?.error
&&

<p
className="
text-red-500
"
>

{
state.error
}

</p>

}

</form>

)

}