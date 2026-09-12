import { NextResponse } from "next/server"
import { Resend } from "resend"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

export const dynamic = "force-dynamic"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // --------------------------------------------------
    // AUTHENTICATION
    // --------------------------------------------------

    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params

    // --------------------------------------------------
    // ORGANIZATION
    // --------------------------------------------------

    const dbUser = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        orgId: true,
      },
    })

    if (!dbUser?.orgId) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 400 }
      )
    }

    // --------------------------------------------------
    // GET INVOICE
    // --------------------------------------------------

    const invoice = await prisma.invoice.findFirst({
      where: {
        id,
        orgId: dbUser.orgId,
        archivedAt: null,
      },
      include: {
        customer: true,
        job: true,
        organization: true,
      },
    })

    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      )
    }

    // --------------------------------------------------
    // CUSTOMER EMAIL
    // --------------------------------------------------

    const customerEmail =
      invoice.customer.email?.trim()

    if (!customerEmail) {
      return NextResponse.json(
        {
          error:
            "Customer email address is missing.",
        },
        { status: 400 }
      )
    }

    // --------------------------------------------------
    // RESEND API KEY
    // --------------------------------------------------

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        {
          error:
            "RESEND_API_KEY is not configured.",
        },
        { status: 500 }
      )
    }

    const resend = new Resend(
      process.env.RESEND_API_KEY
    )

    // --------------------------------------------------
    // GENERATE BRANDED PDF
    //
    // We call the existing PDF endpoint so the email
    // attachment uses the exact same branded invoice.
    // --------------------------------------------------

    const requestUrl = new URL(req.url)

    const pdfUrl =
      `${requestUrl.origin}/api/invoices/pdf/${invoice.id}`

    const cookieHeader =
      req.headers.get("cookie") || ""

    const pdfResponse = await fetch(pdfUrl, {
      method: "GET",
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    })

    if (!pdfResponse.ok) {
      const pdfError =
        await pdfResponse.text()

      console.error(
        "Invoice PDF generation failed:",
        pdfError
      )

      return NextResponse.json(
        {
          error:
            "Failed to generate invoice PDF.",
        },
        { status: 500 }
      )
    }

    const pdfArrayBuffer =
      await pdfResponse.arrayBuffer()

    const pdfBuffer =
      Buffer.from(pdfArrayBuffer)

    // --------------------------------------------------
    // CUSTOMER NAME
    // --------------------------------------------------

    const customerName =
      invoice.customer.companyName ||
      [
        invoice.customer.firstName,
        invoice.customer.lastName,
      ]
        .filter(Boolean)
        .join(" ") ||
      "Customer"

    // --------------------------------------------------
    // COMPANY INFORMATION
    // --------------------------------------------------

    const companyName =
      invoice.organization.name ||
      "KoniqTech CRM"

    // --------------------------------------------------
    // SEND EMAIL
    // --------------------------------------------------

    const fromEmail =
      process.env.RESEND_FROM_EMAIL ||
      "sales@koniqtech.com"

    const emailResult =
      await resend.emails.send({
        from: `${companyName} <${fromEmail}>`,
        to: customerEmail,
        subject:
          `Invoice ${invoice.invoiceNumber}`,

        html: `
          <div
            style="
              font-family: Arial, Helvetica, sans-serif;
              max-width: 650px;
              margin: 0 auto;
              color: #111827;
            "
          >

            <h2>
              Invoice ${invoice.invoiceNumber}
            </h2>

            <p>
              Hello ${customerName},
            </p>

            <p>
              Please find your invoice
              <strong>
                ${invoice.invoiceNumber}
              </strong>
              attached to this email.
            </p>

            <p>
              <strong>
                Invoice Total:
              </strong>
              $${Number(invoice.total).toFixed(2)}
            </p>

            ${
              invoice.dueDate
                ? `
                  <p>
                    <strong>
                      Due Date:
                    </strong>
                    ${invoice.dueDate.toLocaleDateString()}
                  </p>
                `
                : ""
            }

            <p>
              Thank you for your business.
            </p>

            <p>
              Regards,<br />
              <strong>${companyName}</strong>
            </p>

          </div>
        `,

        attachments: [
          {
            filename:
              `${invoice.invoiceNumber}.pdf`,
            content: pdfBuffer,
          },
        ],
      })

    // --------------------------------------------------
    // CHECK RESEND RESULT
    // --------------------------------------------------

    if (emailResult.error) {
      console.error(
        "Resend email error:",
        emailResult.error
      )

      return NextResponse.json(
        {
          error:
            emailResult.error.message ||
            "Failed to send invoice email.",
        },
        { status: 500 }
      )
    }

    // --------------------------------------------------
    // UPDATE INVOICE
    // --------------------------------------------------

    await prisma.invoice.update({
      where: {
        id: invoice.id,
      },
      data: {
        sentAt: new Date(),
        status: "sent",
      },
    })

    // --------------------------------------------------
    // SUCCESS
    // --------------------------------------------------

    return NextResponse.json({
      success: true,
      message:
        "Invoice sent successfully.",
      emailId: emailResult.data?.id || null,
    })

  } catch (error) {
    console.error(
      "Send invoice error:",
      error
    )

    return NextResponse.json(
      {
        error:
          "Failed to send invoice.",
      },
      { status: 500 }
    )
  }
}