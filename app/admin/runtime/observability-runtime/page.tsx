export default function Page(){

return(

<div>

<h1 className="text-5xl font-bold mb-8">

Observability Runtime

</h1>

<div className="grid grid-cols-4 gap-6">

<Card
t="Errors"
v="2"
/>

<Card
t="CPU"
v="24%"
/>

<Card
t="RAM"
v="1.4GB"
/>

<Card
t="Logs"
v="82k"
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