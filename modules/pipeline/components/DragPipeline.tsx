"use client"

const stages=[

"New",
"Qualified",
"Proposal",
"Won"

]

export default function DragPipeline(){

return(

<div className="p-8">

<h1 className="text-4xl font-bold mb-8">

Pipeline Kanban

</h1>

<div className="grid grid-cols-4 gap-6">

{

stages.map(

s=>(

<div
key={s}
className="
bg-white
rounded-xl
shadow
p-4
space-y-4
min-h-[500px]
"
>

<h2 className="font-bold">

{s}

</h2>

<div className="
bg-slate-100
rounded-lg
p-4
">

Roof Replacement

</div>

</div>

)

)

}

</div>

</div>

)

}