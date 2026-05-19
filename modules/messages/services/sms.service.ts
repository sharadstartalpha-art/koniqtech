import {twilio}

from "@/shared/lib/twilio"

export async function sendSMS(

to:string,
body:string

){

return twilio.messages.create({

to,

body,

from:

process.env.THONE!

})

}