export default function Page(){

return(

<div className="max-w-5xl mx-auto">

<div className="bg-white rounded-3xl p-10">

<h1 className="text-5xl font-bold mb-10">

Property Profile

</h1>

<div className="grid grid-cols-2 gap-6">

<input

placeholder="Property Type"

className="border p-5 rounded-xl"

/>

<input

placeholder="Square Feet"

className="border p-5 rounded-xl"

/>

<input

placeholder="Roof Age"

className="border p-5 rounded-xl"

/>

<input

placeholder="Floors"

className="border p-5 rounded-xl"

/>

<textarea

placeholder="Notes"

className="border p-5 rounded-xl col-span-2"

/>

</div>

</div>

</div>

)

}