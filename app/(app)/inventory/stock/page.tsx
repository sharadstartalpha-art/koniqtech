export default function Stock(){

return(

<div className="
grid
grid-cols-3
gap-6
">

<Card
name="Roof Tile"
qty="122"
/>

<Card
name="PVC Pipe"
qty="54"
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

<h2>

{p.name}

</h2>

<p>

Qty:
{p.qty}

</p>

</div>

)

}