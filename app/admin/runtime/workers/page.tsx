export default function Page(){

const workers=[

"Email Worker",

"AI Worker",

"Invoice Worker",

"Webhook Worker"

]

return(

<div>

<h1 className="text-5xl font-bold mb-8">

Workers

</h1>

<div className="space-y-5">

{

workers.map(w=>(

<div
key={w}
className="bg-white rounded-3xl p-8 flex justify-between"
>

<span>

{w}

</span>

<span>

Running

</span>

</div>

))

}

</div>

</div>

)

}