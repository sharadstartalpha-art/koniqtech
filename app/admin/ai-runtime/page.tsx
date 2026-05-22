export default function Page(){

return(

<div>

<h1 className="text-5xl font-bold mb-8">

AI Runtime

</h1>

<div className="grid grid-cols-4 gap-6">

<Card
t="Requests"
v="24k"
/>

<Card
t="Tokens"
v="2.1M"
/>

<Card
t="Latency"
v="320ms"
/>

<Card
t="Failures"
v="3"
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