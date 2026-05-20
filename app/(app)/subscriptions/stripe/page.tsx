export default function StripeBilling(){

const plans=[

"Roofing",
"HVAC",
"Plumbing",
"Landscaping"

]

return(

<div className="space-y-8">

<h1 className="text-2xl font-semibold">

Industry Subscription

</h1>

<div className="grid grid-cols-4 gap-6">

{

plans.map(

x=>(

<div
key={x}
className="bg-white rounded-xl p-8">

<h2 className="font-semibold">

{x}

</h2>

<p className="mt-4">

$149/month

</p>

<button className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg">

Subscribe

</button>

</div>

)

)

}

</div>

</div>

)

}