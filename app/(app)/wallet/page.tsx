export default function Page(){

return(

<div>

<h1 className="text-5xl font-bold mb-8">

Wallet

</h1>

<div className="grid grid-cols-3 gap-8">

<div className="bg-white rounded-3xl p-10">

<p>

Balance

</p>

<h2 className="text-4xl font-bold">

$12,490

</h2>

</div>

<div className="bg-white rounded-3xl p-10">

<p>

Pending

</p>

<h2 className="text-4xl font-bold">

$2,100

</h2>

</div>

<div className="bg-white rounded-3xl p-10">

<p>

Withdrawn

</p>

<h2 className="text-4xl font-bold">

$18,000

</h2>

</div>

</div>

</div>

)

}