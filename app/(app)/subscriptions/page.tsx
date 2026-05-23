export default function Page(){

const plans=[

{
name:"Starter",
price:"99"
},

{
name:"Pro",
price:"299"
},

{
name:"Enterprise",
price:"999"
}

]

return(

<div className="space-y-8">

<h1 className="text-5xl">

Subscriptions

</h1>

<div className="grid grid-cols-3 gap-6">

{

plans.map(plan=>(

<div
key={plan.name}
className="border rounded-3xl p-8"
>

<h2>

{plan.name}

</h2>

<p>

${plan.price}

</p>

</div>

))

}

</div>

</div>

)

}