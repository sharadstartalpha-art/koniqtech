export default function Page(){

return(

<div className="
grid
grid-cols-4
gap-6
">

<Card
title="CPU"
/>

<Card
title="Memory"
/>

<Card
title="API"
/>

<Card
title="Workers"
/>

</div>

)

}

function Card(
props:any
){

return(

<div className="
border
p-8
rounded-3xl
">

{props.title}

</div>

)

}