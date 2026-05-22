export default function Page(){

const queues=[

"email",

"ai",

"billing",

"webhooks"

]

return(

<div>

<h1 className="text-5xl font-bold mb-8">

BullMQ

</h1>

<div className="space-y-5">

{

queues.map(q=>(

<div
key={q}
className="bg-white rounded-3xl p-8 flex justify-between"
>

<span>{q}</span>

<span>running</span>

</div>

))

}

</div>

</div>

)

}