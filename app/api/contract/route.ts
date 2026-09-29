import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const CONTACT_EMAIL = "info@koniqtech.com"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : ""

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : ""

    const company =
      typeof body.company === "string"
        ? body.company.trim()
        : ""

    const phone =
      typeof body.phone === "string"
        ? body.phone.trim()
        : ""

    const industry =
      typeof body.industry === "string"
        ? body.industry.trim()
        : ""

    const message =
      typeof body.message === "string"
        ? body.message.trim()
        : ""

    /* -----------------------------------------
       VALIDATION
    ----------------------------------------- */

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter your name.",
        },
        { status: 400 }
      )
    }

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter your email address.",
        },
        { status: 400 }
      )
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address.",
        },
        { status: 400 }
      )
    }

    if (!message) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter your message.",
        },
        { status: 400 }
      )
    }

    if (message.length > 5000) {
      return NextResponse.json(
        {
          success: false,
          message: "Message is too long.",
        },
        { status: 400 }
      )
    }

    /* -----------------------------------------
       SEND EMAIL
    ----------------------------------------- */

    const { error } = await resend.emails.send({
      from:
        process.env.RESEND_FROM_EMAIL ||
        "KoniqTech Website <noreply@koniqtech.com>",

      to: CONTACT_EMAIL,

      replyTo: email,

      subject: `New Contact Form Submission — ${name}`,

      html: `
        <div
          style="
            font-family: Arial, Helvetica, sans-serif;
            max-width: 700px;
            margin: 0 auto;
            padding: 30px;
            color: #0f172a;
          "
        >

          <h2
            style="
              margin-bottom: 25px;
              color: #0f172a;
            "
          >
            New Contact Form Submission
          </h2>

          <table
            style="
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            "
          >

            <tr>
              <td
                style="
                  padding: 12px;
                  font-weight: bold;
                  border-bottom: 1px solid #e2e8f0;
                  width: 150px;
                "
              >
                Name
              </td>

              <td
                style="
                  padding: 12px;
                  border-bottom: 1px solid #e2e8f0;
                "
              >
                ${escapeHtml(name)}
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding: 12px;
                  font-weight: bold;
                  border-bottom: 1px solid #e2e8f0;
                "
              >
                Email
              </td>

              <td
                style="
                  padding: 12px;
                  border-bottom: 1px solid #e2e8f0;
                "
              >
                ${escapeHtml(email)}
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding: 12px;
                  font-weight: bold;
                  border-bottom: 1px solid #e2e8f0;
                "
              >
                Company
              </td>

              <td
                style="
                  padding: 12px;
                  border-bottom: 1px solid #e2e8f0;
                "
              >
                ${escapeHtml(company || "Not provided")}
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding: 12px;
                  font-weight: bold;
                  border-bottom: 1px solid #e2e8f0;
                "
              >
                Phone
              </td>

              <td
                style="
                  padding: 12px;
                  border-bottom: 1px solid #e2e8f0;
                "
              >
                ${escapeHtml(phone || "Not provided")}
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding: 12px;
                  font-weight: bold;
                  border-bottom: 1px solid #e2e8f0;
                "
              >
                Industry
              </td>

              <td
                style="
                  padding: 12px;
                  border-bottom: 1px solid #e2e8f0;
                "
              >
                ${escapeHtml(industry || "Not provided")}
              </td>
            </tr>

          </table>

          <h3
            style="
              margin-bottom: 10px;
              color: #0f172a;
            "
          >
            Message
          </h3>

          <div
            style="
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 10px;
              padding: 20px;
              line-height: 1.7;
              white-space: pre-wrap;
            "
          >
            ${escapeHtml(message)}
          </div>

          <div
            style="
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
              color: #64748b;
              font-size: 13px;
            "
          >
            Sent from the KoniqTech website contact form.
          </div>

        </div>
      `,
    })

    if (error) {
      console.error(
        "[CONTACT_EMAIL_ERROR]",
        error
      )

      return NextResponse.json(
        {
          success: false,
          message:
            "We could not send your message right now. Please try again.",
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Thank you! Your message has been sent successfully.",
      },
      { status: 200 }
    )
  } catch (error) {
    console.error(
      "[CONTACT_API_ERROR]",
      error
    )

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong. Please try again.",
      },
      { status: 500 }
    )
  }
}

/* -----------------------------------------
   HTML ESCAPE
----------------------------------------- */

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}