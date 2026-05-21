export default function Page(){

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">

Sales Team

</h1>

<div className="grid grid-cols-3 gap-6">

<Member
name="Sarah"
/>

<Member
name="Mike"
/>

</div>

</div>

)

}

function Member({

name

}:any){

return(

<div className="bg-white rounded-3xl p-8">

<h2>

{name}

</h2>

<p>

Sales Rep

</p>

</div>

)

}