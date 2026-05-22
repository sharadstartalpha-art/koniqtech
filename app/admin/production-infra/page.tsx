export default function Page(){

return(

<div>

<h1 className="text-5xl font-bold mb-8">

Production Infra

</h1>

<div className="space-y-5">

<Item
t="Postgres"
/>

<Item
t="Redis"
/>

<Item
t="Workers"
/>

<Item
t="CDN"
/>

<Item
t="Object Storage"
/>

</div>

</div>

)

}

function Item({

t

}:any){

return(

<div className="bg-white rounded-3xl p-8">

{t}

</div>

)

}