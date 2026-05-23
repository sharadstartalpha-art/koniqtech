export default function Page(){

return(

<div className="grid grid-cols-4 gap-6">

<Box title="Tracking"/>

<Box title="Payments"/>

<Box title="Approvals"/>

<Box title="Chat"/>

</div>

)

}

function Box(
props:any
){

return(

<div className="border p-8">

{props.title}

</div>

)

}