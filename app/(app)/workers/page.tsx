export default function Page(){

const q=[
"Email",
"SMS",
"Dispatch",
"AI",
"PDF"
]

return(

<div className="space-y-8">

<h1 className="text-5xl">
Workers
</h1>

{q.map(i=>(

<div
key={i}
className="
bg-white
border
p-5
rounded-xl
"
>

{i}

RUNNING

</div>

))}

</div>

)

}