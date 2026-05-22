export default function Page(){

const items=[

"GDPR",

"SOC2",

"HIPAA",

"PCI DSS"

]

return(

<div>

<h1 className="text-5xl font-bold mb-8">

Compliance

</h1>

<div className="grid grid-cols-2 gap-6">

{

items.map(

i=>(

<div

key={i}

className="bg-white rounded-3xl p-8"

>

<h2 className="text-2xl font-bold">

{i}

</h2>

<p className="mt-4">

Configured

</p>

</div>

)

)

}

</div>

</div>

)

}