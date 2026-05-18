export default function UnitManager(){

const units=[

{
name:"AC Unit A",
status:"Active"
},

{
name:"Heat Pump",
status:"Maintenance"
}

]

return(

<div className="space-y-4">

<h2 className="text-2xl font-semibold">

Equipment

</h2>

{

units.map(

u=>(

<div
key={u.name}
className="
border
rounded-xl
p-4
flex
justify-between
"
>

<span>{u.name}</span>

<span>{u.status}</span>

</div>

)

)

}

</div>

)

}