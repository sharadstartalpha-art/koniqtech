export default function Page(){

return(

<div className="grid grid-cols-3 gap-6">

<Card t="Chunks" v="12k"/>
<Card t="Vectors" v="45k"/>
<Card t="Embeddings" v="READY"/>

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

{t}

{v}

</div>

)

}