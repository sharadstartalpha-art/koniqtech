import { NextResponse } from "next/server"

export async function POST() {
  try {

    const PAYPAL_CLIENT =
      process.env.PAYPAL_CLIENT_ID!

    const PAYPAL_SECRET =
      process.env.PAYPAL_SECRET!

    const auth = Buffer
      .from(
        `${PAYPAL_CLIENT}:${PAYPAL_SECRET}`
      )
      .toString("base64")

    const tokenRes =
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

    const tokenData =
      await tokenRes.json()

    return NextResponse.json(
      tokenData
    )

  } catch(e){

    return NextResponse.json(
      {error:String(e)},
      {status:500}
    )

  }
}