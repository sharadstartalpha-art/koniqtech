export default function Page(){

const queues=[

"Email Queue",

"AI Queue",

"Invoice Queue",

"Webhook Queue"

]

return(

<div>

<h1 className="text-5xl font-bold mb-8">

Queue Workers

</h1>

<div className="grid grid-cols-2 gap-6">

{

queues.map(q=>(

<div
key={q}
className="bg-white rounded-3xl p-8"
>

<h2 className="font-bold">

{q}

</h2>

<p className="mt-4">

Healthy

</p>

</div>

))

}

</div>

</div>

)

}