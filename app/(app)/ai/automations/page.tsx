export default function Page(){

const automations=[

"Auto score leads",

"Auto create jobs",

"Invoice reminder",

"Dispatch assignment"

]

return(

<div>

<h1 className="text-5xl font-bold mb-8">

AI Automations

</h1>

<div className="grid grid-cols-2 gap-6">

{

automations.map(

a=>(

<div

key={a}

className="bg-white rounded-3xl p-8"

>

<h2 className="text-2xl font-bold">

{a}

</h2>

<button className="mt-6 bg-green-600 text-white px-6 py-3 rounded-xl">

Enable

</button>

</div>

)

)

}

</div>

</div>

)

}