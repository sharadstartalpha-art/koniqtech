import { NextResponse } from "next/server"

export async function GET(){

try{

const auth=

Buffer.from(

`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`

).toString(

"base64"

)

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

const token=

await tokenRes.json()

const accessToken=

token.access_token

if(!accessToken){

return NextResponse.json(

{

error:

"paypal auth failed"

},

{

status:500

}

)

}

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

plan_id:

process.env.PAYPAL_PLAN_ID,

application_context:{

brand_name:

"KONIQ CRM",

locale:

"en-US",

user_action:

"SUBSCRIBE_NOW",

return_url:

`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,

cancel_url:

`${process.env.NEXT_PUBLIC_APP_URL}/subscriptions/paypal`

}

})

}

)

const data=

await subRes.json()

const approve=

data.links?.find(

(x:any)=>

x.rel===

"approve"

)

if(!approve){

console.log(data)

return NextResponse.json(

{

error:

"paypal subscription failed"

},

{

status:500

}

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

error:

"server error"

},

{

status:500

}

)

}

}