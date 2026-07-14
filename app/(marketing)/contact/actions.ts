"use server"

import { resend } from "@/shared/lib/resend"

export type ContactFormState = {
  success: boolean
  message: string
}

export async function sendContactForm(
  _: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {

  try {

    const firstName =
      formData.get("firstName")?.toString().trim() || ""

    const lastName =
      formData.get("lastName")?.toString().trim() || ""

    const business =
      formData.get("business")?.toString().trim() || ""

    const industry =
      formData.get("industry")?.toString().trim() || ""

    const companySize =
      formData.get("companySize")?.toString().trim() || ""

    const country =
      formData.get("country")?.toString().trim() || ""

    const email =
      formData.get("email")?.toString().trim().toLowerCase() || ""

    const phone =
      formData.get("phone")?.toString().trim() || ""

    const subject =
      formData.get("subject")?.toString().trim() || ""

    const message =
      formData.get("message")?.toString().trim() || ""

    const demo =
      formData.get("demo") === "on"

    const accepted =
      formData.get("privacy") === "on"

    if (
      !firstName ||
      !email ||
      !industry ||
      !subject ||
      !message
    ) {

      return {
        success: false,
        message: "Please complete all required fields."
      }

    }

    if (!accepted) {

      return {
        success: false,
        message: "Please accept the Privacy Policy."
      }

    }

    await resend.emails.send({

      from: "KoniqTech <info@koniqtech.com>",

      to: "info@koniqtech.com",

      replyTo: email,

      subject: `Contact Form • ${subject}`,

      html: `
      <div style="font-family:Arial,sans-serif;padding:40px;background:#f8fafc">

        <h1>KoniqTech Contact Form</h1>

        <table cellpadding="8">

          <tr>
            <td><strong>Name</strong></td>
            <td>${firstName} ${lastName}</td>
          </tr>

          <tr>
            <td><strong>Email</strong></td>
            <td>${email}</td>
          </tr>

          <tr>
            <td><strong>Phone</strong></td>
            <td>${phone}</td>
          </tr>

          <tr>
            <td><strong>Business</strong></td>
            <td>${business}</td>
          </tr>

          <tr>
            <td><strong>Industry</strong></td>
            <td>${industry}</td>
          </tr>

          <tr>
            <td><strong>Company Size</strong></td>
            <td>${companySize}</td>
          </tr>

          <tr>
            <td><strong>Country</strong></td>
            <td>${country}</td>
          </tr>

          <tr>
            <td><strong>Book Demo</strong></td>
            <td>${demo ? "Yes" : "No"}</td>
          </tr>

          <tr>
            <td><strong>Subject</strong></td>
            <td>${subject}</td>
          </tr>

        </table>

        <hr/>

        <h3>Message</h3>

        <p style="white-space:pre-wrap">

          ${message}

        </p>

      </div>
      `

    })

    //
    // Auto Reply
    //

    await resend.emails.send({

      from: "KoniqTech <info@koniqtech.com>",

      to: email,

      subject: "We've received your message",

      html: `
      <div
        style="
        font-family:Arial,sans-serif;
        padding:40px;
        background:#f8fafc;
        "
      >

        <h1>Thank you, ${firstName}!</h1>

        <p>

          We've received your message and one of our
          specialists will get back to you shortly.

        </p>

        <p>

          If your enquiry is urgent,
          simply reply to this email.

        </p>

        <br/>

        <strong>

          KoniqTech Team

        </strong>

      </div>
      `

    })

    return {

      success: true,

      message:
        "Thank you! Your message has been sent successfully."

    }

  }

  catch (error) {

    console.error(error)

    return {

      success: false,

      message:
        "Unable to send your message. Please try again."

    }

  }

}