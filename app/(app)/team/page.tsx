export default function Page(){

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">

Team

</h1>

<div className="grid grid-cols-3 gap-6">

<Member
name="Mike"
role="Technician"
/>

<Member
name="John"
role="Sales"
/>

<Member
name="Sarah"
role="Dispatcher"
/>

</div>

</div>

)

}

function Member({

name,
role

}:any){

return(

<div className="bg-white rounded-3xl p-8">

<h2 className="font-bold">

{name}

</h2>

<p>

{role}

</p>

</div>

)

}