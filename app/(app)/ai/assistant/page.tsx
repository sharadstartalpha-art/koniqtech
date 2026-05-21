"use client"

import { useState } from "react"

export default function Page(){

const [messages,setMessages]=useState([

{
role:"assistant",
text:"How can I help?"
}

])

const [input,setInput]=useState("")

function send(){

if(!input)return

setMessages([

...messages,

{
role:"user",
text:input
},

{
role:"assistant",
text:"AI response for: "+input
}

])

setInput("")

}

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">

AI Assistant

</h1>

<div className="bg-white rounded-3xl p-8 h-[700px] flex flex-col">

<div className="flex-1 overflow-auto space-y-4">

{

messages.map((m,i)=>(

<div

key={i}

className={

m.role==="assistant"

?

"bg-slate-100 p-4 rounded-2xl w-fit"

:

"bg-blue-600 text-white p-4 rounded-2xl ml-auto w-fit"

}

>

{m.text}

</div>

))

}

</div>

<div className="flex gap-4 mt-6">

<input

value={input}

onChange={e=>

setInput(

e.target.value

)

}

className="flex-1 border rounded-2xl p-5"

placeholder="Ask AI..."

/>

<button

onClick={send}

className="bg-blue-600 text-white px-8 rounded-2xl"

>

Send

</button>

</div>

</div>

</div>

)

}