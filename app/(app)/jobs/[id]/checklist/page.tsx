export default function Page(){

return(

<div className="
space-y-5
">

<h1 className="text-5xl font-bold">

Checklist

</h1>

<Item text="Permit approved"/>

<Item text="Materials ordered"/>

<Item text="Inspection done"/>

</div>

)

}

function Item({

text

}:any){

return(

<div className="
bg-white
border
rounded-2xl
p-5
">

{text}

</div>

)

}