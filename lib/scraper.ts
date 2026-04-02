import axios from "axios"

export async function extractEmails(url: string): Promise<string[]> {
  try {
    const res = await axios.get(url)

    const emails =
      res.data.match(
        /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi
      ) || []

    return [...new Set(emails)]
  } catch {
    return []
  }
}