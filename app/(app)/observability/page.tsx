export default function Observability(){

return(

<div className="
grid
grid-cols-3
gap-6
">

<Card
t="Latency"
v="220ms"
/>

<Card
t="Errors"
v="0"
/>

<Card
t="Events"
v="1200"
/>

</div>

)

}

function Card(
p:any
){

return(

<div className="
bg-white
p-6
rounded-xl
">

{p.t}

{p.v}

</div>

)

}