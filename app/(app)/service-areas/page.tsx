export default function Page(){

const areas=[

"Dallas",
"Miami",
"Houston",
"Austin"

]

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">

Service Areas

</h1>

<div className="grid grid-cols-4 gap-6">

{

areas.map(area=>(

<div

key={area}

className="bg-white rounded-3xl p-8 border"

>

<h2 className="text-2xl font-bold">

{area}

</h2>

</div>

))

}

</div>

</div>

)

}