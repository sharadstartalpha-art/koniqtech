export default function Page(){

return(

<div>

<h1 className="text-5xl font-bold mb-8">

Playwright

</h1>

<div className="grid grid-cols-3 gap-6">

<Card
t="Tests"
v="240"
/>

<Card
t="Passed"
v="232"
/>

<Card
t="Coverage"
v="91%"
/>

</div>

</div>

)

}

function Card({t,v}:any){

return(

<div className="bg-white rounded-3xl p-8">

{t}

<h2 className="text-4xl font-bold">

{v}

</h2>

</div>

)

}