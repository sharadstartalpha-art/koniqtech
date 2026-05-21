export default function Page(){

const days=[

"Mon",
"Tue",
"Wed",
"Thu",
"Fri",
"Sat",
"Sun"

]

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">

Week Calendar

</h1>

<div className="grid grid-cols-7 gap-4">

{

days.map(day=>(

<div

key={day}

className="bg-white rounded-3xl p-6 min-h-[600px]"

>

<h2 className="font-bold">

{day}

</h2>

<div className="mt-5 bg-blue-100 rounded p-3">

Inspection

</div>

</div>

))

}

</div>

</div>

)

}