export default function Page(){

return(

<div className="space-y-8">

<h1 className="text-4xl font-bold">

Coupons

</h1>

<div className="bg-white p-8 rounded-3xl border">

<input

placeholder="Coupon code"

className="border p-4 rounded-xl w-full mb-5"

/>

<input

placeholder="Discount %"

className="border p-4 rounded-xl w-full mb-5"

/>

<button

className="bg-blue-600 text-white px-8 py-4 rounded-xl"

>

Create Coupon

</button>

</div>

</div>

)

}