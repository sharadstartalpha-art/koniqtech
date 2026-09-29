import { NextRequest, NextResponse } from "next/server"
import { resend } from "@/shared/lib/resend"

export const runtime = "nodejs"

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

export async function POST(request: NextRequest) {
  try {
    /*
    |--------------------------------------------------------------------------
    | Read request body
    |--------------------------------------------------------------------------
    */

    const contentType = request.headers.get("content-type") || ""

    let data: Record<string, string> = {}

    if (contentType.includes("application/json")) {
      data = await request.json()
    } else {
      const formData = await request.formData()

      formData.forEach((value, key) => {
        data[key] = value.toString()
      })
    }

    /*
    |--------------------------------------------------------------------------
    | Read fields
    |--------------------------------------------------------------------------
    */

    const name =
      data.name?.trim() || ""

    const email =
      data.email?.trim().toLowerCase() || ""

    const company =
      data.company?.trim() || ""

    const phone =
      data.phone?.trim() || ""

    const industry =
      data.industry?.trim() || ""

    const message =
      data.message?.trim() || ""

    const demo =
      data.demo === "on" ||
      data.demo === "true" ||
      data.demo === "yes"

    const privacy =
      data.privacy === "on" ||
      data.privacy === "true" ||
      data.privacy === "yes"

    /*
    |--------------------------------------------------------------------------
    | Validation
    |--------------------------------------------------------------------------
    */

    if (!name || !email || !industry || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "Please complete all required fields.",
        },
        { status: 400 }
      )
    }

    if (!privacy) {
      return NextResponse.json(
        {
          success: false,
          message: "Please accept the Privacy Policy.",
        },
        { status: 400 }
      )
    }

    if (name.length > 100) {
      return NextResponse.json(
        {
          success: false,
          message: "Name is too long.",
        },
        { status: 400 }
      )
    }

    if (email.length > 200) {
      return NextResponse.json(
        {
          success: false,
          message: "Email address is too long.",
        },
        { status: 400 }
      )
    }

    if (company.length > 150) {
      return NextResponse.json(
        {
          success: false,
          message: "Company name is too long.",
        },
        { status: 400 }
      )
    }

    if (phone.length > 50) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number is too long.",
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

    /*
    |--------------------------------------------------------------------------
    | Basic email validation
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Escape HTML
    |--------------------------------------------------------------------------
    */

    const safeName =
      escapeHtml(name)

    const safeEmail =
      escapeHtml(email)

    const safeCompany =
      escapeHtml(company)

    const safePhone =
      escapeHtml(phone)

    const safeIndustry =
      escapeHtml(industry)

    const safeMessage =
      escapeHtml(message)

    /*
    |--------------------------------------------------------------------------
    | Send email to KoniqTech
    |--------------------------------------------------------------------------
    */

    const result =
      await resend.emails.send({
        from: "KoniqTech <info@koniqtech.com>",
        to: ["info@koniqtech.com"],
        replyTo: email,

        subject:
          `New Contact Enquiry — ${industry}`,

        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>KoniqTech Contact Enquiry</title>
</head>

<body
  style="
    margin:0;
    padding:0;
    background:#f8fafc;
    font-family:Arial,Helvetica,sans-serif;
    color:#0f172a;
  "
>

  <div
    style="
      max-width:680px;
      margin:40px auto;
      padding:20px;
    "
  >

    <div
      style="
        background:#0f172a;
        color:#ffffff;
        padding:30px;
        border-radius:16px 16px 0 0;
      "
    >

      <h1
        style="
          margin:0;
          font-size:24px;
        "
      >
        New KoniqTech Contact Enquiry
      </h1>

      <p
        style="
          margin:8px 0 0;
          color:#cbd5e1;
          font-size:14px;
        "
      >
        Submitted from koniqtech.com
      </p>

    </div>

    <div
      style="
        background:#ffffff;
        border:1px solid #e2e8f0;
        border-top:0;
        padding:30px;
      "
    >

      <table
        width="100%"
        cellpadding="8"
        cellspacing="0"
        style="
          border-collapse:collapse;
          font-size:15px;
        "
      >

        <tr>
          <td
            style="
              width:150px;
              font-weight:bold;
              color:#475569;
            "
          >
            Name
          </td>

          <td>
            ${safeName}
          </td>
        </tr>

        <tr>
          <td
            style="
              font-weight:bold;
              color:#475569;
            "
          >
            Email
          </td>

          <td>
            <a
              href="mailto:${safeEmail}"
              style="color:#2563eb;"
            >
              ${safeEmail}
            </a>
          </td>
        </tr>

        <tr>
          <td
            style="
              font-weight:bold;
              color:#475569;
            "
          >
            Company
          </td>

          <td>
            ${safeCompany || "Not provided"}
          </td>
        </tr>

        <tr>
          <td
            style="
              font-weight:bold;
              color:#475569;
            "
          >
            Phone
          </td>

          <td>
            ${safePhone || "Not provided"}
          </td>
        </tr>

        <tr>
          <td
            style="
              font-weight:bold;
              color:#475569;
            "
          >
            Industry
          </td>

          <td>
            ${safeIndustry}
          </td>
        </tr>

        <tr>
          <td
            style="
              font-weight:bold;
              color:#475569;
            "
          >
            Demo Requested
          </td>

          <td>
            ${demo ? "Yes" : "No"}
          </td>
        </tr>

      </table>

      <div
        style="
          margin-top:28px;
          padding-top:24px;
          border-top:1px solid #e2e8f0;
        "
      >

        <h3
          style="
            margin:0 0 12px;
            font-size:18px;
          "
        >
          Message
        </h3>

        <div
          style="
            background:#f8fafc;
            padding:18px;
            border-radius:12px;
            line-height:1.7;
            white-space:pre-wrap;
          "
        >
          ${safeMessage}
        </div>

      </div>

    </div>

    <p
      style="
        text-align:center;
        color:#94a3b8;
        font-size:12px;
        margin-top:20px;
      "
    >
      KoniqTech Contact Form
    </p>

  </div>

</body>
</html>
        `,
      })

    /*
    |--------------------------------------------------------------------------
    | Check Resend response
    |--------------------------------------------------------------------------
    */

    if (result.error) {
      console.error(
        "[CONTACT_RESEND_ERROR]",
        result.error
      )

      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to send your message right now. Please try again.",
        },
        { status: 500 }
      )
    }

    console.log(
      "[CONTACT_EMAIL_SENT]",
      result.data
    )

    /*
    |--------------------------------------------------------------------------
    | Optional customer auto-reply
    |--------------------------------------------------------------------------
    |
    | Keep this enabled because it confirms to the visitor that
    | KoniqTech received the enquiry.
    |
    */

    try {
      const autoReply =
        await resend.emails.send({
          from: "KoniqTech <info@koniqtech.com>",
          to: [email],

          subject:
            "We've received your message — KoniqTech",

          html: `
<!DOCTYPE html>
<html>
<body
  style="
    margin:0;
    padding:0;
    background:#f8fafc;
    font-family:Arial,Helvetica,sans-serif;
    color:#0f172a;
  "
>

  <div
    style="
      max-width:620px;
      margin:40px auto;
      padding:20px;
    "
  >

    <div
      style="
        background:#0f172a;
        color:#ffffff;
        padding:30px;
        border-radius:16px 16px 0 0;
      "
    >

      <h1
        style="
          margin:0;
          font-size:24px;
        "
      >
        Thank you, ${safeName}!
      </h1>

    </div>

    <div
      style="
        background:#ffffff;
        padding:30px;
        border:1px solid #e2e8f0;
        border-top:0;
      "
    >

      <p
        style="
          font-size:16px;
          line-height:1.7;
        "
      >
        We've received your message and our team
        will get back to you as soon as possible.
      </p>

      <p
        style="
          font-size:16px;
          line-height:1.7;
        "
      >
        If your enquiry is urgent, simply reply
        to this email.
      </p>

      <div
        style="
          margin-top:28px;
          padding-top:20px;
          border-top:1px solid #e2e8f0;
        "
      >

        <strong>
          KoniqTech Team
        </strong>

        <br />

        <span style="color:#64748b;">
          info@koniqtech.com
        </span>

      </div>

    </div>

  </div>

</body>
</html>
          `,
        })

      if (autoReply.error) {
        console.error(
          "[CONTACT_AUTO_REPLY_ERROR]",
          autoReply.error
        )
      }

    } catch (autoReplyError) {
      console.error(
        "[CONTACT_AUTO_REPLY_EXCEPTION]",
        autoReplyError
      )
    }

    /*
    |--------------------------------------------------------------------------
    | Success
    |--------------------------------------------------------------------------
    */

    return NextResponse.json({
      success: true,
      message:
        "Thank you! Your message has been sent successfully.",
    })

  } catch (error) {

    console.error(
      "[CONTACT_API_ERROR]",
      error
    )

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to send your message. Please try again.",
      },
      { status: 500 }
    )
  }
}