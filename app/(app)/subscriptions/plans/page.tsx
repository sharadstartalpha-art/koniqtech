export default function Plans(){

const plans=[

{
name:"Starter",
price:"99"
},

{
name:"Pro",
price:"249"
},

{
name:"Enterprise",
price:"599"
}

]

return(

<div className="grid md:grid-cols-3 gap-6">

{

plans.map(
x=>(

<div
key={x.name}
className="
bg-white
rounded-xl
p-8
shadow
"
>

<h2 className="text-xl font-bold">

{x.name}

</h2>

<p className="
text-4xl
font-bold
mt-4
">

${x.price}

</p>

</div>

)

)

}

</div>

)

}