import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(
  process.env.RESEND_API_KEY
)

const TO_EMAIL = "info@koniqtech.com"

export async function POST(
  request: NextRequest
) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error(
        "[CONTACT_API] RESEND_API_KEY is missing"
      )

      return NextResponse.json(
        {
          success: false,
          message:
            "Email service is not configured.",
        },
        {
          status: 500,
        }
      )
    }

    let body: unknown

    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request.",
        },
        {
          status: 400,
        }
      )
    }

    if (
      typeof body !== "object" ||
      body === null
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body.",
        },
        {
          status: 400,
        }
      )
    }

    const data = body as Record<
      string,
      unknown
    >

    /*
    --------------------------------------------------
    HONEYPOT
    --------------------------------------------------
    */

    const website =
      typeof data.website === "string"
        ? data.website.trim()
        : ""

    if (website) {
      /*
      Silently accept bot submissions.
      Do not reveal that the field is a honeypot.
      */
      return NextResponse.json({
        success: true,
        message: "Message received.",
      })
    }

    /*
    --------------------------------------------------
    EXTRACT FIELDS
    --------------------------------------------------
    */

    const name =
      typeof data.name === "string"
        ? data.name.trim()
        : ""

    const email =
      typeof data.email === "string"
        ? data.email.trim().toLowerCase()
        : ""

    const company =
      typeof data.company === "string"
        ? data.company.trim()
        : ""

    const phone =
      typeof data.phone === "string"
        ? data.phone.trim()
        : ""

    const industry =
      typeof data.industry === "string"
        ? data.industry.trim()
        : ""

    const message =
      typeof data.message === "string"
        ? data.message.trim()
        : ""

    /*
    --------------------------------------------------
    VALIDATION
    --------------------------------------------------
    */

    if (!name || name.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please enter your full name.",
        },
        {
          status: 400,
        }
      )
    }

    if (name.length > 100) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Name is too long.",
        },
        {
          status: 400,
        }
      )
    }

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please enter your email address.",
        },
        {
          status: 400,
        }
      )
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please enter a valid email address.",
        },
        {
          status: 400,
        }
      )
    }

    if (!message || message.length < 5) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please tell us how we can help.",
        },
        {
          status: 400,
        }
      )
    }

    if (message.length > 5000) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Message is too long.",
        },
        {
          status: 400,
        }
      )
    }

    /*
    --------------------------------------------------
    EMAIL CONTENT
    --------------------------------------------------
    */

    const submittedAt =
      new Date().toLocaleString(
        "en-US",
        {
          dateStyle: "medium",
          timeStyle: "short",
          timeZone: "UTC",
        }
      )

    const subject =
      `New Contact Enquiry — ${name}${
        company
          ? ` | ${company}`
          : ""
      }`

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; color: #0f172a;">
        <div style="background: #0f172a; padding: 28px 32px; border-radius: 12px 12px 0 0;">
          <h1 style="margin: 0; color: white; font-size: 24px;">
            New KoniqTech Contact Enquiry
          </h1>
        </div>

        <div style="border: 1px solid #e2e8f0; border-top: 0; padding: 32px; border-radius: 0 0 12px 12px;">
          
          <h2 style="margin-top: 0; font-size: 18px;">
            Contact Information
          </h2>

          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; font-weight: bold; width: 150px;">
                Name
              </td>
              <td style="padding: 10px 0;">
                ${escapeHtml(name)}
              </td>
            </tr>

            <tr>
              <td style="padding: 10px 0; font-weight: bold;">
                Email
              </td>
              <td style="padding: 10px 0;">
                ${escapeHtml(email)}
              </td>
            </tr>

            <tr>
              <td style="padding: 10px 0; font-weight: bold;">
                Company
              </td>
              <td style="padding: 10px 0;">
                ${escapeHtml(company || "Not provided")}
              </td>
            </tr>

            <tr>
              <td style="padding: 10px 0; font-weight: bold;">
                Phone
              </td>
              <td style="padding: 10px 0;">
                ${escapeHtml(phone || "Not provided")}
              </td>
            </tr>

            <tr>
              <td style="padding: 10px 0; font-weight: bold;">
                Industry
              </td>
              <td style="padding: 10px 0;">
                ${escapeHtml(industry || "Not provided")}
              </td>
            </tr>

            <tr>
              <td style="padding: 10px 0; font-weight: bold;">
                Submitted
              </td>
              <td style="padding: 10px 0;">
                ${escapeHtml(submittedAt)} UTC
              </td>
            </tr>
          </table>

          <hr style="margin: 28px 0; border: 0; border-top: 1px solid #e2e8f0;" />

          <h2 style="font-size: 18px;">
            Message
          </h2>

          <div style="background: #f8fafc; padding: 20px; border-radius: 10px; line-height: 1.7; white-space: pre-wrap;">
            ${escapeHtml(message)}
          </div>

          <div style="margin-top: 28px;">
            <a
              href="mailto:${escapeHtml(email)}"
              style="display: inline-block; background: #f97316; color: white; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-weight: bold;"
            >
              Reply To ${escapeHtml(name)}
            </a>
          </div>

        </div>
      </div>
    `

    /*
    --------------------------------------------------
    SEND EMAIL
    --------------------------------------------------
    */

    const fromEmail =
      process.env.RESEND_FROM_EMAIL ||
      "KoniqTech <onboarding@resend.dev>"

    const result =
      await resend.emails.send({
        from: fromEmail,
        to: [TO_EMAIL],
        replyTo: email,
        subject,
        html,
      })

    if (result.error) {
      console.error(
        "[CONTACT_API_RESEND_ERROR]",
        result.error
      )

      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to send your message right now. Please try again.",
        },
        {
          status: 500,
        }
      )
    }

    return NextResponse.json({
      success: true,
      message:
        "Your message has been sent successfully.",
    })
  } catch (error) {
    console.error(
      "[CONTACT_API_POST]",
      error
    )

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong. Please try again.",
      },
      {
        status: 500,
      }
    )
  }
}

/*
--------------------------------------------------
HTML ESCAPE
--------------------------------------------------
*/

function escapeHtml(
  value: string
) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}