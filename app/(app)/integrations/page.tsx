async function load(){

const r=
await fetch(
process.env.NEXT_PUBLIC_APP_URL+
"/api/integrations",
{
cache:"no-store"
}
)

return r.json()

}

export default async function Page(){

const items=
await load()

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">
Integrations
</h1>

<div className="
grid
grid-cols-4
gap-6
">

{items.map((i:any)=>(

<div
key={i.id}
className="
bg-white
border
rounded-3xl
p-8
"
>

<h2 className="font-bold">
{i.name}
</h2>

<p>
{i.status}
</p>

</div>

))}

</div>

</div>

)

}