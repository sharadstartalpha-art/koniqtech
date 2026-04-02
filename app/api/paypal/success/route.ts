import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { plan } = await req.json()

  // 🔥 Replace with your real PayPal links
  const links: any = {
    PRO: "https://www.paypal.com/paypalme/YOUR_LINK/19",
    AGENCY: "https://www.paypal.com/paypalme/YOUR_LINK/49",
  }

  return NextResponse.json({
    url: links[plan],
  })
}