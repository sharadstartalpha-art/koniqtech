"use client"

import {useState} from "react"

export default function Messages(){

const [msg,setMsg]=useState("")

return(

<div className="grid grid-cols-4 gap-4">

<div className="bg-white rounded-xl p-4">

Contacts

</div>

<div className="col-span-3 bg-white rounded-xl p-4">

<div className="h-[500px]"/>

<input

value={msg}

onChange={(e)=>

setMsg(

e.target.value

)

}

placeholder="Message"

className="border p-3 w-full rounded-lg"

/>

</div>

</div>

)

}