export default function DragPipeline(){

const stages=[
"New",
"Qualified",
"Proposal",
"Won"
]

return(

<div className="p-8">

<h1 className="text-4xl font-bold">

Pipeline Kanban

</h1>

<div className="grid grid-cols-4 gap-5 mt-8">

{stages.map(stage=>(

<div
key={stage}
className="
bg-white
rounded-xl
p-5
shadow
"
>

<h2>

{stage}

</h2>

<div className="bg-slate-100 mt-3 p-3 rounded">

Roof Lead

</div>

</div>

))}

</div>

</div>

)

}