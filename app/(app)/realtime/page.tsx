export default function Page(){

const streams=[

"Dispatch",
"GPS",
"Chat",
"Notifications"

]

return(

<div className="grid grid-cols-4 gap-6">

{streams.map(i=>(

<div
key={i}
className="
bg-white
border
rounded-3xl
p-8
"
>

{i}

LIVE

</div>

))}

</div>

)

}