"use server"

import {
  CampaignChannel,
  CampaignStatus,
} from "@prisma/client"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

/* =========================================================
   TYPES
========================================================= */

export type CampaignActionState = {
  success: boolean
  message: string

  errors?: Record<
    string,
    string[]
  >
}

/* =========================================================
   ENUM VALIDATION
========================================================= */

const VALID_CHANNELS =
  Object.values(CampaignChannel)

const VALID_STATUSES =
  Object.values(CampaignStatus)

/* =========================================================
   CREATE CAMPAIGN
========================================================= */

export async function createCampaignAction(
  _previousState: CampaignActionState,
  formData: FormData
): Promise<CampaignActionState> {
  /* =======================================================
     AUTHENTICATION
  ======================================================= */

  const session = await auth()

  if (
    !session?.user?.id
  ) {
    return {
      success: false,
      message:
        "You must be signed in to create a campaign.",
    }
  }

  /* =======================================================
     FORM VALUES
  ======================================================= */

  const title =
    formData
      .get("title")
      ?.toString()
      .trim() ?? ""

  const channelValue =
    formData
      .get("channel")
      ?.toString()
      .trim() ?? ""

  const statusValue =
    formData
      .get("status")
      ?.toString()
      .trim() ?? ""

  const budgetValue =
    formData
      .get("budget")
      ?.toString()
      .trim() ?? ""

  const startDateValue =
    formData
      .get("startDate")
      ?.toString()
      .trim() ?? ""

  const endDateValue =
    formData
      .get("endDate")
      ?.toString()
      .trim() ?? ""

  /* =======================================================
     VALIDATION
  ======================================================= */

  const errors: Record<
    string,
    string[]
  > = {}

  /* TITLE */

  if (!title) {
    errors.title = [
      "Campaign title is required.",
    ]
  } else if (title.length < 3) {
    errors.title = [
      "Campaign title must contain at least 3 characters.",
    ]
  } else if (title.length > 150) {
    errors.title = [
      "Campaign title must not exceed 150 characters.",
    ]
  }

  /* CHANNEL */

  if (
    !VALID_CHANNELS.includes(
      channelValue as CampaignChannel
    )
  ) {
    errors.channel = [
      "Please select a valid campaign channel.",
    ]
  }

  /* STATUS */

  if (
    !VALID_STATUSES.includes(
      statusValue as CampaignStatus
    )
  ) {
    errors.status = [
      "Please select a valid campaign status.",
    ]
  }

  /* BUDGET */

  let budget: number | null = null

  if (budgetValue) {
    const parsedBudget =
      Number(budgetValue)

    if (
      Number.isNaN(parsedBudget) ||
      parsedBudget < 0
    ) {
      errors.budget = [
        "Budget must be a valid positive number.",
      ]
    } else {
      budget = parsedBudget
    }
  }

  /* START DATE */

  let startDate: Date | null = null

  if (startDateValue) {
    const parsedStartDate =
      new Date(
        `${startDateValue}T00:00:00.000Z`
      )

    if (
      Number.isNaN(
        parsedStartDate.getTime()
      )
    ) {
      errors.startDate = [
        "Please enter a valid start date.",
      ]
    } else {
      startDate =
        parsedStartDate
    }
  }

  /* END DATE */

  let endDate: Date | null = null

  if (endDateValue) {
    const parsedEndDate =
      new Date(
        `${endDateValue}T23:59:59.999Z`
      )

    if (
      Number.isNaN(
        parsedEndDate.getTime()
      )
    ) {
      errors.endDate = [
        "Please enter a valid end date.",
      ]
    } else {
      endDate =
        parsedEndDate
    }
  }

  /* DATE RANGE */

  if (
    startDate &&
    endDate &&
    endDate < startDate
  ) {
    errors.endDate = [
      "End date cannot be earlier than the start date.",
    ]
  }

  /* RETURN VALIDATION ERRORS */

  if (
    Object.keys(errors).length > 0
  ) {
    return {
      success: false,
      message:
        "Please correct the highlighted fields.",
      errors,
    }
  }

  /* =======================================================
     CREATE CAMPAIGN
  ======================================================= */

  try {
    await prisma.marketingCampaign.create({
      data: {
        title,

        channel:
          channelValue as CampaignChannel,

        status:
          statusValue as CampaignStatus,

        budget,

        startDate,

        endDate,

        leads: 0,

        conversions: 0,

        createdByUserId:
          session.user.id,
      },
    })

    /* =====================================================
       REVALIDATION
    ===================================================== */

    revalidatePath(
      "/admin/marketing/campaigns"
    )

    revalidatePath(
      "/admin/marketing/dashboard"
    )

    return {
      success: true,
      message:
        "Campaign created successfully.",
    }
  } catch (error) {
    console.error(
      "CREATE_MARKETING_CAMPAIGN_ERROR",
      error
    )

    return {
      success: false,
      message:
        "Unable to create the campaign. Please try again.",
    }
  }
}

/* =========================================================
   UPDATE CAMPAIGN STATUS
========================================================= */

export async function updateCampaignStatusAction(
  campaignId: string,
  status: CampaignStatus
) {
  const session = await auth()

  if (
    !session?.user?.id
  ) {
    throw new Error(
      "Unauthorized"
    )
  }

  if (
    !campaignId
  ) {
    throw new Error(
      "Campaign ID is required."
    )
  }

  if (
    !VALID_STATUSES.includes(status)
  ) {
    throw new Error(
      "Invalid campaign status."
    )
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

  revalidatePath(
    "/admin/marketing/dashboard"
  )
}

/* =========================================================
   DELETE CAMPAIGN
========================================================= */

export async function deleteCampaignAction(
  campaignId: string
) {
  const session = await auth()

  if (
    !session?.user?.id
  ) {
    throw new Error(
      "Unauthorized"
    )
  }

  if (
    !campaignId
  ) {
    throw new Error(
      "Campaign ID is required."
    )
  }

  await prisma.marketingCampaign.delete({
    where: {
      id: campaignId,
    },
  })

  revalidatePath(
    "/admin/marketing/campaigns"
  )

  revalidatePath(
    "/admin/marketing/dashboard"
  )

  redirect(
    "/admin/marketing/campaigns"
  )
}