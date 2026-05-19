export default function AgentGrid(){

const agents=[

"Roof AI",
"HVAC AI",
"Plumbing AI",
"Landscape AI"

]

return(

<div className="
grid
grid-cols-4
gap-6
">

{

agents.map(

a=>(

<div
key={a}
className="
bg-white
p-6
rounded-xl
shadow
"
>

{a}

</div>

)

)

}

</div>

)

}