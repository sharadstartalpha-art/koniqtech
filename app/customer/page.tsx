export default function Page(){

return(

<div className="
min-h-screen
bg-slate-100
p-10
">

<h1 className="
text-5xl
font-bold
mb-8
">

Customer App

</h1>

<div className="
grid
grid-cols-4
gap-6
">

<Card text="Jobs"/>
<Card text="Invoices"/>
<Card text="Payments"/>
<Card text="Documents"/>

</div>

</div>

)

}

function Card({text}:any){

return(

<div className="
bg-white
rounded-3xl
p-10
">

{text}

</div>

)

}