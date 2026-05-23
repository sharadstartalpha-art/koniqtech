export default function Page(){

return(

<div className="
space-y-8
">

<h1 className="
text-5xl
font-bold
">

Stripe Billing

</h1>

<div className="
grid
grid-cols-4
gap-6
">

<Card
title="MRR"
value="$48k"
/>

<Card
title="Invoices"
value="182"
/>

<Card
title="Plans"
value="84"
/>

<Card
title="Revenue"
value="$120k"
/>

</div>

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

<p>

{title}

</p>

<h2 className="
text-4xl
font-bold
">

{value}

</h2>

</div>

)

}