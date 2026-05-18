"use client"

import {
useState
}

from "react"

export default function QuoteBuilder(){

const[
items,
setItems
]=useState<any[]>([])

function add(){

setItems([

...items,

{

name:"",
qty:1,

price:0

}

])

}

return(

<div>

<button
onClick={add}>

Add Item

</button>

{

items.map(

(_,i)=>(

<input
key={i}

className=
"border"

>

</input>

)

)

}

</div>

)

}