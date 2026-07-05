"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"
import { resend } from "@/shared/lib/resend"


/* ==========================================================
   TYPES
========================================================== */

export type OutreachActionState = {
  success: boolean
  message: string
}


type OutreachChannel =
  | "email"
  | "phone"
  | "whatsapp"
  | "linkedin"
  | "facebook"
  | "instagram"
  | "other"


/* ==========================================================
   AUTH HELPER
========================================================== */

async function requireSalesUser() {

  const session =
    await auth()


  if (!session?.user) {
    throw new Error(
      "Authentication required."
    )
  }


  const userId =
    String(
      (session.user as any).id ??
        ""
    )


  const role =
    String(
      (session.user as any).role ??
        ""
    )
      .trim()
      .toLowerCase()


  if (
    !userId ||
    role !== "platform_sales"
  ) {
    throw new Error(
      "Sales access required."
    )
  }


  return {
    userId,

    name:
      session.user.name ??
      "Sales Team",

    email:
      session.user.email ??
      "",
  }
}


/* ==========================================================
   GET ASSIGNED SALES LEADS
========================================================== */

export async function getSalesOutreachLeads() {

  const {
    userId,
  } =
    await requireSalesUser()


  const leads =
    await prisma.lead.findMany({

      where: {
        assignedTo:
          userId,

        status: {
          notIn: [
            "won",
            "lost",
            "converted",
          ],
        },
      },

      orderBy: {
        createdAt:
          "desc",
      },

      select: {
        id: true,

        firstName: true,

        lastName: true,

        companyName: true,

        email: true,

        phone: true,

        source: true,

        priority: true,

        industry: true,

        status: true,

        createdAt: true,

        activities: {
          orderBy: {
            createdAt:
              "desc",
          },

          take: 1,

          select: {
            id: true,
            type: true,
            title: true,
            createdAt: true,
          },
        },
      },
    })


  return leads
}


/* ==========================================================
   SEND SINGLE OUTREACH EMAIL
========================================================== */

export async function sendOutreachEmailAction(
  _previousState: OutreachActionState,
  formData: FormData
): Promise<OutreachActionState> {

  try {

    const {
      userId,
      name: salesName,
    } =
      await requireSalesUser()


    const leadId =
      String(
        formData.get(
          "leadId"
        ) ?? ""
      ).trim()


    const subject =
      String(
        formData.get(
          "subject"
        ) ?? ""
      ).trim()


    const message =
      String(
        formData.get(
          "message"
        ) ?? ""
      ).trim()


    /* ------------------------------------------------------
       VALIDATION
    ------------------------------------------------------- */

    if (!leadId) {
      return {
        success: false,
        message:
          "Lead is required.",
      }
    }


    if (!subject) {
      return {
        success: false,
        message:
          "Email subject is required.",
      }
    }


    if (!message) {
      return {
        success: false,
        message:
          "Email message is required.",
      }
    }


    /* ------------------------------------------------------
       VERIFY LEAD OWNERSHIP
    ------------------------------------------------------- */

    const lead =
      await prisma.lead.findFirst({

        where: {
          id:
            leadId,

          assignedTo:
            userId,
        },

        select: {
          id: true,

          firstName: true,

          lastName: true,

          email: true,

          companyName: true,

          status: true,
        },
      })


    if (!lead) {
      return {
        success: false,
        message:
          "Lead not found or not assigned to your account.",
      }
    }


    if (!lead.email) {
      return {
        success: false,
        message:
          "This lead does not have an email address.",
      }
    }


    /* ------------------------------------------------------
       SEND EMAIL
    ------------------------------------------------------- */

    const result =
      await resend.emails.send({

        from:
          process.env
            .RESEND_FROM_EMAIL ??
          "KoniqTech Sales <sales@koniqtech.com>",

        to: [
          lead.email,
        ],

        subject,

        html:
          buildOutreachEmail({
            firstName:
              lead.firstName,

            message,

            salesName,
          }),
      })


    if (result.error) {

      console.error(
        "Outreach email error:",
        result.error
      )


      return {
        success: false,
        message:
          "Email could not be sent.",
      }
    }


    /* ------------------------------------------------------
       RECORD ACTIVITY + UPDATE STATUS
    ------------------------------------------------------- */

    await prisma.$transaction([

      prisma.leadActivity.create({

        data: {
          leadId:
            lead.id,

          type:
            "email",

          title:
            `Email sent: ${subject}`,
        },
      }),


      prisma.leadNote.create({

        data: {
          leadId:
            lead.id,

          createdBy:
            userId,

          content:
            `Email outreach sent.\n\nSubject: ${subject}\n\n${message}`,
        },
      }),


      ...(lead.status === "new"
        ? [
            prisma.lead.update({

              where: {
                id:
                  lead.id,
              },

              data: {
                status:
                  "contacted",
              },
            }),
          ]
        : []),

    ])


    revalidatePath(
      "/admin/sales/dashboard"
    )

    revalidatePath(
      "/admin/sales/leads"
    )

    revalidatePath(
      `/admin/sales/leads/${lead.id}`
    )

    revalidatePath(
      "/admin/sales/outreach"
    )


    return {
      success: true,
      message:
        `Email sent successfully to ${lead.firstName}.`,
    }

  } catch (error) {

    console.error(
      "sendOutreachEmailAction:",
      error
    )


    return {
      success: false,
      message:
        "Unable to send outreach email.",
    }
  }
}


/* ==========================================================
   RECORD MANUAL OUTREACH
========================================================== */

export async function recordOutreachAction(
  _previousState: OutreachActionState,
  formData: FormData
): Promise<OutreachActionState> {

  try {

    const {
      userId,
    } =
      await requireSalesUser()


    const leadId =
      String(
        formData.get(
          "leadId"
        ) ?? ""
      ).trim()


    const channel =
      String(
        formData.get(
          "channel"
        ) ?? ""
      )
        .trim()
        .toLowerCase() as
        OutreachChannel


    const notes =
      String(
        formData.get(
          "notes"
        ) ?? ""
      ).trim()


    const outcome =
      String(
        formData.get(
          "outcome"
        ) ?? ""
      ).trim()


    const validChannels =
      new Set<OutreachChannel>([
        "email",
        "phone",
        "whatsapp",
        "linkedin",
        "facebook",
        "instagram",
        "other",
      ])


    /* ------------------------------------------------------
       VALIDATION
    ------------------------------------------------------- */

    if (!leadId) {
      return {
        success: false,
        message:
          "Lead is required.",
      }
    }


    if (
      !channel ||
      !validChannels.has(
        channel
      )
    ) {
      return {
        success: false,
        message:
          "Select a valid outreach channel.",
      }
    }


    if (!outcome) {
      return {
        success: false,
        message:
          "Outreach outcome is required.",
      }
    }


    /* ------------------------------------------------------
       VERIFY LEAD
    ------------------------------------------------------- */

    const lead =
      await prisma.lead.findFirst({

        where: {
          id:
            leadId,

          assignedTo:
            userId,
        },

        select: {
          id: true,
          firstName: true,
          status: true,
        },
      })


    if (!lead) {
      return {
        success: false,
        message:
          "Lead not found or not assigned to you.",
      }
    }


    /* ------------------------------------------------------
       TRANSACTION
    ------------------------------------------------------- */

    await prisma.$transaction([

      prisma.leadActivity.create({

        data: {
          leadId:
            lead.id,

          type:
            channel,

          title:
            `${formatChannel(channel)} outreach — ${outcome}`,
        },
      }),


      ...(notes
        ? [
            prisma.leadNote.create({

              data: {
                leadId:
                  lead.id,

                createdBy:
                  userId,

                content:
                  `${formatChannel(channel)} outreach\n\nOutcome: ${outcome}\n\n${notes}`,
              },
            }),
          ]
        : []),


      ...(lead.status === "new"
        ? [
            prisma.lead.update({

              where: {
                id:
                  lead.id,
              },

              data: {
                status:
                  "contacted",
              },
            }),
          ]
        : []),

    ])


    revalidatePath(
      "/admin/sales/dashboard"
    )

    revalidatePath(
      "/admin/sales/leads"
    )

    revalidatePath(
      `/admin/sales/leads/${lead.id}`
    )

    revalidatePath(
      "/admin/sales/outreach"
    )


    return {
      success: true,
      message:
        `${formatChannel(channel)} outreach recorded successfully.`,
    }

  } catch (error) {

    console.error(
      "recordOutreachAction:",
      error
    )


    return {
      success: false,
      message:
        "Unable to record outreach activity.",
    }
  }
}


/* ==========================================================
   ADD SALES NOTE
========================================================== */

export async function addSalesNoteAction(
  _previousState: OutreachActionState,
  formData: FormData
): Promise<OutreachActionState> {

  try {

    const {
      userId,
    } =
      await requireSalesUser()


    const leadId =
      String(
        formData.get(
          "leadId"
        ) ?? ""
      ).trim()


    const content =
      String(
        formData.get(
          "content"
        ) ?? ""
      ).trim()


    if (!leadId) {
      return {
        success: false,
        message:
          "Lead is required.",
      }
    }


    if (!content) {
      return {
        success: false,
        message:
          "Note content is required.",
      }
    }


    const lead =
      await prisma.lead.findFirst({

        where: {
          id:
            leadId,

          assignedTo:
            userId,
        },

        select: {
          id: true,
        },
      })


    if (!lead) {
      return {
        success: false,
        message:
          "Lead not found or not assigned to you.",
      }
    }


    await prisma.leadNote.create({

      data: {
        leadId:
          lead.id,

        content,

        createdBy:
          userId,
      },
    })


    revalidatePath(
      `/admin/sales/leads/${lead.id}`
    )

    revalidatePath(
      "/admin/sales/outreach"
    )


    return {
      success: true,
      message:
        "Sales note added successfully.",
    }

  } catch (error) {

    console.error(
      "addSalesNoteAction:",
      error
    )


    return {
      success: false,
      message:
        "Unable to add sales note.",
    }
  }
}


/* ==========================================================
   MARK LEAD AS INTERESTED
========================================================== */

export async function markLeadInterestedAction(
  formData: FormData
) {

  const {
    userId,
  } =
    await requireSalesUser()


  const leadId =
    String(
      formData.get(
        "leadId"
      ) ?? ""
    ).trim()


  if (!leadId) {
    throw new Error(
      "Lead ID is required."
    )
  }


  const lead =
    await prisma.lead.findFirst({

      where: {
        id:
          leadId,

        assignedTo:
          userId,
      },

      select: {
        id: true,
        firstName: true,
      },
    })


  if (!lead) {
    throw new Error(
      "Lead not found or not assigned to you."
    )
  }


  await prisma.$transaction([

    prisma.lead.update({

      where: {
        id:
          lead.id,
      },

      data: {
        status:
          "estimate",
      },
    }),


    prisma.leadActivity.create({

      data: {
        leadId:
          lead.id,

        type:
          "qualification",

        title:
          "Lead marked as interested and ready for demo qualification",
      },
    }),

  ])


  revalidatePath(
    "/admin/sales/dashboard"
  )

  revalidatePath(
    "/admin/sales/leads"
  )

  revalidatePath(
    `/admin/sales/leads/${lead.id}`
  )

  revalidatePath(
    "/admin/sales/outreach"
  )
}


/* ==========================================================
   MARK LEAD LOST
========================================================== */

export async function markLeadLostAction(
  formData: FormData
) {

  const {
    userId,
  } =
    await requireSalesUser()


  const leadId =
    String(
      formData.get(
        "leadId"
      ) ?? ""
    ).trim()


  const reason =
    String(
      formData.get(
        "reason"
      ) ?? ""
    ).trim()


  if (!leadId) {
    throw new Error(
      "Lead ID is required."
    )
  }


  const lead =
    await prisma.lead.findFirst({

      where: {
        id:
          leadId,

        assignedTo:
          userId,
      },

      select: {
        id: true,
      },
    })


  if (!lead) {
    throw new Error(
      "Lead not found or not assigned to you."
    )
  }


  await prisma.$transaction([

    prisma.lead.update({

      where: {
        id:
          lead.id,
      },

      data: {
        status:
          "lost",
      },
    }),


    prisma.leadActivity.create({

      data: {
        leadId:
          lead.id,

        type:
          "status_change",

        title:
          reason
            ? `Lead marked lost — ${reason}`
            : "Lead marked lost",
      },
    }),


    ...(reason
      ? [
          prisma.leadNote.create({

            data: {
              leadId:
                lead.id,

              createdBy:
                userId,

              content:
                `Lost lead reason: ${reason}`,
            },
          }),
        ]
      : []),

  ])


  revalidatePath(
    "/admin/sales/dashboard"
  )

  revalidatePath(
    "/admin/sales/leads"
  )

  revalidatePath(
    `/admin/sales/leads/${lead.id}`
  )

  revalidatePath(
    "/admin/sales/outreach"
  )
}


/* ==========================================================
   BULK EMAIL OUTREACH
========================================================== */

export async function sendBulkOutreachAction(
  _previousState: OutreachActionState,
  formData: FormData
): Promise<OutreachActionState> {

  try {

    const {
      userId,
      name: salesName,
    } =
      await requireSalesUser()


    const selectedLeadIds =
      formData
        .getAll(
          "leadIds"
        )
        .map(
          (value) =>
            String(value)
        )
        .filter(Boolean)


    const subject =
      String(
        formData.get(
          "subject"
        ) ?? ""
      ).trim()


    const message =
      String(
        formData.get(
          "message"
        ) ?? ""
      ).trim()


    if (
      selectedLeadIds.length ===
      0
    ) {
      return {
        success: false,
        message:
          "Select at least one lead.",
      }
    }


    if (
      !subject ||
      !message
    ) {
      return {
        success: false,
        message:
          "Subject and message are required.",
      }
    }


    /* ------------------------------------------------------
       ONLY FETCH LEADS OWNED BY SALES USER
    ------------------------------------------------------- */

    const leads =
      await prisma.lead.findMany({

        where: {
          id: {
            in:
              selectedLeadIds,
          },

          assignedTo:
            userId,

          email: {
            not:
              null,
          },
        },

        select: {
          id: true,
          firstName: true,
          email: true,
          status: true,
        },
      })


    if (
      leads.length ===
      0
    ) {
      return {
        success: false,
        message:
          "No valid leads with email addresses were selected.",
      }
    }


    let sentCount = 0

    let failedCount = 0


    /*
      Sequential sending is intentional here.

      This avoids:
      - large parallel bursts
      - unnecessary provider rate-limit pressure
      - Promise.all failing the whole batch
    */

    for (
      const lead of leads
    ) {

      if (!lead.email) {
        continue
      }


      try {

        const result =
          await resend.emails.send({

            from:
              process.env
                .RESEND_FROM_EMAIL ??
              "KoniqTech Sales <sales@koniqtech.com>",

            to: [
              lead.email,
            ],

            subject,

            html:
              buildOutreachEmail({
                firstName:
                  lead.firstName,

                message,

                salesName,
              }),
          })


        if (result.error) {

          failedCount++

          console.error(
            `Bulk email failed for lead ${lead.id}:`,
            result.error
          )

          continue
        }


        await prisma.$transaction([

          prisma.leadActivity.create({

            data: {
              leadId:
                lead.id,

              type:
                "email",

              title:
                `Bulk outreach email sent: ${subject}`,
            },
          }),


          prisma.leadNote.create({

            data: {
              leadId:
                lead.id,

              createdBy:
                userId,

              content:
                `Bulk email outreach sent.\n\nSubject: ${subject}\n\n${message}`,
            },
          }),


          ...(lead.status === "new"
            ? [
                prisma.lead.update({

                  where: {
                    id:
                      lead.id,
                  },

                  data: {
                    status:
                      "contacted",
                  },
                }),
              ]
            : []),

        ])


        sentCount++

      } catch (error) {

        failedCount++

        console.error(
          `Bulk outreach error for lead ${lead.id}:`,
          error
        )
      }
    }


    revalidatePath(
      "/admin/sales/dashboard"
    )

    revalidatePath(
      "/admin/sales/leads"
    )

    revalidatePath(
      "/admin/sales/outreach"
    )


    if (
      sentCount === 0
    ) {
      return {
        success: false,
        message:
          `No emails were sent. ${failedCount} failed.`,
      }
    }


    return {
      success: true,

      message:
        failedCount > 0
          ? `${sentCount} emails sent successfully. ${failedCount} failed.`
          : `${sentCount} outreach emails sent successfully.`,
    }

  } catch (error) {

    console.error(
      "sendBulkOutreachAction:",
      error
    )


    return {
      success: false,
      message:
        "Unable to complete bulk outreach.",
    }
  }
}


/* ==========================================================
   REDIRECT TO DEMO REQUEST
========================================================== */

export async function proceedToDemoRequestAction(
  formData: FormData
) {

  const {
    userId,
  } =
    await requireSalesUser()


  const leadId =
    String(
      formData.get(
        "leadId"
      ) ?? ""
    ).trim()


  if (!leadId) {
    throw new Error(
      "Lead ID is required."
    )
  }


  const lead =
    await prisma.lead.findFirst({

      where: {
        id:
          leadId,

        assignedTo:
          userId,
      },

      select: {
        id: true,
      },
    })


  if (!lead) {
    throw new Error(
      "Lead not found or not assigned to you."
    )
  }


  redirect(
    `/admin/sales/demo-requests/new?leadId=${lead.id}`
  )
}


/* ==========================================================
   HELPERS
========================================================== */

function formatChannel(
  channel: string
) {

  return channel
    .replaceAll(
      "_",
      " "
    )
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    )
}


/* ==========================================================
   EMAIL TEMPLATE
========================================================== */

function buildOutreachEmail({
  firstName,
  message,
  salesName,
}: {
  firstName: string
  message: string
  salesName: string
}) {

  const safeFirstName =
    escapeHtml(
      firstName
    )


  const safeMessage =
    escapeHtml(
      message
    )
      .replace(
        /\r?\n/g,
        "<br />"
      )


  const safeSalesName =
    escapeHtml(
      salesName
    )


  return `
    <!DOCTYPE html>

    <html>
      <body
        style="
          margin: 0;
          padding: 0;
          background: #f8fafc;
          font-family:
            Arial,
            Helvetica,
            sans-serif;
          color: #0f172a;
        "
      >

        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          role="presentation"
        >
          <tr>
            <td
              align="center"
              style="
                padding: 32px 16px;
              "
            >

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="
                  max-width: 620px;
                  background: #ffffff;
                  border:
                    1px solid #e2e8f0;
                  border-radius: 14px;
                "
              >

                <tr>
                  <td
                    style="
                      padding:
                        28px 32px;
                    "
                  >

                    <div
                      style="
                        font-size: 22px;
                        font-weight: 700;
                        margin-bottom: 24px;
                      "
                    >
                      KoniqTech
                    </div>


                    <p
                      style="
                        margin:
                          0 0 18px;
                        font-size: 16px;
                        line-height: 1.7;
                      "
                    >
                      Hi ${safeFirstName},
                    </p>


                    <div
                      style="
                        font-size: 16px;
                        line-height: 1.7;
                        color: #334155;
                      "
                    >
                      ${safeMessage}
                    </div>


                    <p
                      style="
                        margin:
                          24px 0 0;
                        font-size: 15px;
                        line-height: 1.7;
                        color: #475569;
                      "
                    >
                      Best regards,<br />
                      <strong>
                        ${safeSalesName}
                      </strong><br />
                      KoniqTech Sales Team
                    </p>

                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>

      </body>
    </html>
  `
}


/* ==========================================================
   BASIC HTML ESCAPE
========================================================== */

function escapeHtml(
  value: string
) {

  return value
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    )
}