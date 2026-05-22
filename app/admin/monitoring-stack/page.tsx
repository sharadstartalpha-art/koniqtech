export default function Page(){

return(

<div>

<h1 className="text-5xl font-bold mb-8">

Monitoring Stack

</h1>

<div className="grid grid-cols-2 gap-6">

<Card
t="Prometheus"
/>

<Card
t="Grafana"
/>

<Card
t="Sentry"
/>

<Card
t="Logs"
/>

</div>

</div>

)

}

function Card({

t

}:any){

return(

<div className="bg-white rounded-3xl p-8">

{t}

</div>

)

}