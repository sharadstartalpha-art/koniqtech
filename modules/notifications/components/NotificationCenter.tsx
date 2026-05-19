export default function NotificationCenter(){

const notifications=[

"New lead assigned",

"Invoice paid",

"Quote approved",

"SMS delivered"

]

return(

<div className="p-8 space-y-6">

<h1 className="text-4xl font-bold">

Notifications

</h1>

{

notifications.map(

n=>(

<div
key={n}
className="
bg-white
p-5
rounded-xl
shadow
"
>

{n}

</div>

)

)

}

</div>

)

}