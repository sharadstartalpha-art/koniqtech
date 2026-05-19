export default function KpiCard({
title,
value
}:{
title:string
value:string
}){

return(

<div className="
bg-white
rounded-xl
p-6
shadow
">

<p>

{title}

</p>

<h2 className="
text-3xl
font-bold
">

{value}

</h2>

</div>

)

}