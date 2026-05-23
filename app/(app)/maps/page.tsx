export default function Page(){

return(

<div className="
space-y-8
">

<h1 className="
text-5xl
font-bold
">

Maps

</h1>

<div className="
grid
grid-cols-3
gap-6
">

<Card
title="Routes"
/>

<Card
title="Jobs"
/>

<Card
title="Technicians"
/>

</div>

<div className="
bg-white
border
rounded-3xl
h-[700px]
p-8
">

Google Maps Area

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