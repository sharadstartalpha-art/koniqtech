"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import {
  MarketingTemplateCategory,
  MarketingTemplateStatus
} from "@prisma/client"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

/* =========================================================
   TYPES
========================================================= */

export type MarketingTemplateActionResult = {
  success: boolean
  message: string
  templateId?: string
}

export type CreateMarketingTemplateInput = {
  name: string
  description?: string | null

  category: MarketingTemplateCategory

  subject?: string | null
  previewText?: string | null

  content: string

  status?: MarketingTemplateStatus
}

export type UpdateMarketingTemplateInput = {
  name: string
  description?: string | null

  category: MarketingTemplateCategory

  subject?: string | null
  previewText?: string | null

  content: string

  status: MarketingTemplateStatus
}

/* =========================================================
   HELPERS
========================================================= */

function cleanOptionalString(
  value?: string | null
) {
  const cleaned = value?.trim()

  return cleaned
    ? cleaned
    : null
}

async function getAuthenticatedUser() {

  const session = await auth()

  const userId =
    (session?.user as {
      id?: string
    } | undefined)?.id

  if (!userId) {
    throw new Error(
      "You must be signed in to perform this action."
    )
  }

  const user =
    await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        id: true,
        orgId: true,
        role: true
      }
    })

  if (!user) {
    throw new Error(
      "Authenticated user was not found."
    )
  }

  if (!user.orgId) {
    throw new Error(
      "User organization was not found."
    )
  }

  return user
}

/* =========================================================
   CREATE TEMPLATE
========================================================= */

export async function createMarketingTemplateAction(
  input: CreateMarketingTemplateInput
): Promise<MarketingTemplateActionResult> {

  try {

    const user =
      await getAuthenticatedUser()

    const name =
      input.name.trim()

    const content =
      input.content.trim()

    if (!name) {
      return {
        success: false,
        message:
          "Template name is required."
      }
    }

    if (!content) {
      return {
        success: false,
        message:
          "Template content is required."
      }
    }

    const template =
      await prisma.marketingTemplate.create({
        data: {
          orgId:
            user.orgId,

          name,

          description:
            cleanOptionalString(
              input.description
            ),

          category:
            input.category,

          subject:
            cleanOptionalString(
              input.subject
            ),

          previewText:
            cleanOptionalString(
              input.previewText
            ),

          content,

          status:
            input.status ??
            MarketingTemplateStatus.active,

          createdByUserId:
            user.id
        },
        select: {
          id: true
        }
      })

    revalidatePath(
      "/admin/marketing/templates"
    )

    return {
      success: true,
      message:
        "Template created successfully.",
      templateId:
        template.id
    }

  } catch (error) {

    console.error(
      "CREATE_MARKETING_TEMPLATE_ERROR",
      error
    )

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to create template."
    }
  }
}

/* =========================================================
   UPDATE TEMPLATE
========================================================= */

export async function updateMarketingTemplateAction(
  templateId: string,
  input: UpdateMarketingTemplateInput
): Promise<MarketingTemplateActionResult> {

  try {

    const user =
      await getAuthenticatedUser()

    const name =
      input.name.trim()

    const content =
      input.content.trim()

    if (!templateId) {
      return {
        success: false,
        message:
          "Template ID is required."
      }
    }

    if (!name) {
      return {
        success: false,
        message:
          "Template name is required."
      }
    }

    if (!content) {
      return {
        success: false,
        message:
          "Template content is required."
      }
    }

    const existingTemplate =
      await prisma.marketingTemplate.findFirst({
        where: {
          id: templateId,
          orgId: user.orgId
        },
        select: {
          id: true
        }
      })

    if (!existingTemplate) {
      return {
        success: false,
        message:
          "Template not found."
      }
    }

    await prisma.marketingTemplate.update({
      where: {
        id: existingTemplate.id
      },
      data: {
        name,

        description:
          cleanOptionalString(
            input.description
          ),

        category:
          input.category,

        subject:
          cleanOptionalString(
            input.subject
          ),

        previewText:
          cleanOptionalString(
            input.previewText
          ),

        content,

        status:
          input.status
      }
    })

    revalidatePath(
      "/admin/marketing/templates"
    )

    revalidatePath(
      `/admin/marketing/templates/${templateId}`
    )

    revalidatePath(
      `/admin/marketing/templates/${templateId}/edit`
    )

    return {
      success: true,
      message:
        "Template updated successfully.",
      templateId
    }

  } catch (error) {

    console.error(
      "UPDATE_MARKETING_TEMPLATE_ERROR",
      error
    )

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to update template."
    }
  }
}

/* =========================================================
   CHANGE TEMPLATE STATUS
========================================================= */

export async function changeMarketingTemplateStatusAction(
  templateId: string,
  status: MarketingTemplateStatus
): Promise<MarketingTemplateActionResult> {

  try {

    const user =
      await getAuthenticatedUser()

    const template =
      await prisma.marketingTemplate.findFirst({
        where: {
          id: templateId,
          orgId: user.orgId
        },
        select: {
          id: true
        }
      })

    if (!template) {
      return {
        success: false,
        message:
          "Template not found."
      }
    }

    await prisma.marketingTemplate.update({
      where: {
        id: template.id
      },
      data: {
        status
      }
    })

    revalidatePath(
      "/admin/marketing/templates"
    )

    revalidatePath(
      `/admin/marketing/templates/${templateId}`
    )

    return {
      success: true,
      message:
        "Template status updated successfully.",
      templateId
    }

  } catch (error) {

    console.error(
      "CHANGE_MARKETING_TEMPLATE_STATUS_ERROR",
      error
    )

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to update template status."
    }
  }
}

/* =========================================================
   DUPLICATE TEMPLATE
========================================================= */

export async function duplicateMarketingTemplateAction(
  templateId: string
): Promise<MarketingTemplateActionResult> {

  try {

    const user =
      await getAuthenticatedUser()

    const sourceTemplate =
      await prisma.marketingTemplate.findFirst({
        where: {
          id: templateId,
          orgId: user.orgId
        }
      })

    if (!sourceTemplate) {
      return {
        success: false,
        message:
          "Template not found."
      }
    }

    const duplicatedTemplate =
      await prisma.marketingTemplate.create({
        data: {
          orgId:
            user.orgId,

          name:
            `${sourceTemplate.name} Copy`,

          description:
            sourceTemplate.description,

          category:
            sourceTemplate.category,

          subject:
            sourceTemplate.subject,

          previewText:
            sourceTemplate.previewText,

          content:
            sourceTemplate.content,

          status:
            MarketingTemplateStatus.active,

          createdByUserId:
            user.id
        },
        select: {
          id: true
        }
      })

    revalidatePath(
      "/admin/marketing/templates"
    )

    return {
      success: true,
      message:
        "Template duplicated successfully.",
      templateId:
        duplicatedTemplate.id
    }

  } catch (error) {

    console.error(
      "DUPLICATE_MARKETING_TEMPLATE_ERROR",
      error
    )

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to duplicate template."
    }
  }
}

/* =========================================================
   INCREMENT USAGE COUNT
========================================================= */

export async function incrementMarketingTemplateUsageAction(
  templateId: string
): Promise<MarketingTemplateActionResult> {

  try {

    const user =
      await getAuthenticatedUser()

    const template =
      await prisma.marketingTemplate.findFirst({
        where: {
          id: templateId,
          orgId: user.orgId
        },
        select: {
          id: true
        }
      })

    if (!template) {
      return {
        success: false,
        message:
          "Template not found."
      }
    }

    await prisma.marketingTemplate.update({
      where: {
        id: template.id
      },
      data: {
        usageCount: {
          increment: 1
        }
      }
    })

    revalidatePath(
      "/admin/marketing/templates"
    )

    revalidatePath(
      `/admin/marketing/templates/${templateId}`
    )

    return {
      success: true,
      message:
        "Template usage recorded.",
      templateId
    }

  } catch (error) {

    console.error(
      "INCREMENT_MARKETING_TEMPLATE_USAGE_ERROR",
      error
    )

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to record template usage."
    }
  }
}

/* =========================================================
   DELETE TEMPLATE
========================================================= */

export async function deleteMarketingTemplateAction(
  templateId: string
): Promise<MarketingTemplateActionResult> {

  try {

    const user =
      await getAuthenticatedUser()

    const template =
      await prisma.marketingTemplate.findFirst({
        where: {
          id: templateId,
          orgId: user.orgId
        },
        select: {
          id: true
        }
      })

    if (!template) {
      return {
        success: false,
        message:
          "Template not found."
      }
    }

    await prisma.marketingTemplate.delete({
      where: {
        id: template.id
      }
    })

    revalidatePath(
      "/admin/marketing/templates"
    )

    return {
      success: true,
      message:
        "Template deleted successfully."
    }

  } catch (error) {

    console.error(
      "DELETE_MARKETING_TEMPLATE_ERROR",
      error
    )

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to delete template."
    }
  }
}

/* =========================================================
   DELETE + REDIRECT
========================================================= */

export async function deleteMarketingTemplateAndRedirectAction(
  templateId: string
) {

  const result =
    await deleteMarketingTemplateAction(
      templateId
    )

  if (!result.success) {
    return result
  }

  redirect(
    "/admin/marketing/templates"
  )
}