import {
NextRequest,
NextResponse
}

from "next/server"

export async function POST(

request:
NextRequest

){

const body=
await request.json()

console.log(

"PAYPAL",

body

)

switch(
body.event_type
){

case
"BILLING.SUBSCRIPTION.ACTIVATED":

console.log(
"ACTIVE"
)

break

case
"PAYMENT.SALE.COMPLETED":

console.log(
"PAID"
)

break

}

return NextResponse
.json({

ok:true

})

}