export default function Page(){

return(

<div>

<h1 className="
text-5xl
font-bold
mb-8
">

Locations

</h1>

<div className="
grid
grid-cols-3
gap-6
">

<Card title="Dallas"/>
<Card title="Houston"/>
<Card title="Austin"/>

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
p-10
">

{title}

</div>

)

}