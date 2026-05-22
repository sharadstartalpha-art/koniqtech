export default function Page(){

const workflows=[

"Lead Qualification",

"Quote Generation",

"Call Summary",

"Dispatch Automation"

]

return(

<div>

<h1 className="text-5xl font-bold mb-8">

AI Workflows

</h1>

<div className="grid grid-cols-2 gap-6">

{

workflows.map(

w=>(

<div

key={w}

className="bg-white rounded-3xl p-8"

>

<h2 className="text-2xl font-bold">

{w}

</h2>

<button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl">

Run

</button>

</div>

)

)

}

</div>

</div>

)

}