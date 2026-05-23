export default function Page(){

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">

AI Call Center

</h1>

<div className="
grid
grid-cols-4
gap-6
">

<Card title="Inbound"/>
<Card title="Outbound"/>
<Card title="AI Agents"/>
<Card title="Voice Queue"/>

</div>

<div className="
bg-white
border
rounded-3xl
p-10
h-[500px]
">

AI voice workflow

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