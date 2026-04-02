import { NextResponse } from "next/server"
import axios from "axios"
import { extractEmails } from "@/lib/scraper"

export async function POST(req: Request) {
  try {
    const { query } = await req.json()

    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY!

    const searchRes = await axios.get(
      "https://maps.googleapis.com/maps/api/place/textsearch/json",
      {
        params: { query, key: GOOGLE_API_KEY },
      }
    )

    const results = searchRes.data.results || []
    const leads: any[] = []

    for (const place of results.slice(0, 5)) {
      const detailsRes = await axios.get(
        "https://maps.googleapis.com/maps/api/place/details/json",
        {
          params: {
            place_id: place.place_id,
            key: GOOGLE_API_KEY,
          },
        }
      )

      const website = detailsRes.data.result?.website || null

      let email = null
      if (website) {
        const emails = await extractEmails(website)
        email = emails[0] || null
      }

     leads.push({
  name: place.name,
  website,
  contactEmail: email, // ✅ FIXED
})
    }

    return NextResponse.json({ leads })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ leads: [] })
  }
}