import {
Star
} from "lucide-react"

const testimonials=[

{
name:"Mike Johnson",
company:"Roofing Company",

quote:
"Koniqtech replaced three different systems for us. Everything from leads to jobs is now in one place."
},

{
name:"Sarah Williams",
company:"HVAC Business",

quote:
"The dispatch board and AI automation save us hours every week."
},

{
name:"David Brown",
company:"Plumbing Company",

quote:
"Our lead conversion rate increased significantly after moving to Koniqtech."
}

]

export default function Testimonials(){

return(

<section>

<div className="text-center">

<div className="
inline-flex

px-4
py-2

rounded-full

bg-orange-500/10

text-orange-400

mb-6
">

Testimonials

</div>

<h2 className="
text-5xl
font-bold

text-white
">

Loved by Service Businesses

</h2>

<p className="
text-slate-400

mt-6

text-xl
">

See what our customers say.

</p>

</div>

<div className="
grid

lg:grid-cols-3

gap-6

mt-16
">

{

testimonials.map(

(item,index)=>(

<div

key={index}

className="
bg-slate-900

border
border-slate-800

rounded-3xl

p-8
"

>

<div className="
flex
gap-1

mb-5
">

{

Array.from({

length:5

}).map(

(_,i)=>(

<Star

key={i}

size={16}

fill="currentColor"

className="
text-orange-500
"
/>

)

)

}

</div>

<p className="
text-slate-300

leading-8
">

"{item.quote}"

</p>

<div className="
mt-8
pt-6

border-t
border-slate-800
">

<h4 className="
font-semibold
text-white
">

{item.name}

</h4>

<p className="
text-slate-500
">

{item.company}

</p>

</div>

</div>

)

)

}

</div>

</section>

)

}