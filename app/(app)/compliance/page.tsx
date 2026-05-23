export default function Page(){

return(

<div className="grid grid-cols-3 gap-6">

<Card title="SOC2"/>
<Card title="GDPR"/>
<Card title="HIPAA"/>

</div>

)

}

function Card({title}:any){

return(

<div className="
border
rounded-3xl
bg-white
p-8
">

{title}

</div>

)

}