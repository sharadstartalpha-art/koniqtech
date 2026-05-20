export default function Settings(){

return(

<div className="space-y-8">

<h1 className="text-4xl font-bold">

Settings

</h1>

<div className="grid grid-cols-2 gap-8">

<div className="bg-white p-8 rounded-3xl">

<h2 className="font-bold">

Organization

</h2>

<input
placeholder="Company"
className="w-full mt-6 p-4 border rounded-xl"
/>

<input
placeholder="Email"
className="w-full mt-4 p-4 border rounded-xl"
/>

<button className="mt-6 bg-blue-600 text-white p-4 rounded-xl">

Save

</button>

</div>

<div className="bg-white p-8 rounded-3xl">

<h2 className="font-bold">

Branding

</h2>

<div className="h-48 bg-slate-100 rounded-2xl mt-6"/>

<button className="mt-6 bg-slate-900 text-white p-4 rounded-xl">

Upload Logo

</button>

</div>

</div>

</div>

)

}