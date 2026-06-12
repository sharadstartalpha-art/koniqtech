export default function ContactPage(){

return(

<div className="
min-h-screen
bg-slate-950
text-white
">

<section className="
max-w-4xl
mx-auto
px-6
py-24
">

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
Contact
</div>

<h1 className="
text-6xl
font-bold
">
Let's Talk
</h1>

<p className="
text-slate-400
text-xl
mt-6
">
Have questions about Koniqtech?
We'd love to hear from you.
</p>

</div>

<form className="
bg-slate-900
border
border-slate-800
rounded-3xl
p-10
mt-16
space-y-5
">

<input
placeholder="Name"
className="
w-full
h-14
px-5
rounded-xl
bg-slate-800
"
/>

<input
placeholder="Company"
className="
w-full
h-14
px-5
rounded-xl
bg-slate-800
"
/>

<input
placeholder="Email"
className="
w-full
h-14
px-5
rounded-xl
bg-slate-800
"
/>

<textarea
placeholder="Message"
className="
w-full
h-40
p-5
rounded-xl
bg-slate-800
"
/>

<button
className="
bg-orange-500
hover:bg-orange-600
px-8
py-4
rounded-xl
"
>

Send Message

</button>

</form>

</section>

</div>

)

}