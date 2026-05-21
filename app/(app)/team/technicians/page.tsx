export default function Page(){

const techs=[

"Mike",
"John",
"David"

]

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">

Technicians

</h1>

<div className="grid grid-cols-3 gap-6">

{

techs.map(t=>(

<div

key={t}

className="bg-white rounded-3xl p-8"

>

<h2>

{t}

</h2>

<p>

Technician

</p>

</div>

))

}

</div>

</div>

)

}