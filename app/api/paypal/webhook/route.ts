import {

NextRequest,

NextResponse

}

from "next/server"

import {

syncPayPal

}

from "@/modules/billing/services/paypal-sync"

export async function POST(

request:NextRequest

){

const body=

await request.json()

console.log(

"paypal webhook",

body

)

await syncPayPal()

return NextResponse.json({

ok:true

})

}