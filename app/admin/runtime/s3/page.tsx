export default function Page(){

return(

<div>

<h1 className="text-5xl font-bold mb-8">

S3 Storage

</h1>

<div className="grid grid-cols-4 gap-6">

<Card
t="Files"
v="12k"
/>

<Card
t="Used"
v="82GB"
/>

<Card
t="Images"
v="9k"
/>

<Card
t="Docs"
v="3k"
/>

</div>

</div>

)

}

function Card({t,v}:any){

return(

<div className="bg-white rounded-3xl p-8">

{t}

<h2 className="text-4xl font-bold">

{v}

</h2>

</div>

)

}