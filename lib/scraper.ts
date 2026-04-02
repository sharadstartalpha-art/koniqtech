import axios from "axios"

export function extractEmails(html: string): string[] {
  try {
    const matches = html.match(
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
    )

    const emails = (matches || []) as string[] // ✅ FIX

    return [...new Set(emails)]
  } catch {
    return []
  }
}