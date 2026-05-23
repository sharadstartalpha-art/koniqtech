export default function Page(){

return(

<div className="
space-y-8
">

<h1 className="
text-5xl
font-bold
">

OpenAI

</h1>

<div className="
grid
grid-cols-4
gap-6
">

<Card title="Quotes"/>

<Card title="Voice"/>

<Card title="RAG"/>

<Card title="Automation"/>

</div>

<textarea

className="
w-full
h-[300px]
border
rounded-3xl
p-6
"

placeholder="
Ask AI
"

/>

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