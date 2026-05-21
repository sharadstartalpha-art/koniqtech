export default function Page(){

const history=[

"Lead created",

"Estimate sent",

"Quote approved",

"Job completed",

"Invoice paid"

]

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">

Customer History

</h1>

<div className="bg-white rounded-3xl p-8">

{

history.map((x,i)=>(

<div

key={i}

className="border-l-4 border-blue-600 pl-5 py-4"

>

{x}

</div>

))

}

</div>

</div>

)

}