export default function Page(){

return(

<div>

<h1 className="
text-5xl
font-bold
mb-8
">

Reports

</h1>

<div className="
grid
grid-cols-4
gap-6
">

<Card title="Revenue"/>
<Card title="Leads"/>
<Card title="Jobs"/>
<Card title="Conversion"/>

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
p-10
">

{title}

</div>

)

}