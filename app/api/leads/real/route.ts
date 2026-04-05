import { NextResponse } from "next/server"
import axios from "axios"
import { extractEmails } from "@/lib/scraper"
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { balance: true }, // ✅ correct
    });

    if (!user?.balance || user.balance.balance <= 0) {
      return NextResponse.json({ error: "NO_CREDITS" }, { status: 403 });
    }

    await prisma.userBalance.update({
      where: { userId: user.id },
      data: {
        balance: { decrement: 1 },
      },
    });

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
        contactEmail: email,
      })
    }

    return NextResponse.json({ leads })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ leads: [] })
  }
}