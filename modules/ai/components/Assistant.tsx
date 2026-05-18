"use client"

import {
useState
}

from "react"

export default function Assistant(){

const[
prompt,
setPrompt
]=useState("")

return(

<div
className=
"max-w-4xl">

<textarea

className=
"border w-full p-5 h-60"

onChange={e=>

setPrompt(
e.target.value
)

}

/>

<button
className=
"border p-3 mt-5">

Generate

</button>

</div>

)

}