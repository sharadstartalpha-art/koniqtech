export default function RoofMeasurements(){

const rows=[

{
section:"North",
area:"1200 sqft"
},

{
section:"South",
area:"950 sqft"
},

{
section:"Garage",
area:"420 sqft"
}

]

return(

<div className="p-8 space-y-6">

<h1 className="text-4xl font-bold">

Roof Measurements

</h1>

{

rows.map(

r=>(

<div
key={r.section}
className="
border
rounded-xl
p-4
flex
justify-between
"
>

<span>{r.section}</span>

<span>{r.area}</span>

</div>

)

)

}

</div>

)

}