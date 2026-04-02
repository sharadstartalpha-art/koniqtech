import axios from "axios"
import * as cheerio from "cheerio"

export async function extractEmails(url: string): Promise<string[]> {
  try {
    const res = await axios.get(url, {
      timeout: 10000,
    })

    const html = res.data

    // 👉 Regex email extraction
    const emails =
      html.match(
        /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi
      ) || []

    // 👉 Remove duplicates
    return [...new Set(emails)]
  } catch (err) {
    console.log("Email scrape failed:", url)
    return []
  }
}