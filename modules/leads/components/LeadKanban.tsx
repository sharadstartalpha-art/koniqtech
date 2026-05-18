"use client"

const columns=[

"NEW",

"CONTACTED",

"QUALIFIED",

"WON"

]

export default function LeadKanban(){

return(

<div className="
grid
grid-cols-4
gap-6
p-8
">

{

columns.map(

c=>(

<div
key={c}
className="
bg-white
rounded-2xl
border
p-5
min-h-[600px]
"
>

<h2 className="
font-bold
mb-4
">

{c}

</h2>

</div>

)

)

}

</div>

)

}