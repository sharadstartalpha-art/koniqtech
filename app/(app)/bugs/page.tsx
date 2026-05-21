export default function Bugs(){

return(

<div className="
grid
grid-cols-3
gap-6
">

<Card

t="Open"

v="12"

/>

<Card

t="Fixed"

v="20"

/>

<Card

t="Critical"

v="1"

/>

</div>

)

}

function Card(

p:any

){

return(

<div className="
bg-white
rounded-xl
p-8
">

<h2>

{p.t}

</h2>

<p className="
text-4xl
font-bold
">

{p.v}

</p>

</div>

)

}