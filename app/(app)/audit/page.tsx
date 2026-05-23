export default function Page(){

const logs=[

"Job Updated",

"Invoice Created",

"Payment Received"

]

return(

<div className="space-y-4">

{logs.map(i=>(

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

</div>

))}

</div>

)

}