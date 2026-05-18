"use client"

import {useState} from "react"

import {
registerUser
}
from "../actions/register.action"

export default function RegisterForm(){

const [form,setForm]=
useState({

name:"",
company:"",
email:"",
password:""

})

async function submit(){

await registerUser(
form
)

window.location.href=
"/login"

}

return(

<div className="min-h-screen flex items-center justify-center">

<div className="w-[450px] border rounded-xl p-8">

<h1 className="text-3xl font-bold">

Create Account

</h1>

<input
placeholder="Name"
className="border p-3 w-full mt-5"
onChange={e=>
setForm({
...form,
name:e.target.value
})
}
/>

<input
placeholder="Company"
className="border p-3 w-full mt-3"
onChange={e=>
setForm({
...form,
company:e.target.value
})
}
/>

<input
placeholder="Email"
className="border p-3 w-full mt-3"
onChange={e=>
setForm({
...form,
email:e.target.value
})
}
/>

<input
type="password"
placeholder="Password"
className="border p-3 w-full mt-3"
onChange={e=>
setForm({
...form,
password:e.target.value
})
}
/>

<button
onClick={submit}
className="bg-black text-white p-3 mt-5 w-full">

Register

</button>

</div>

</div>

)

}