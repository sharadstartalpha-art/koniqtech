export default function Page(){

return(

<div className="max-w-4xl">

<h1 className="text-5xl font-bold mb-8">

Security

</h1>

<div className="bg-white rounded-3xl p-10 space-y-6">

<input

type="password"

placeholder="Current Password"

className="w-full border p-5 rounded-xl"

/>

<input

type="password"

placeholder="New Password"

className="w-full border p-5 rounded-xl"

/>

<input

type="password"

placeholder="Confirm Password"

className="w-full border p-5 rounded-xl"

/>

<label className="flex gap-4">

<input type="checkbox"/>

Enable 2FA

</label>

<button className="bg-red-600 text-white px-8 py-4 rounded-xl">

Update Security

</button>

</div>

</div>

)

}