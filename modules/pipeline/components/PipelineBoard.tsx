"use client"

const stages=[

"New",

"Qualified",

"Proposal",

"Won"

]

export default function PipelineBoard(){

return(

<div className="grid grid-cols-4 gap-5">

{

stages.map(

x=>(

<div

key={x}

className=
"border rounded-xl p-5 min-h-[500px]"

>

<h2
className=
"text-xl font-bold">

{x}

</h2>

</div>

)

)

}

</div>

)

}