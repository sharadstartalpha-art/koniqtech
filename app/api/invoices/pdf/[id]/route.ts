import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";
import { getObjectUrl } from "@/shared/lib/storage";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // --------------------------------------------------
    // AUTHENTICATION
    // --------------------------------------------------

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // --------------------------------------------------
    // GET USER / ORGANIZATION
    // --------------------------------------------------

    const dbUser = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        orgId: true,
      },
    });

    if (!dbUser?.orgId) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 400 }
      );
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
    });

    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      );
    }

    // --------------------------------------------------
    // COMPANY LOGO
    // --------------------------------------------------

    let logoUrl = "";

    if (invoice.organization.logo) {
      try {
        logoUrl = await getObjectUrl(
          invoice.organization.logo,
          3600
        );
      } catch (error) {
        console.error("Failed to create logo URL:", error);
      }
    }

    // --------------------------------------------------
    // FORMATTERS
    // --------------------------------------------------

    const money = (value: unknown) => {
      const number = Number(value || 0);

      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: invoice.organization.currency || "USD",
      }).format(number);
    };

    const formatDate = (value: Date | null | undefined) => {
      if (!value) return "—";

      return new Intl.DateTimeFormat("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      }).format(new Date(value));
    };

    const escapeHtml = (value: unknown) => {
      return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };

    // --------------------------------------------------
    // CUSTOMER INFORMATION
    // --------------------------------------------------

   const customerName =
  invoice.customer?.companyName ||
  [
    invoice.customer?.firstName,
    invoice.customer?.lastName,
  ]
    .filter(Boolean)
    .join(" ") ||
  "Customer";

    const customerEmail =
      invoice.customer?.email || "";

    const customerPhone =
      invoice.customer?.phone || "";

    const customerAddress =
      invoice.customer?.address || "";

    // --------------------------------------------------
    // COMPANY INFORMATION
    // --------------------------------------------------

    const companyName =
      invoice.organization.name || "Company";

    const companyEmail =
      invoice.organization.email || "";

    const companyPhone =
      invoice.organization.phone || "";

    const companyWebsite =
      invoice.organization.website || "";

    const companyAddress =
      invoice.organization.address || "";

    const companyCityState = [
      invoice.organization.city,
      invoice.organization.state,
      invoice.organization.postalCode,
    ]
      .filter(Boolean)
      .join(", ");

    // --------------------------------------------------
    // STATUS
    // --------------------------------------------------

    const status =
      String(invoice.status || "draft");

    const statusLabel =
      status.charAt(0).toUpperCase() +
      status.slice(1);

    // --------------------------------------------------
    // HTML DOCUMENT
    // --------------------------------------------------

    const html = `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8" />

<title>
Invoice ${escapeHtml(invoice.invoiceNumber)}
</title>

<style>

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  background: #f1f5f9;
  font-family:
    Arial,
    Helvetica,
    sans-serif;
  color: #111827;
}

body {
  padding: 40px;
}

.invoice {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  background: white;
  padding: 48px;
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 35px;
}

.back-space {
  width: 1px;
}

.company {
  text-align: right;
  max-width: 360px;
}

.logo {
  max-width: 230px;
  max-height: 90px;
  object-fit: contain;
  margin-bottom: 12px;
}

.company-name {
  font-size: 25px;
  font-weight: 700;
  margin-bottom: 6px;
}

.company-contact {
  color: #475569;
  font-size: 13px;
  line-height: 1.6;
}

.title {
  font-size: 50px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #0f172a;
  margin: 0;
}

.invoice-number {
  color: #64748b;
  font-size: 16px;
  margin-top: 10px;
}

.divider {
  height: 1px;
  background: #dbe2ea;
  margin: 35px 0;
}

.info {
  display: flex;
  justify-content: space-between;
  gap: 50px;
  margin-bottom: 35px;
}

.bill-to {
  width: 50%;
}

.invoice-info {
  width: 50%;
  text-align: right;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 12px;
}

.customer-name {
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 7px;
}

.normal {
  color: #475569;
  font-size: 14px;
  line-height: 1.7;
}

.invoice-info-row {
  margin-bottom: 9px;
  font-size: 14px;
}

.invoice-info-label {
  font-weight: 700;
}

.status {
  font-weight: 700;
}

.items {
  width: 100%;
  border-collapse: collapse;
  margin-top: 25px;
}

.items th {
  background: #f8fafc;
  border: 1px solid #dbe2ea;
  padding: 13px;
  text-align: left;
  font-size: 13px;
}

.items td {
  border-left: 1px solid #dbe2ea;
  border-right: 1px solid #dbe2ea;
  border-bottom: 1px solid #dbe2ea;
  padding: 15px 13px;
  font-size: 14px;
}

.amount {
  text-align: right !important;
}

.totals {
  width: 320px;
  margin-left: auto;
  margin-top: 25px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
}

.total-row.final {
  border-top: 2px solid #0f172a;
  margin-top: 8px;
  padding-top: 15px;
  font-size: 21px;
  font-weight: 700;
}

.footer {
  margin-top: 55px;
  padding-top: 20px;
  border-top: 1px solid #dbe2ea;
  text-align: center;
  color: #64748b;
  font-size: 12px;
  line-height: 1.6;
}

</style>

</head>

<body>

<div class="invoice">

  <div class="top">

    <div class="back-space"></div>

    <div class="company">

      ${
        logoUrl
          ? `
            <img
              src="${escapeHtml(logoUrl)}"
              class="logo"
            />
          `
          : ""
      }

      <div class="company-name">
        ${escapeHtml(companyName)}
      </div>

      <div class="company-contact">

        ${
          companyEmail
            ? `${escapeHtml(companyEmail)}<br />`
            : ""
        }

        ${
          companyPhone
            ? `${escapeHtml(companyPhone)}<br />`
            : ""
        }

        ${
          companyWebsite
            ? `${escapeHtml(companyWebsite)}<br />`
            : ""
        }

        ${
          companyAddress
            ? `${escapeHtml(companyAddress)}<br />`
            : ""
        }

        ${
          companyCityState
            ? `${escapeHtml(companyCityState)}`
            : ""
        }

      </div>

    </div>

  </div>

  <div>

    <div class="title">
      INVOICE
    </div>

    <div class="invoice-number">
      #${escapeHtml(invoice.invoiceNumber)}
    </div>

  </div>

  <div class="divider"></div>

  <div class="info">

    <div class="bill-to">

      <div class="section-title">
        Bill To
      </div>

      <div class="customer-name">
        ${escapeHtml(customerName)}
      </div>

      ${
        customerEmail
          ? `
            <div class="normal">
              ${escapeHtml(customerEmail)}
            </div>
          `
          : ""
      }

      ${
        customerPhone
          ? `
            <div class="normal">
              ${escapeHtml(customerPhone)}
            </div>
          `
          : ""
      }

      ${
        customerAddress
          ? `
            <div class="normal">
              ${escapeHtml(customerAddress)}
            </div>
          `
          : ""
      }

    </div>

    <div class="invoice-info">

      <div class="invoice-info-row">
        <span class="invoice-info-label">
          Status:
        </span>

        ${escapeHtml(statusLabel)}
      </div>

      <div class="invoice-info-row">
        <span class="invoice-info-label">
          Created:
        </span>

        ${formatDate(invoice.createdAt)}
      </div>

      <div class="invoice-info-row">
        <span class="invoice-info-label">
          Due:
        </span>

        ${formatDate(invoice.dueDate)}
      </div>

    </div>

  </div>

  <table class="items">

    <thead>

      <tr>

        <th>
          Description
        </th>

        <th class="amount">
          Amount
        </th>

      </tr>

    </thead>

    <tbody>

      <tr>

        <td>
          Invoice ${escapeHtml(invoice.invoiceNumber)}
        </td>

        <td class="amount">
          ${money(invoice.subtotal)}
        </td>

      </tr>

    </tbody>

  </table>

  <div class="totals">

    <div class="total-row">

      <span>
        Subtotal
      </span>

      <span>
        ${money(invoice.subtotal)}
      </span>

    </div>

    <div class="total-row">

      <span>
        Tax
      </span>

      <span>
        ${money(invoice.tax)}
      </span>

    </div>

    <div class="total-row final">

      <span>
        Total
      </span>

      <span>
        ${money(invoice.total)}
      </span>

    </div>

  </div>

  <div class="footer">

    Thank you for your business.

    ${
      companyName
        ? `<br />${escapeHtml(companyName)}`
        : ""
    }

  </div>

</div>

</body>

</html>
`;

    // --------------------------------------------------
    // GENERATE PDF
    // --------------------------------------------------

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
      ],
    });

    try {
      const page = await browser.newPage();

      await page.setContent(html, {
        waitUntil: "networkidle0",
      });

      // Make sure remote S3 logo/images have loaded
      await page.evaluate(async () => {
        const images = Array.from(
          document.images
        );

        await Promise.all(
          images.map((img) => {
            if (img.complete) {
              return Promise.resolve();
            }

            return new Promise<void>((resolve) => {
              img.onload = () => resolve();
              img.onerror = () => resolve();
            });
          })
        );
      });

      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
          top: "0",
          right: "0",
          bottom: "0",
          left: "0",
        },
      });

      return new NextResponse(
  pdfBuffer as unknown as BodyInit,
  {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${invoice.invoiceNumber}.pdf"`,
      "Cache-Control": "no-store",
    },
  }
);
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.error(
      "Invoice PDF generation error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to generate invoice PDF",
      },
      {
        status: 500,
      }
    );
  }
}