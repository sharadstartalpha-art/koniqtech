"use client"

import {useState} from "react"

export default function Train(){

const[
data,
setData
]=useState("")

return(

<div className="
bg-white
rounded-xl
p-8
space-y-6
">

<h1 className="
text-2xl
font-bold
">

AI Training

</h1>

<textarea

value={data}

onChange={e=>

setData(
e.target.value
)

}

className="
w-full
h-60
border
rounded-xl
p-4
"

placeholder="
training data
"

/>

<button className="
bg-blue-600
text-white
px-5
py-3
rounded-xl
">

Train

</button>

</div>

)

}