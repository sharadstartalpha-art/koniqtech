export default function Page(){

const agents=[

"Estimator",
"Dispatcher",
"Call Center",
"RAG"

]

return(

<div className="grid grid-cols-4 gap-6">

{agents.map(a=>(

<div
key={a}
className="
bg-white
border
rounded-3xl
p-8
"
>

{a}

</div>

))}

</div>

)

}