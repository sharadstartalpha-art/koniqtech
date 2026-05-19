import twilioPkg from "twilio"

export const twilio=

twilioPkg(

process.env.TWILIO_SID!,

process.env.TWILIO_TOKEN!

)