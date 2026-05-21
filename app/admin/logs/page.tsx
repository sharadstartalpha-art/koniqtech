export default function Page(){

const logs=[

"User registered",

"Subscription created",

"Invoice paid",

"Lead imported",

"CRM activated"

]

return(

<div className="space-y-8">

<h1 className="text-4xl font-bold">

Logs

</h1>

{

logs.map((log,i)=>(

<div

key={i}

className="bg-white border rounded-2xl p-5"

>

{log}

</div>

))

}

</div>

)

}