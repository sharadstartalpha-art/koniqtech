"use client"

import {

PayPalScriptProvider,
PayPalButtons

}

from "@paypal/react-paypal-js"

export default function Page(){

return(

<div className="space-y-8">

<h1 className="text-5xl font-bold">

Payments

</h1>

<div className="
bg-white
rounded-3xl
p-8
border
">

<PayPalScriptProvider

options={{

clientId:

process.env
.NEXT_PUBLIC_PAYPAL!

}}

>

<PayPalButtons

createOrder={(data,actions)=>{

return actions.order.create({

intent:"CAPTURE",

purchase_units:[

{

amount:{

currency_code:

"USD",

value:

"100.00"

}

}

]

})

}}

onApprove={

async(

data,
actions

)=>{

await actions
?.order
?.capture()

alert(
"Payment success"
)

}

}

/>

</PayPalScriptProvider>

</div>

</div>

)

}