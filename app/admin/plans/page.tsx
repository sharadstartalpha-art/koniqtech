export default function Page(){

const plans=[

{
name:"Starter",
price:99
},

{
name:"Pro",
price:199
},

{
name:"Enterprise",
price:499
}

]

return(

<div className="space-y-8">

<h1 className="text-4xl font-bold">

Plans

</h1>

<div className="grid grid-cols-3 gap-6">

{

plans.map(plan=>(

<div

key={plan.name}

className="bg-white rounded-3xl p-8 border"

>

<h2 className="text-3xl font-bold">

{plan.name}

</h2>

<p className="mt-4">

${plan.price}

</p>

</div>

))

}

</div>

</div>

)

}