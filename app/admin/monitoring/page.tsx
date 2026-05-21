export default function Page(){

const services=[

"API",

"Database",

"Redis",

"Workers",

"Email",

"Queue"

]

return(

<div className="space-y-8">

<h1 className="text-4xl font-bold">

Monitoring

</h1>

{

services.map(s=>(

<div

key={s}

className="bg-white border rounded-2xl p-6 flex justify-between"

>

<span>

{s}

</span>

<span className="text-green-600">

Healthy

</span>

</div>

))

}

</div>

)

}