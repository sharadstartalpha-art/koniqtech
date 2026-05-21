export default function SubscriptionPage(){

return(

<div className="space-y-8">

<h1 className="text-3xl font-bold">
Subscriptions
</h1>

<div className="grid md:grid-cols-3 gap-6">

<Card
title="CRM Starter"
price="$99"
/>

<Card
title="Dispatch Pro"
price="$249"
/>

<Card
title="Enterprise AI"
price="$599"
/>

</div>

</div>

)

}

function Card(
props:any
){

return(

<div className="
bg-white
rounded-2xl
p-8
shadow
">

<h2 className="
font-bold
text-xl
">

{props.title}

</h2>

<p className="
text-3xl
font-bold
mt-4
">

{props.price}

</p>

<button className="
mt-6
bg-blue-600
text-white
px-5
py-3
rounded-xl
">

Select

</button>

</div>

)

}