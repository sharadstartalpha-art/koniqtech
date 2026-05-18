import Card from "./Card"

export default function StatCard({

title,

value

}:{

title:string

value:string

}){

return(

<Card>

<p className="
text-sm
text-gray-500
">

{title}

</p>

<h2 className="
text-3xl
font-bold
mt-2
">

{value}

</h2>

</Card>

)

}