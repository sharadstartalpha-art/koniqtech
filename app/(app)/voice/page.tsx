export default function Page(){

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">

Voice Agents

</h1>

<div className="
grid
grid-cols-3
gap-6
">

<Card
title="Inbound AI"
/>

<Card
title="Outbound AI"
/>

<Card
title="Appointment Bot"
/>

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

<h2 className="font-bold">

{title}

</h2>

</div>

)

}