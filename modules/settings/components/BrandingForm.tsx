export default function BrandingForm(){

return(

<div className="
max-w-2xl
p-8
space-y-4
">

<h1 className="
text-4xl
font-bold
">

Branding

</h1>

<input
placeholder="Company Name"
className="
border
p-3
w-full
rounded
"
/>

<input
placeholder="Primary Color"
className="
border
p-3
w-full
rounded
"
/>

<input
placeholder="Subdomain"
className="
border
p-3
w-full
rounded
"
/>

<button className="
bg-black
text-white
px-5
py-3
rounded
">

Save

</button>

</div>

)

}