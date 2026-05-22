export default function Page(){

return(

<div>

<h1 className="text-5xl font-bold mb-8">

Pinecone / Qdrant

</h1>

<div className="grid grid-cols-3 gap-6">

<Box
t="Vectors"
v="248k"
/>

<Box
t="Collections"
v="42"
/>

<Box
t="Embeddings"
v="OpenAI"
/>

</div>

</div>

)

}

function Box({
t,
v
}:any){

return(

<div className="bg-white rounded-3xl p-8">

<p>{t}</p>

<h2 className="text-3xl font-bold">

{v}

</h2>

</div>

)

}