export default function Workflows(){

return(

<div className="
grid
grid-cols-3
gap-6
">

<Card
name="Lead Followup"
/>

<Card
name="Invoice Reminder"
/>

<Card
name="Job Assignment"
/>

</div>

)

}

function Card(
props:any
){

return(

<div className="
bg-white
rounded-xl
p-8
">

{props.name}

</div>

)

}