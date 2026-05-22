export default function Page(){

const leads=[

{
name:"John",

score:95,

status:"Hot"
},

{
name:"Mike",

score:72,

status:"Warm"
},

{
name:"Sarah",

score:40,

status:"Cold"
}

]

return(

<div>

<h1 className="text-5xl font-bold mb-10">

AI Lead Scoring

</h1>

<div className="grid gap-6">

{

leads.map(

i=>(

<div

key={i.name}

className="bg-white rounded-3xl p-8"

>

<div className="flex justify-between">

<div>

<h2 className="text-2xl font-bold">

{i.name}

</h2>

<p>

AI Score:

{i.score}

</p>

</div>

<div>

{i.status}

</div>

</div>

</div>

)

)

}

</div>

</div>

)

}