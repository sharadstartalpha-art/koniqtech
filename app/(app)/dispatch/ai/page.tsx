export default function Page(){

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">

Dispatch AI

</h1>

<div className="
grid
grid-cols-3
gap-6
">

<Card title="Optimize Routes"/>
<Card title="Assign Tech"/>
<Card title="Load Balance"/>

</div>

<div className="
bg-white
border
rounded-3xl
p-10
h-[500px]
">

AI dispatch recommendations

</div>

</div>

)

}

function Card({title}:any){

return(

<div className="
bg-white
border
rounded-3xl
p-8
">

{title}

</div>

)

}