export default function DispatchBoard(){

const techs=[

"John",

"Mike",

"Sarah"

]

return(

<div>

<h1 className="
text-3xl
font-bold
mb-8
">

Dispatch Board

</h1>

<div className="
grid
grid-cols-3
gap-6
">

{

techs.map(
x=>(

<div

key={x}

className="
bg-white
rounded-xl
p-6
shadow
"

>

<h2>

{x}

</h2>

<p>

3 Jobs Assigned

</p>

</div>

)

)

}

</div>

</div>

)

}