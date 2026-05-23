export default function Page(){

return(

<div className="
grid
grid-cols-4
gap-6
">

<Card
title="CPU"
value="31%"
/>

<Card
title="RAM"
value="4GB"
/>

<Card
title="Workers"
value="12"
/>

<Card
title="Uptime"
value="99.9%"
/>

</div>

)

}

function Card({
title,
value
}:any){

return(

<div className="
bg-white
border
rounded-3xl
p-8
">

<h2>
{title}
</h2>

<h1 className="
text-4xl
font-bold
">

{value}

</h1>

</div>

)

}