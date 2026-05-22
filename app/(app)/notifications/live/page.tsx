export default function Page(){

const notifications=[

"Lead assigned",

"Job completed",

"Invoice paid",

"Technician arrived"

]

return(

<div>

<h1 className="text-5xl font-bold mb-8">

Live Notifications

</h1>

<div className="space-y-5">

{

notifications.map(

n=>(

<div

key={n}

className="bg-white rounded-3xl p-8"

>

{n}

</div>

)

)

}

</div>

</div>

)

}