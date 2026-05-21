import { NextResponse } from "next/server"

export async function GET(){

try{

const auth=

Buffer.from(

`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`

).toString("base64")

const tokenRes=

await fetch(

"https://api-m.paypal.com/v1/oauth2/token",

{

method:"POST",

headers:{

Authorization:

`Basic ${auth}`,

"Content-Type":

"application/x-www-form-urlencoded"

},

body:

"grant_type=client_credentials"

}

)

const tokenData=

await tokenRes.json()

const accessToken=

tokenData.access_token

const planId=

process.env.PAYPAL_PLAN_ID

const subRes=

await fetch(

"https://api-m.paypal.com/v1/billing/subscriptions",

{

method:"POST",

headers:{

Authorization:

`Bearer ${accessToken}`,

"Content-Type":

"application/json"

},

body:JSON.stringify({

plan_id:planId,

application_context:{

brand_name:

"KONIQ CRM",

return_url:

`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,

cancel_url:

`${process.env.NEXT_PUBLIC_APP_URL}/subscriptions/paypal`

}

})

}

)

const subscription=

await subRes.json()

const approve=

subscription.links?.find(

(x:any)=>

x.rel==="approve"

)

if(!approve){

return NextResponse.redirect(

`${process.env.NEXT_PUBLIC_APP_URL}/subscriptions/paypal`

)

}

return NextResponse.redirect(

approve.href

)

}

catch(e){

console.error(e)

return NextResponse.json(

{

error:"paypal failed"

},

{

status:500

}

)

}

}