export default function Page(){

return(

<div>

<h1 className="text-5xl font-bold mb-8">

Redis Runtime

</h1>

<div className="grid grid-cols-4 gap-6">

<Card
t="Memory"
v="1.2 GB"
/>

<Card
t="Keys"
v="28k"
/>

<Card
t="Hits"
v="92%"
/>

<Card
t="Latency"
v="2ms"
/>

</div>

<div className="bg-white rounded-3xl p-10 mt-8">

Redis Cache Healthy

</div>

</div>

)

}

function Card({
t,
v
}:any){

return(

<div className="bg-white rounded-3xl p-8">

<p>{t}</p>

<h2 className="text-4xl font-bold">

{v}

</h2>

</div>

)

}