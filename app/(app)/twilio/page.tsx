export default function Page(){

return(

<div className="
space-y-8
">

<h1 className="
text-5xl
font-bold
">

Twilio Center

</h1>

<div className="
grid
grid-cols-3
gap-6
">

<Card
title="SMS"
/>

<Card
title="Voice"
/>

<Card
title="Campaigns"
/>

</div>

<div className="
bg-white
border
rounded-3xl
p-8
">

<input

placeholder="
Send SMS
"

className="
w-full
border
rounded-xl
p-5
"

/>

</div>

</div>

)

}

function Card({title}:any){

return(

<div className="
bg-white
border
rounded-3xl
p-8
">

{title}

</div>

)

}