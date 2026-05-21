export default function Health(){

return(

<div className="
grid
grid-cols-3
gap-6
">

<Card
title="DB"
status="OK"
/>

<Card
title="Queue"
status="OK"
/>

<Card
title="Socket"
status="OK"
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
rounded-xl
p-6
">

{props.title}

{props.status}

</div>

)

}