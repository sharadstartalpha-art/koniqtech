export default function Page(){

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">

Technician Mobile

</h1>

<div className="
grid
grid-cols-3
gap-6
">

<Card text="Jobs"/>
<Card text="Checklist"/>
<Card text="Photos"/>

</div>

</div>

)

}

function Card({text}:any){

return(

<div className="
bg-white
rounded-3xl
border
p-10
">

{text}

</div>

)

}