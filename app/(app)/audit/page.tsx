export default function Page(){

const logs=[

"User login",

"Lead created",

"Invoice paid",

"AI workflow executed",

"Dispatch updated"

]

return(

<div>

<h1 className="text-5xl font-bold mb-8">

Audit Logs

</h1>

<div className="space-y-4">

{

logs.map(

l=>(

<div

key={l}

className="bg-white rounded-3xl p-8"

>

{l}

</div>

)

)

}

</div>

</div>

)

}