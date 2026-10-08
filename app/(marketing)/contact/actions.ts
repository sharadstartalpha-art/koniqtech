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
  from: "KoniqTech <sales@koniqtech.com>",
  to: "sharad@koniqtech.com",
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

        <div
          style="
            max-width:680px;
            margin:40px auto;
            padding:0 20px;
          "
        >

          <!-- Header -->
          <div
            style="
              background:#0f172a;
              color:#ffffff;
              padding:28px 32px;
              border-radius:18px 18px 0 0;
            "
          >

            <h1
              style="
                margin:0;
                font-size:24px;
                line-height:1.3;
              "
            >
              New Contact Enquiry
            </h1>

            <p
              style="
                margin:8px 0 0;
                color:#cbd5e1;
                font-size:15px;
              "
            >
              ${safeIndustry} enquiry received from KoniqTech website
            </p>

          </div>

          <!-- Content -->
          <div
            style="
              background:#ffffff;
              padding:32px;
              border:1px solid #e2e8f0;
              border-top:0;
              border-radius:0 0 18px 18px;
            "
          >

            <h2
              style="
                margin:0 0 24px;
                font-size:20px;
                color:#0f172a;
              "
            >
              Contact Details
            </h2>

            <!-- Name -->
            <div
              style="
                padding:14px 0;
                border-bottom:1px solid #e2e8f0;
              "
            >
              <div
                style="
                  font-size:12px;
                  color:#64748b;
                  text-transform:uppercase;
                  margin-bottom:5px;
                "
              >
                Name
              </div>

              <div
                style="
                  font-size:16px;
                  font-weight:600;
                "
              >
                ${safeName}
              </div>
            </div>

            <!-- Email -->
            <div
              style="
                padding:14px 0;
                border-bottom:1px solid #e2e8f0;
              "
            >
              <div
                style="
                  font-size:12px;
                  color:#64748b;
                  text-transform:uppercase;
                  margin-bottom:5px;
                "
              >
                Email
              </div>

              <div
                style="
                  font-size:16px;
                "
              >
                <a
                  href="mailto:${safeEmail}"
                  style="
                    color:#2563eb;
                    text-decoration:none;
                  "
                >
                  ${safeEmail}
                </a>
              </div>
            </div>

            <!-- Company -->
            <div
              style="
                padding:14px 0;
                border-bottom:1px solid #e2e8f0;
              "
            >
              <div
                style="
                  font-size:12px;
                  color:#64748b;
                  text-transform:uppercase;
                  margin-bottom:5px;
                "
              >
                Company
              </div>

              <div style="font-size:16px;">
                ${safeCompany || "Not provided"}
              </div>
            </div>

            <!-- Phone -->
            <div
              style="
                padding:14px 0;
                border-bottom:1px solid #e2e8f0;
              "
            >
              <div
                style="
                  font-size:12px;
                  color:#64748b;
                  text-transform:uppercase;
                  margin-bottom:5px;
                "
              >
                Phone
              </div>

              <div style="font-size:16px;">
                ${safePhone || "Not provided"}
              </div>
            </div>

            <!-- Industry -->
            <div
              style="
                padding:14px 0;
                border-bottom:1px solid #e2e8f0;
              "
            >
              <div
                style="
                  font-size:12px;
                  color:#64748b;
                  text-transform:uppercase;
                  margin-bottom:5px;
                "
              >
                Industry
              </div>

              <div style="font-size:16px;">
                ${safeIndustry}
              </div>
            </div>

            <!-- Demo -->
            <div
              style="
                padding:14px 0;
                border-bottom:1px solid #e2e8f0;
              "
            >
              <div
                style="
                  font-size:12px;
                  color:#64748b;
                  text-transform:uppercase;
                  margin-bottom:5px;
                "
              >
                Demo Requested
              </div>

              <div
                style="
                  font-size:16px;
                  font-weight:600;
                "
              >
                ${demo ? "Yes" : "No"}
              </div>
            </div>

            <!-- Message -->
            <div style="padding:24px 0 0;">

              <div
                style="
                  font-size:12px;
                  color:#64748b;
                  text-transform:uppercase;
                  margin-bottom:10px;
                "
              >
                Message
              </div>

              <div
                style="
                  background:#f8fafc;
                  border:1px solid #e2e8f0;
                  border-radius:10px;
                  padding:18px;
                  font-size:15px;
                  line-height:1.7;
                  white-space:pre-wrap;
                "
              >
                ${safeMessage}
              </div>

            </div>

            <!-- Footer -->
            <div
              style="
                margin-top:30px;
                padding-top:20px;
                border-top:1px solid #e2e8f0;
                font-size:13px;
                color:#64748b;
              "
            >

              This enquiry was submitted through the
              <strong>KoniqTech</strong> website.

              <br /><br />

              Reply directly to this email to respond to
              <strong>${safeName}</strong>.

            </div>

          </div>

        </div>

      </body>
    </html>
  `,
})

console.log("[CONTACT_ADMIN_EMAIL_RESULT]", {
  data: adminEmail.data,
  error: adminEmail.error,
})

if (adminEmail.error) {
  console.error("[CONTACT_ADMIN_EMAIL_ERROR]", adminEmail.error)

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
      from: "KoniqTech <sales@koniqtech.com>",
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
                    sales@koniqtech.com
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