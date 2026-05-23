export default function Page(){

return(

<div className="grid grid-cols-3 gap-6">

<Card t="Revenue" v="$28k"/>
<Card t="Transactions" v="123"/>
<Card t="Refunds" v="2"/>

</div>

)

}

function Card({t,v}:any){

return(

<div className="
bg-white
border
rounded-3xl
p-8
">

<h2>{t}</h2>

<h1>{v}</h1>

</div>

)

}