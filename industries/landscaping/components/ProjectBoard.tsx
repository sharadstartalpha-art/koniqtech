export default function ProjectBoard(){

const projects=[

{
name:
"Front Yard Redesign",

status:
"In Progress"
},

{
name:
"Garden Upgrade",

status:
"Planned"
},

{
name:
"Pool Landscaping",

status:
"Completed"
}

]

return(

<div className="
bg-white
border
rounded-2xl
p-6
space-y-4
">

<h2 className="
text-2xl
font-bold
">

Projects

</h2>

{

projects.map(

project=>(

<div

key={project.name}

className="
border
rounded-xl
p-4
flex
justify-between
"

>

<span>

{
project.name
}

</span>

<span>

{
project.status
}

</span>

</div>

)

)

}

</div>

)

}