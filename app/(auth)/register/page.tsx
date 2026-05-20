import Link from "next/link"

export default function Register(){

return(

<div className="
min-h-screen
grid
lg:grid-cols-2
">

<div className="
bg-blue-700
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

Start Free

</h1>

<p className="
text-xl
mt-6
">

Launch your CRM in minutes

</p>

</div>

<div className="
bg-slate-100
flex
items-center
justify-center
">

<div className="
bg-white
w-[560px]
rounded-3xl
shadow-xl
p-12
">

<h1 className="
text-5xl
font-bold
mb-8
">

Create Account

</h1>

<form className="
space-y-5
">

<div className="space-y-4">

<input

placeholder="Name"

className="

w-full
h-14

rounded-2xl

bg-white

border
border-slate-300

px-5

text-black

placeholder:text-slate-400

"

/>

<input

placeholder="Company"

className="

w-full
h-14

rounded-2xl

bg-white

border
border-slate-300

px-5

text-black

placeholder:text-slate-400

"

/>

<input

placeholder="Email"

className="

w-full
h-14

rounded-2xl

bg-white

border
border-slate-300

px-5

text-black

placeholder:text-slate-400

"

/>

<input

type="password"

placeholder="Password"

className="

w-full
h-14

rounded-2xl

bg-white

border
border-slate-300

px-5

text-black

placeholder:text-slate-400

"

/>

</div>

<button
className="
w-full
bg-blue-600
text-white
p-4
rounded-xl
"
>

Register

</button>

</form>

<p className="
text-center
mt-8
">

Already registered?

<Link
href="/login"
className="
text-blue-600
ml-2
"
>

Login

</Link>

</p>

</div>

</div>

</div>

)

}