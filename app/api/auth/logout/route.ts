import { NextResponse } from "next/server"

export async function GET() {

  const response =
    NextResponse.redirect(

      new URL(
        "/login",
        process.env.NEXT_PUBLIC_APP_URL ||
        "https://koniqtech.com"
      )

    )

  response.cookies.set(
    "auth",
    "",
    {
      expires:new Date(0),
      path:"/"
    }
  )

  response.cookies.set(
    "tenant",
    "",
    {
      expires:new Date(0),
      path:"/"
    }
  )

  return response
}

export async function POST(){

  const response=
    NextResponse.json({
      success:true
    })

  response.cookies.delete(
    "auth"
  )

  response.cookies.delete(
    "tenant"
  )

  return response

}