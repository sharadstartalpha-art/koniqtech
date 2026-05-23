export default function Page(){

const tests=[
"Auth",
"Customers",
"Leads",
"Quotes",
"Jobs",
"Dispatch",
"Payments",
"Notifications"
]

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">
Tests
</h1>

<div className="grid grid-cols-4 gap-6">

{tests.map(t=>(

<div
key={t}
className="
bg-white
border
rounded-3xl
p-8
"
>

<h2 className="font-bold">
{t}
</h2>

<p>
Ready
</p>

</div>

))}

</div>

</div>

)

}