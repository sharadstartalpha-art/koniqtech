export default function Monitoring(){

return(

<div className="
grid
grid-cols-4
gap-6
">

<Card
title="CPU"
value="44%"
/>

<Card
title="Queue"
value="22"
/>

<Card
title="Errors"
value="1"
/>

<Card
title="Latency"
value="230ms"
/>

</div>

)

}

function Card(
props:any
){

return(

<div className="
bg-white
p-6
rounded-xl
">

<h2>

{props.title}

</h2>

<p>

{props.value}

</p>

</div>

)

}