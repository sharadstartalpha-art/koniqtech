export default function BrandingForm(){

return(

<div className="
space-y-6
max-w-xl
">

<h1 className="
text-4xl
font-bold
">

Brand Settings

</h1>

<input
placeholder="Company Name"
className="
w-full
border
p-3
rounded-xl
"
/>

<input
placeholder="Primary Color"
className="
w-full
border
p-3
rounded-xl
"
/>

<input
type="file"
/>

<button className="
bg-black
text-white
px-6
py-3
rounded-xl
">

Save

</button>

</div>

)

}