"use client"

import {
useState
}

from "react"

export default function Builder(){

const[
steps,
setSteps
]=useState<any[]>([])

function add(){

setSteps([

...steps,

{

type:
"email"

}

])

}

return(

<div>

<button
onClick={add}

className=
"border p-3">

Add Step

</button>

{

steps.map(

(x,i)=>(

<div
key={i}

className=
"border p-3 mt-3">

{x.type}

</div>

)

)

}

</div>

)

}