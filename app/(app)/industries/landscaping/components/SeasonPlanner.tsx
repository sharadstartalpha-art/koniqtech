export default function SeasonPlanner(){

const seasons=[

"Spring",

"Summer",

"Autumn",

"Winter"

]

return(

<div className="
bg-white
border
rounded-2xl
p-6
space-y-4
">

<h2 className="
text-2xl
font-bold
">

Season Planner

</h2>

<div className="
grid
grid-cols-2
gap-4
">

{

seasons.map(

season=>(

<div

key={season}

className="
border
rounded-xl
p-5
text-center
"

>

{
season
}

</div>

)

)

}

</div>

</div>

)

}