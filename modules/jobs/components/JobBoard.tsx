export default function JobBoard(){

const columns=[

"scheduled",

"in_progress",

"completed"

]

return(

<div className="grid grid-cols-3 gap-5">

{

columns.map(

x=>(

<div

key={x}

className=
"border min-h-[300px] p-5"

>

{x}

</div>

)

)

}

</div>

)

}