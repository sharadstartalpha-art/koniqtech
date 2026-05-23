export default function Page(){

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">
Redis
</h1>

<div className="grid grid-cols-4 gap-6">

<Card title="Memory" value="512MB"/>
<Card title="Keys" value="12034"/>
<Card title="Hit Rate" value="98%"/>
<Card title="Status" value="ONLINE"/>

</div>

</div>

)

}

function Card({title,value}:any){

return(

<div className="bg-white border p-8 rounded-3xl">

<h2>{title}</h2>

<h1 className="text-4xl font-bold">
{value}
</h1>

</div>

)

}