import Link from "next/link"
import {
BookOpen,
ArrowRight
} from "lucide-react"

const docs=[

"Getting Started",
"Lead Management",
"Customers",
"Jobs",
"Dispatch",
"Invoices",
"AI Assistant",
"Reports"

]

export default function DocsPage(){

return(

<div className="
min-h-screen
bg-slate-950
text-white
">

<section className="
max-w-6xl
mx-auto
px-6
py-24
">

<div className="text-center">

<div className="
inline-flex
gap-2
px-4
py-2
rounded-full
bg-orange-500/10
text-orange-400
mb-6
">

<BookOpen size={16}/>

Documentation

</div>

<h1 className="
text-6xl
font-bold
">

Documentation

</h1>

<p className="
text-slate-400
text-xl
mt-6
">

Learn how to use Koniqtech.

</p>

</div>

<div className="
grid
md:grid-cols-2
gap-6
mt-16
">

{
docs.map(doc=>(

<Link
href="#"
key={doc}
>

<div className="
bg-slate-900
border
border-slate-800
rounded-3xl
p-8
hover:border-orange-500/30
transition
">

<h3 className="
text-2xl
font-semibold
">

{doc}

</h3>

<div className="
flex
items-center
gap-2
text-orange-500
mt-4
">

Read Guide

<ArrowRight size={18}/>

</div>

</div>

</Link>

))
}

</div>

</section>

</div>

)

}