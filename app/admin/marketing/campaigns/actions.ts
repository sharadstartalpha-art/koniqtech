"use server"

import { revalidatePath } from "next/cache"

import {
  CampaignChannel,
  CampaignStatus,
  Prisma,
} from "@prisma/client"

import { auth } from "@/auth"

import prisma from "@/shared/lib/prisma"

/* =========================================================
   TYPES
========================================================= */

export type CampaignActionResult = {
  success: boolean
  message: string
  campaignId?: string
}

export type CreateCampaignInput = {
  title: string
  channel: CampaignChannel
  budget?: number | null
  startDate?: string | null
  endDate?: string | null
  status?: CampaignStatus
}

export type UpdateCampaignInput = {
  title: string
  channel: CampaignChannel
  budget?: number | null
  startDate?: string | null
  endDate?: string | null
  status: CampaignStatus
}

/* =========================================================
   SESSION HELPER
========================================================= */

async function getAuthenticatedContext() {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  if (!session.user.orgId) {
    throw new Error(
      "Organization context is missing"
    )
  }

  return {
    userId: session.user.id,
    orgId: session.user.orgId,
  }
}

/* =========================================================
   DATE HELPER
========================================================= */

function parseOptionalDate(
  value?: string | null
) {
  if (!value) {
    return null
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    throw new Error(
      "Invalid campaign date"
    )
  }

  return date
}

/* =========================================================
   BUDGET HELPER
========================================================= */

function parseOptionalBudget(
  value?: number | null
) {
  if (
    value === null ||
    value === undefined
  ) {
    return null
  }

  if (
    !Number.isFinite(value) ||
    value < 0
  ) {
    throw new Error(
      "Campaign budget must be zero or greater"
    )
  }

  return new Prisma.Decimal(value)
}

/* =========================================================
   CREATE CAMPAIGN
========================================================= */

export async function createCampaignAction(
  input: CreateCampaignInput
): Promise<CampaignActionResult> {
  try {
    const {
      userId,
      orgId,
    } =
      await getAuthenticatedContext()

    const title =
      input.title.trim()

    if (!title) {
      return {
        success: false,
        message:
          "Campaign title is required",
      }
    }

    const startDate =
      parseOptionalDate(
        input.startDate
      )

    const endDate =
      parseOptionalDate(
        input.endDate
      )

    if (
      startDate &&
      endDate &&
      endDate < startDate
    ) {
      return {
        success: false,
        message:
          "End date cannot be before start date",
      }
    }

    const campaign =
      await prisma.marketingCampaign.create({
        data: {
          orgId,

          title,

          channel:
            input.channel,

          budget:
            parseOptionalBudget(
              input.budget
            ),

          startDate,

          endDate,

          status:
            input.status ??
            CampaignStatus.draft,

          leads: 0,

          conversions: 0,

          createdByUserId:
            userId,
        },

        select: {
          id: true,
        },
      })

    revalidatePath(
      "/admin/marketing/campaigns"
    )

    return {
      success: true,
      message:
        "Campaign created successfully",
      campaignId:
        campaign.id,
    }
  } catch (error) {
    console.error(
      "createCampaignAction error:",
      error
    )

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create campaign",
    }
  }
}

/* =========================================================
   UPDATE CAMPAIGN
========================================================= */

export async function updateCampaignAction(
  campaignId: string,
  input: UpdateCampaignInput
): Promise<CampaignActionResult> {
  try {
    const {
      orgId,
    } =
      await getAuthenticatedContext()

    if (!campaignId) {
      return {
        success: false,
        message:
          "Campaign ID is required",
      }
    }

    const existingCampaign =
      await prisma.marketingCampaign.findFirst({
        where: {
          id: campaignId,
          orgId,
        },

        select: {
          id: true,
        },
      })

    if (!existingCampaign) {
      return {
        success: false,
        message:
          "Campaign not found",
      }
    }

    const title =
      input.title.trim()

    if (!title) {
      return {
        success: false,
        message:
          "Campaign title is required",
      }
    }

    const startDate =
      parseOptionalDate(
        input.startDate
      )

    const endDate =
      parseOptionalDate(
        input.endDate
      )

    if (
      startDate &&
      endDate &&
      endDate < startDate
    ) {
      return {
        success: false,
        message:
          "End date cannot be before start date",
      }
    }

    await prisma.marketingCampaign.update({
      where: {
        id: campaignId,
      },

      data: {
        title,

        channel:
          input.channel,

        budget:
          parseOptionalBudget(
            input.budget
          ),

        startDate,

        endDate,

        status:
          input.status,
      },
    })

    revalidatePath(
      "/admin/marketing/campaigns"
    )

    revalidatePath(
      `/admin/marketing/campaigns/${campaignId}`
    )

    return {
      success: true,
      message:
        "Campaign updated successfully",
      campaignId,
    }
  } catch (error) {
    console.error(
      "updateCampaignAction error:",
      error
    )

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update campaign",
    }
  }
}

/* =========================================================
   DELETE CAMPAIGN
========================================================= */

export async function deleteCampaignAction(
  campaignId: string
): Promise<CampaignActionResult> {
  try {
    const {
      orgId,
    } =
      await getAuthenticatedContext()

    if (!campaignId) {
      return {
        success: false,
        message:
          "Campaign ID is required",
      }
    }

    const campaign =
      await prisma.marketingCampaign.findFirst({
        where: {
          id: campaignId,
          orgId,
        },

        select: {
          id: true,
        },
      })

    if (!campaign) {
      return {
        success: false,
        message:
          "Campaign not found",
      }
    }

    await prisma.$transaction(
      async (tx) => {
        await tx.marketingCampaignLead.deleteMany({
          where: {
            campaignId,
          },
        })

        await tx.marketingCampaign.delete({
          where: {
            id: campaignId,
          },
        })
      }
    )

    revalidatePath(
      "/admin/marketing/campaigns"
    )

    return {
      success: true,
      message:
        "Campaign deleted successfully",
    }
  } catch (error) {
    console.error(
      "deleteCampaignAction error:",
      error
    )

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete campaign",
    }
  }
}

/* =========================================================
   CHANGE CAMPAIGN STATUS
========================================================= */

export async function changeCampaignStatusAction(
  campaignId: string,
  status: CampaignStatus
): Promise<CampaignActionResult> {
  try {
    const {
      orgId,
    } =
      await getAuthenticatedContext()

    const campaign =
      await prisma.marketingCampaign.findFirst({
        where: {
          id: campaignId,
          orgId,
        },

        select: {
          id: true,
        },
      })

    if (!campaign) {
      return {
        success: false,
        message:
          "Campaign not found",
      }
    }

    await prisma.marketingCampaign.update({
      where: {
        id: campaignId,
      },

      data: {
        status,
      },
    })

    revalidatePath(
      "/admin/marketing/campaigns"
    )

    revalidatePath(
      `/admin/marketing/campaigns/${campaignId}`
    )

    return {
      success: true,
      message:
        "Campaign status updated successfully",
      campaignId,
    }
  } catch (error) {
    console.error(
      "changeCampaignStatusAction error:",
      error
    )

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update campaign status",
    }
  }
}

/* =========================================================
   ADD LEADS TO CAMPAIGN
========================================================= */

export async function addCampaignLeadsAction(
  campaignId: string,
  companyLeadIds: string[]
): Promise<CampaignActionResult> {
  try {
    const {
      orgId,
    } =
      await getAuthenticatedContext()

    if (!campaignId) {
      return {
        success: false,
        message:
          "Campaign ID is required",
      }
    }

    const uniqueLeadIds =
      Array.from(
        new Set(companyLeadIds)
      )

    if (
      uniqueLeadIds.length === 0
    ) {
      return {
        success: false,
        message:
          "Select at least one lead",
      }
    }

    /* -----------------------------------------------------
       VERIFY CAMPAIGN OWNERSHIP
    ----------------------------------------------------- */

    const campaign =
      await prisma.marketingCampaign.findFirst({
        where: {
          id: campaignId,
          orgId,
        },

        select: {
          id: true,
        },
      })

    if (!campaign) {
      return {
        success: false,
        message:
          "Campaign not found",
      }
    }

    /* -----------------------------------------------------
       VERIFY LEAD OWNERSHIP
    ----------------------------------------------------- */

    const validLeads =
      await prisma.companyLead.findMany({
        where: {
          orgId,

          id: {
            in: uniqueLeadIds,
          },
        },

        select: {
          id: true,
        },
      })

    if (
      validLeads.length === 0
    ) {
      return {
        success: false,
        message:
          "No valid leads were found",
      }
    }

    const validLeadIds =
      validLeads.map(
        (lead) => lead.id
      )

    /* -----------------------------------------------------
       CREATE ATTRIBUTION RECORDS
    ----------------------------------------------------- */

    await prisma.marketingCampaignLead.createMany({
      data:
        validLeadIds.map(
          (companyLeadId) => ({
            campaignId,
            companyLeadId,
          })
        ),

      skipDuplicates: true,
    })

    /* -----------------------------------------------------
       SYNCHRONIZE LEAD COUNTER
    ----------------------------------------------------- */

    const leadCount =
      await prisma.marketingCampaignLead.count({
        where: {
          campaignId,
        },
      })

    await prisma.marketingCampaign.update({
      where: {
        id: campaignId,
      },

      data: {
        leads:
          leadCount,
      },
    })

    revalidatePath(
      "/admin/marketing/campaigns"
    )

    revalidatePath(
      `/admin/marketing/campaigns/${campaignId}`
    )

    return {
      success: true,
      message:
        `${validLeadIds.length} lead(s) added to campaign`,
      campaignId,
    }
  } catch (error) {
    console.error(
      "addCampaignLeadsAction error:",
      error
    )

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to add campaign leads",
    }
  }
}

/* =========================================================
   REMOVE LEAD FROM CAMPAIGN
========================================================= */

/* =========================================================
   REMOVE LEAD FROM CAMPAIGN
========================================================= */

export async function removeCampaignLeadAction(
  campaignId: string,
  companyLeadId: string
): Promise<CampaignActionResult> {
  try {
    const {
      orgId,
    } =
      await getAuthenticatedContext()

    /* -----------------------------------------------------
       VERIFY CAMPAIGN OWNERSHIP
    ----------------------------------------------------- */

    const campaign =
      await prisma.marketingCampaign.findFirst({
        where: {
          id: campaignId,
          orgId,
        },

        select: {
          id: true,
        },
      })

    if (!campaign) {
      return {
        success: false,
        message:
          "Campaign not found",
      }
    }

    /* -----------------------------------------------------
       VERIFY CAMPAIGN LEAD EXISTS
    ----------------------------------------------------- */

    const campaignLead =
      await prisma.marketingCampaignLead.findFirst({
        where: {
          campaignId,
          companyLeadId,
        },

        select: {
          id: true,
          converted: true,
        },
      })

    if (!campaignLead) {
      return {
        success: false,
        message:
          "Campaign lead not found",
      }
    }

    /* -----------------------------------------------------
       DELETE + RECALCULATE COUNTERS
    ----------------------------------------------------- */

    await prisma.$transaction(
      async (tx) => {
        /* DELETE ATTRIBUTION */

        await tx.marketingCampaignLead.delete({
          where: {
            id: campaignLead.id,
          },
        })

        /* COUNT REMAINING LEADS */

        const leadCount =
          await tx.marketingCampaignLead.count({
            where: {
              campaignId,
            },
          })

        /* COUNT REMAINING CONVERSIONS */

        const conversionCount =
          await tx.marketingCampaignLead.count({
            where: {
              campaignId,
              converted: true,
            },
          })

        /* SYNCHRONIZE CAMPAIGN COUNTERS */

        await tx.marketingCampaign.update({
          where: {
            id: campaignId,
          },

          data: {
            leads:
              leadCount,

            conversions:
              conversionCount,
          },
        })
      }
    )

    /* -----------------------------------------------------
       REVALIDATE
    ----------------------------------------------------- */

    revalidatePath(
      "/admin/marketing/campaigns"
    )

    revalidatePath(
      `/admin/marketing/campaigns/${campaignId}`
    )

    revalidatePath(
      "/admin/marketing/dashboard"
    )

    /* -----------------------------------------------------
       RESULT
    ----------------------------------------------------- */

    return {
      success: true,

      message:
        campaignLead.converted
          ? "Converted lead removed and campaign metrics updated"
          : "Lead removed from campaign",

      campaignId,
    }
  } catch (error) {
    console.error(
      "removeCampaignLeadAction error:",
      error
    )

    return {
      success: false,

      message:
        error instanceof Error
          ? error.message
          : "Failed to remove campaign lead",
    }
  }
}

/* =========================================================
   MARK LEAD AS CONVERTED
========================================================= */

export async function markCampaignLeadConvertedAction(
  campaignId: string,
  companyLeadId: string
): Promise<CampaignActionResult> {
  try {
    const {
      orgId,
    } =
      await getAuthenticatedContext()

    const campaign =
      await prisma.marketingCampaign.findFirst({
        where: {
          id: campaignId,
          orgId,
        },

        select: {
          id: true,
        },
      })

    if (!campaign) {
      return {
        success: false,
        message:
          "Campaign not found",
      }
    }

    const campaignLead =
      await prisma.marketingCampaignLead.findFirst({
        where: {
          campaignId,
          companyLeadId,
        },

        select: {
          id: true,
          converted: true,
        },
      })

    if (!campaignLead) {
      return {
        success: false,
        message:
          "Campaign lead not found",
      }
    }

    if (campaignLead.converted) {
      return {
        success: true,
        message:
          "Lead is already marked as converted",
        campaignId,
      }
    }

    await prisma.$transaction(
      async (tx) => {
        await tx.marketingCampaignLead.update({
          where: {
            id:
              campaignLead.id,
          },

          data: {
            converted: true,

            convertedAt:
              new Date(),
          },
        })

        const conversionCount =
          await tx.marketingCampaignLead.count({
            where: {
              campaignId,
              converted: true,
            },
          })

        await tx.marketingCampaign.update({
          where: {
            id: campaignId,
          },

          data: {
            conversions:
              conversionCount,
          },
        })
      }
    )

    revalidatePath(
      "/admin/marketing/campaigns"
    )

    revalidatePath(
      `/admin/marketing/campaigns/${campaignId}`
    )

    return {
      success: true,
      message:
        "Lead marked as converted",
      campaignId,
    }
  } catch (error) {
    console.error(
      "markCampaignLeadConvertedAction error:",
      error
    )

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update conversion",
    }
  }
}