export default function Page(){

return(

<div>

<h1 className="text-5xl font-bold mb-8">

Payments Runtime

</h1>

<div className="grid grid-cols-4 gap-6">

<Card
t="Revenue"
v="$82k"
/>

<Card
t="Subs"
v="122"
/>

<Card
t="Failures"
v="3"
/>

<Card
t="Refunds"
v="1"
/>

</div>

</div>

)

}

function Card({t,v}:any){

return(

<div className="bg-white rounded-3xl p-8">

<p>{t}</p>

<h2 className="text-4xl font-bold">

{v}

</h2>

</div>

)

}