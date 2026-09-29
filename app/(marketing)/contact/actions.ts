"use server"

import { resend } from "@/shared/lib/resend"

export type ContactFormState = {
  success: boolean
  message: string
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

export async function sendContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  try {
    const name =
      formData.get("name")?.toString().trim() || ""

    const email =
      formData.get("email")?.toString().trim().toLowerCase() || ""

    const company =
      formData.get("company")?.toString().trim() || ""

    const phone =
      formData.get("phone")?.toString().trim() || ""

    const industry =
      formData.get("industry")?.toString().trim() || ""

    const message =
      formData.get("message")?.toString().trim() || ""

    const demo =
      formData.get("demo") === "on"

    const privacy =
      formData.get("privacy") === "on"

    /* -----------------------------------------
       VALIDATION
    ----------------------------------------- */

    if (!name || !email || !industry || !message) {
      return {
        success: false,
        message: "Please complete all required fields.",
      }
    }

    if (!privacy) {
      return {
        success: false,
        message: "Please accept the Privacy Policy.",
      }
    }

    if (name.length > 100) {
      return {
        success: false,
        message: "Name is too long.",
      }
    }

    if (company.length > 150) {
      return {
        success: false,
        message: "Company name is too long.",
      }
    }

    if (email.length > 200) {
      return {
        success: false,
        message: "Email address is too long.",
      }
    }

    if (message.length > 5000) {
      return {
        success: false,
        message: "Message is too long.",
      }
    }

    /* -----------------------------------------
       SANITIZE HTML
    ----------------------------------------- */

    const safeName = escapeHtml(name)
    const safeEmail = escapeHtml(email)
    const safeCompany = escapeHtml(company)
    const safePhone = escapeHtml(phone)
    const safeIndustry = escapeHtml(industry)
    const safeMessage = escapeHtml(message)

    /* -----------------------------------------
       EMAIL TO KONIQTECH
    ----------------------------------------- */

    const adminEmail = await resend.emails.send({
      from: "KoniqTech <info@koniqtech.com>",
      to: "info@koniqtech.com",
      replyTo: email,
      subject: `New Contact Enquiry — ${industry}`,

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

            <div style="max-width:680px;margin:40px auto;padding:0 20px;">

              <div
                style="
                  background:#0f172a;
                  padding:28px 32px;
                  border-radius:18px 18px 0 0;
                  color:white;
                "
              >
                <h1 style="margin:0;font-size:24px;">
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
                  background:white;
                  padding:32px;
                  border:1px solid #e2e8f0;
                  border-top:0;
                "
              >

                <table
                  width="100%"
                  cellpadding="8"
                  cellspacing="0"
                  style="font-size:15px;"
                >

                  <tr>
                    <td
                      style="
                        width:160px;
                        font-weight:bold;
                        color:#475569;
                      "
                    >
                      Name
                    </td>

                    <td>${safeName}</td>
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

                    <td>${safeIndustry}</td>
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
                      white-space:pre-wrap;
                      line-height:1.6;
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

    if (adminEmail.error) {
      console.error(
        "[CONTACT_ADMIN_EMAIL]",
        adminEmail.error
      )

      return {
        success: false,
        message:
          "Unable to send your message right now. Please try again.",
      }
    }

    /* -----------------------------------------
       AUTO REPLY TO CUSTOMER
    ----------------------------------------- */

    const autoReply = await resend.emails.send({
      from: "KoniqTech <info@koniqtech.com>",
      to: email,
      subject: "We've received your message — KoniqTech",

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
                padding:0 20px;
              "
            >

              <div
                style="
                  background:#0f172a;
                  color:white;
                  padding:28px 32px;
                  border-radius:18px 18px 0 0;
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
                  background:white;
                  padding:32px;
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
        "[CONTACT_AUTO_REPLY]",
        autoReply.error
      )

      // Admin email was already successfully sent.
      // Do not report the whole submission as failed.
    }

    return {
      success: true,
      message:
        "Thank you! Your message has been sent successfully.",
    }
  } catch (error) {
    console.error(
      "[CONTACT_FORM_ERROR]",
      error
    )

    return {
      success: false,
      message:
        "Unable to send your message. Please try again.",
    }
  }
}