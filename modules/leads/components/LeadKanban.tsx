export default function LeadKanban(){

const cols=[
"New",
"Qualified",
"Proposal",
"Won"
]

return(

<div className="space-y-6">

<h1 className="text-4xl font-bold">

Lead Pipeline

</h1>

<div className="grid grid-cols-4 gap-4">

{cols.map(col=>(

<div
key={col}
className="
bg-white
rounded-xl
p-4
shadow
min-h-[400px]
"
>

<h2 className="font-bold">

{col}

</h2>

<div className="mt-4 p-3 bg-slate-100 rounded">

Roof Replacement

</div>

</div>

))}

</div>

</div>

)

}