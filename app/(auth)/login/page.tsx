import Link from "next/link"

export default function Login(){

return(

<div className="
min-h-screen
grid
lg:grid-cols-2
">

<div className="
bg-slate-950
text-white
p-20
flex
flex-col
justify-center
">

<h1 className="
text-6xl
font-bold
">

KONIQ CRM

</h1>

<p className="
text-xl
text-slate-300
mt-6
">

AI CRM for home service companies

</p>

</div>

<div className="
flex
items-center
justify-center
bg-slate-100
">

<div className="
bg-white
w-[520px]
rounded-3xl
shadow-2xl
p-12
">

<h1 className="
text-5xl
font-bold
mb-10
">

Login

</h1>

<form className="
space-y-5
">

<input
placeholder="Email"
className="
w-full
p-4
rounded-xl
border
"
/>

<input
type="password"
placeholder="Password"
className="
w-full
p-4
rounded-xl
border
"
/>

<button
className="
w-full
bg-blue-600
text-white
p-4
rounded-xl
"
>

Sign In

</button>

</form>

<p className="
mt-8
text-center
">

No account?

<Link
href="/register"
className="
text-blue-600
ml-2
"
>

Register

</Link>

</p>

</div>

</div>

</div>

)

}