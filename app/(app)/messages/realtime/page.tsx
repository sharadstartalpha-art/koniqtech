"use client"

import {useState} from "react"

export default function Realtime(){

const[msg,setMsg]=useState("")

return(

<div className="space-y-6">

<div className="flex justify-between">

<h1 className="text-2xl font-semibold">

Realtime Messages

</h1>

<button className="bg-blue-600 text-white px-4 py-2 rounded">

Connect Twilio

</button>

</div>

<div className="bg-white rounded-xl p-6">

<textarea

value={msg}

onChange={(e)=>

setMsg(e.target.value)

}

className="w-full border rounded p-4 h-32"

placeholder="SMS"

>

</textarea>

<button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">

Send

</button>

</div>

</div>

)

}