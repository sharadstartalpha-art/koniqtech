export default function Page(){

return(

<div className="grid grid-cols-2 gap-6">

<Card
title="Jobs"
/>

<Card
title="GPS"
/>

<Card
title="Camera"
/>

<Card
title="Offline"
/>

</div>

)

}

function Card({
title
}:any){

return(

<div className="border rounded-3xl p-8">

{title}

</div>

)

}