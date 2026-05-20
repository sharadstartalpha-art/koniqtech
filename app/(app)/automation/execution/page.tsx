export default function WorkflowExecution(){

const flows=[

"Lead AI",
"Quote AI",
"Dispatch AI"

]

return(

<div className="grid grid-cols-3 gap-6">

{

flows.map(

x=>(

<div
key={x}

className="bg-white p-6 rounded-xl"

>

{x}

<button

className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"

>

Run

</button>

</div>

)

)

}

</div>

)

}