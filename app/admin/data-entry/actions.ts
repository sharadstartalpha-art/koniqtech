"use server"

import {
  LeadStatus,
  Prisma
} from "@prisma/client"

import {
  revalidatePath
} from "next/cache"

import {
  redirect
} from "next/navigation"

import { auth } from "@/auth"

import prisma from "@/shared/lib/prisma"


// ============================================================
// TYPES
// ============================================================

export type DataEntryActionState = {
  success: boolean

  message: string

  errors?: Record<
    string,
    string
  >

  leadId?: string
}


// ============================================================
// INITIAL STATE
// ============================================================




// ============================================================
// AUTH CONTEXT
// ============================================================

async function getAuthContext() {

  const session =
    await auth()


  if (
    !session?.user?.id ||
    !session.user.orgId
  ) {
    throw new Error(
      "Unauthorized"
    )
  }


  return {

    userId:
      session.user.id,

    orgId:
      session.user.orgId,

    role:
      session.user.role

  }
}


// ============================================================
// STRING VALUE
// ============================================================

function getString(
  formData: FormData,
  key: string
) {

  const value =
    formData.get(key)


  if (
    typeof value !== "string"
  ) {
    return ""
  }


  return value.trim()
}


// ============================================================
// OPTIONAL STRING
// ============================================================

function getOptionalString(
  formData: FormData,
  key: string
) {

  const value =
    getString(
      formData,
      key
    )


  return value || null
}


// ============================================================
// OPTIONAL NUMBER
// ============================================================

function getOptionalNumber(
  formData: FormData,
  key: string
) {

  const rawValue =
    getString(
      formData,
      key
    )


  if (!rawValue) {
    return null
  }


  const normalized =
    rawValue.replace(
      /,/g,
      ""
    )


  const value =
    Number(normalized)


  if (
    !Number.isFinite(value)
  ) {
    return null
  }


  return value
}


// ============================================================
// EMAIL VALIDATION
// ============================================================

function isValidEmail(
  value: string
) {

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    value
  )
}


// ============================================================
// PHONE NORMALIZER
// ============================================================

function normalizePhone(
  value: string | null
) {

  if (!value) {
    return null
  }


  return value
    .replace(
      /[^\d+\-()\s]/g,
      ""
    )
    .trim()
}


// ============================================================
// LEAD STATUS VALIDATION
// ============================================================

function parseLeadStatus(
  value: string
):
  LeadStatus | null {

  if (
    Object.values(
      LeadStatus
    ).includes(
      value as LeadStatus
    )
  ) {
    return value as LeadStatus
  }


  return null
}


// ============================================================
// FORM VALUES
// ============================================================

type ParsedLeadForm = {
  source: string | null

  firstName: string

  lastName: string | null

  phone: string | null

  email: string | null

  companyName: string | null

  address: string | null

  budget: number | null

  priority: string

  tags: string | null

  attachment: string | null

  industry: string | null

  status: LeadStatus

  assignedTo: string | null
}


// ============================================================
// PARSE + VALIDATE LEAD FORM
// ============================================================

function parseLeadForm(
  formData: FormData
):
  | {
      success: true

      data: ParsedLeadForm
    }
  | {
      success: false

      errors: Record<
        string,
        string
      >
    } {

  const errors:
    Record<
      string,
      string
    > = {}


  // ----------------------------------------------------------
  // BASIC VALUES
  // ----------------------------------------------------------

  const source =
    getOptionalString(
      formData,
      "source"
    )


  const firstName =
    getString(
      formData,
      "firstName"
    )


  const lastName =
    getOptionalString(
      formData,
      "lastName"
    )


  const rawPhone =
    getOptionalString(
      formData,
      "phone"
    )


  const phone =
    normalizePhone(
      rawPhone
    )


  const email =
    getOptionalString(
      formData,
      "email"
    )


  const companyName =
    getOptionalString(
      formData,
      "companyName"
    )


  const address =
    getOptionalString(
      formData,
      "address"
    )


  const rawBudget =
    getString(
      formData,
      "budget"
    )


  const budget =
    getOptionalNumber(
      formData,
      "budget"
    )


  const priority =
    getString(
      formData,
      "priority"
    ) ||
    "Medium"


  const tags =
    getOptionalString(
      formData,
      "tags"
    )


  const attachment =
    getOptionalString(
      formData,
      "attachment"
    )


  const industry =
    getOptionalString(
      formData,
      "industry"
    )


  const statusValue =
    getString(
      formData,
      "status"
    ) ||
    LeadStatus.new


  const status =
    parseLeadStatus(
      statusValue
    )


  const assignedTo =
    getOptionalString(
      formData,
      "assignedTo"
    )


  // ----------------------------------------------------------
  // VALIDATION
  // ----------------------------------------------------------

  if (!firstName) {

    errors.firstName =
      "First name is required."

  } else if (
    firstName.length > 100
  ) {

    errors.firstName =
      "First name must be 100 characters or fewer."

  }


  if (
    lastName &&
    lastName.length > 100
  ) {

    errors.lastName =
      "Last name must be 100 characters or fewer."

  }


  if (
    email &&
    !isValidEmail(email)
  ) {

    errors.email =
      "Enter a valid email address."

  }


  if (
    rawBudget &&
    budget === null
  ) {

    errors.budget =
      "Budget must be a valid number."

  }


  if (
    budget !== null &&
    budget < 0
  ) {

    errors.budget =
      "Budget cannot be negative."

  }


  const allowedPriorities = [
    "Low",
    "Medium",
    "High",
    "Urgent"
  ]


  if (
    !allowedPriorities.includes(
      priority
    )
  ) {

    errors.priority =
      "Select a valid priority."

  }


  if (!status) {

    errors.status =
      "Select a valid lead status."

  }


  if (
    Object.keys(errors).length > 0
  ) {

    return {

      success:
        false,

      errors

    }
  }


  return {

    success:
      true,

    data: {

      source,

      firstName,

      lastName,

      phone,

      email,

      companyName,

      address,

      budget,

      priority,

      tags,

      attachment,

      industry,

      status:
        status as LeadStatus,

      assignedTo

    }

  }
}


// ============================================================
// VERIFY ASSIGNEE
// ============================================================

async function validateAssignee(
  assignedTo: string | null,
  orgId: string
) {

  if (!assignedTo) {
    return true
  }


  const user =
    await prisma.user.findFirst({

      where: {

        id:
          assignedTo,

        orgId

      },

      select: {
        id: true
      }

    })


  return Boolean(user)
}


// ============================================================
// VERIFY LEAD OWNERSHIP
// ============================================================

async function getLeadForOrganization(
  leadId: string,
  orgId: string
) {

  return prisma.lead.findFirst({

    where: {

      id:
        leadId,

      orgId

    }

  })
}


// ============================================================
// CREATE LEAD
// ============================================================

export async function createLeadAction(
  previousState: DataEntryActionState,
  formData: FormData
):
  Promise<DataEntryActionState> {

  let createdLeadId:
    string | null = null


  try {

    const {
      orgId
    } =
      await getAuthContext()


    // --------------------------------------------------------
    // VALIDATE FORM
    // --------------------------------------------------------

    const parsed =
      parseLeadForm(
        formData
      )


    if (!parsed.success) {

      return {

        success:
          false,

        message:
          "Please correct the highlighted fields.",

        errors:
          parsed.errors

      }
    }


    // --------------------------------------------------------
    // VALIDATE ASSIGNEE
    // --------------------------------------------------------

    const assigneeValid =
      await validateAssignee(
        parsed.data.assignedTo,
        orgId
      )


    if (!assigneeValid) {

      return {

        success:
          false,

        message:
          "The selected assignee is not available.",

        errors: {

          assignedTo:
            "Select a valid user from your organization."

        }

      }
    }


    // --------------------------------------------------------
    // INDUSTRY VALUE
    //
    // Industry is intentionally passed through Prisma's typed
    // create input below. If your Industry enum is strict,
    // the LeadForm should submit exact enum values.
    // --------------------------------------------------------

    const createData:
      Prisma.LeadUncheckedCreateInput = {

      orgId,

      source:
        parsed.data.source,

      firstName:
        parsed.data.firstName,

      lastName:
        parsed.data.lastName,

      phone:
        parsed.data.phone,

      email:
        parsed.data.email,

      companyName:
        parsed.data.companyName,

      address:
        parsed.data.address,

      budget:
        parsed.data.budget,

      priority:
        parsed.data.priority,

      tags:
        parsed.data.tags,

      attachment:
        parsed.data.attachment,

      status:
        parsed.data.status,

      assignedTo:
        parsed.data.assignedTo

    }


    /*
      Industry is optional.

      We assign it only when a value exists because Industry
      is a Prisma enum in your Lead model.
    */

    if (
      parsed.data.industry
    ) {

      createData.industry =
        parsed.data.industry as
          Prisma.LeadUncheckedCreateInput["industry"]

    }


    // --------------------------------------------------------
    // CREATE LEAD + ACTIVITY
    // --------------------------------------------------------

    const lead =
      await prisma.$transaction(
        async (tx) => {

          const created =
            await tx.lead.create({

              data:
                createData,

              select: {
                id: true
              }

            })


          await tx.leadActivity.create({

            data: {

              leadId:
                created.id,

              type:
                "created",

              title:
                "Lead created through Data Entry"

            }

          })


          return created
        }
      )


    createdLeadId =
      lead.id


  } catch (error) {

    console.error(
      "CREATE_DATA_ENTRY_LEAD_ERROR",
      error
    )


    return {

      success:
        false,

      message:
        "Unable to create the lead. Please try again.",

      errors: {

        form:
          "An unexpected error occurred while creating the lead."

      }

    }
  }


  // ----------------------------------------------------------
  // REVALIDATE + REDIRECT
  //
  // Keep redirect outside try/catch because Next.js redirect()
  // throws an internal control-flow exception.
  // ----------------------------------------------------------

  revalidatePath(
    "/admin/data-entry"
  )


  if (createdLeadId) {

    redirect(
      `/admin/data-entry/${createdLeadId}`
    )

  }


  return {

    success:
      true,

    message:
      "Lead created successfully."

  }
}


// ============================================================
// UPDATE LEAD
// ============================================================

export async function updateLeadAction(
  leadId: string,
  previousState: DataEntryActionState,
  formData: FormData
):
  Promise<DataEntryActionState> {

  let shouldRedirect =
    false


  try {

    const {
      orgId
    } =
      await getAuthContext()


    // --------------------------------------------------------
    // VERIFY LEAD
    // --------------------------------------------------------

    const existingLead =
      await getLeadForOrganization(
        leadId,
        orgId
      )


    if (!existingLead) {

      return {

        success:
          false,

        message:
          "Lead not found.",

        errors: {

          form:
            "This lead does not exist or you do not have access to it."

        }

      }
    }


    // --------------------------------------------------------
    // VALIDATE FORM
    // --------------------------------------------------------

    const parsed =
      parseLeadForm(
        formData
      )


    if (!parsed.success) {

      return {

        success:
          false,

        message:
          "Please correct the highlighted fields.",

        errors:
          parsed.errors

      }
    }


    // --------------------------------------------------------
    // VALIDATE ASSIGNEE
    // --------------------------------------------------------

    const assigneeValid =
      await validateAssignee(
        parsed.data.assignedTo,
        orgId
      )


    if (!assigneeValid) {

      return {

        success:
          false,

        message:
          "The selected assignee is not available.",

        errors: {

          assignedTo:
            "Select a valid user from your organization."

        }

      }
    }


    // --------------------------------------------------------
    // UPDATE DATA
    // --------------------------------------------------------

    const updateData:
      Prisma.LeadUncheckedUpdateInput = {

      source:
        parsed.data.source,

      firstName:
        parsed.data.firstName,

      lastName:
        parsed.data.lastName,

      phone:
        parsed.data.phone,

      email:
        parsed.data.email,

      companyName:
        parsed.data.companyName,

      address:
        parsed.data.address,

      budget:
        parsed.data.budget,

      priority:
        parsed.data.priority,

      tags:
        parsed.data.tags,

      attachment:
        parsed.data.attachment,

      status:
        parsed.data.status,

      assignedTo:
        parsed.data.assignedTo,

      industry:
        parsed.data.industry
          ? parsed.data.industry as
              Prisma.LeadUncheckedUpdateInput["industry"]
          : null

    }


    // --------------------------------------------------------
    // DETERMINE ACTIVITY
    // --------------------------------------------------------

    const statusChanged =
      existingLead.status !==
      parsed.data.status


    const assigneeChanged =
      existingLead.assignedTo !==
      parsed.data.assignedTo


    // --------------------------------------------------------
    // UPDATE + ACTIVITIES
    // --------------------------------------------------------

    await prisma.$transaction(
      async (tx) => {

        await tx.lead.update({

          where: {
            id:
              leadId
          },

          data:
            updateData

        })


        await tx.leadActivity.create({

          data: {

            leadId,

            type:
              "updated",

            title:
              "Lead information updated"

          }

        })


        if (statusChanged) {

          await tx.leadActivity.create({

            data: {

              leadId,

              type:
                "status_changed",

              title:
                `Status changed from ${existingLead.status} to ${parsed.data.status}`

            }

          })

        }


        if (assigneeChanged) {

          await tx.leadActivity.create({

            data: {

              leadId,

              type:
                "assignment_changed",

              title:
                parsed.data.assignedTo
                  ? "Lead assignment updated"
                  : "Lead assignment removed"

            }

          })

        }

      }
    )


    shouldRedirect =
      true


  } catch (error) {

    console.error(
      "UPDATE_DATA_ENTRY_LEAD_ERROR",
      error
    )


    return {

      success:
        false,

      message:
        "Unable to update the lead.",

      errors: {

        form:
          "An unexpected error occurred while updating the lead."

      }

    }
  }


  // ----------------------------------------------------------
  // REVALIDATE
  // ----------------------------------------------------------

  revalidatePath(
    "/admin/data-entry"
  )

  revalidatePath(
    `/admin/data-entry/${leadId}`
  )


  if (shouldRedirect) {

    redirect(
      `/admin/data-entry/${leadId}`
    )

  }


  return {

    success:
      true,

    message:
      "Lead updated successfully."

  }
}


// ============================================================
// DELETE LEAD
// ============================================================

export async function deleteLeadAction(
  leadId: string
):
  Promise<{
    success: boolean

    message: string
  }> {

  try {

    const {
      orgId
    } =
      await getAuthContext()


    // --------------------------------------------------------
    // VERIFY OWNERSHIP
    // --------------------------------------------------------

    const lead =
      await getLeadForOrganization(
        leadId,
        orgId
      )


    if (!lead) {

      return {

        success:
          false,

        message:
          "Lead not found or access denied."

      }
    }


    // --------------------------------------------------------
    // DELETE
    //
    // LeadNote uses Cascade.
    //
    // Your LeadActivity relation currently does NOT have
    // onDelete: Cascade, so activities are deleted explicitly.
    // --------------------------------------------------------

    await prisma.$transaction(
      async (tx) => {

        await tx.leadActivity.deleteMany({

          where: {
             id: leadId
          }

        })


        await tx.lead.delete({

          where: {
            id:
              leadId
          }

        })

      }
    )


  } catch (error) {

    console.error(
      "DELETE_DATA_ENTRY_LEAD_ERROR",
      error
    )


    return {

      success:
        false,

      message:
        "Unable to delete the lead."

    }
  }


  revalidatePath(
    "/admin/data-entry"
  )


  redirect(
    "/admin/data-entry"
  )
}


// ============================================================
// ADD LEAD NOTE
// ============================================================

export async function addLeadNoteAction(
  leadId: string,
  formData: FormData
) {

  const {
    orgId,
    userId
  } =
    await getAuthContext()


  const content =
    String(
      formData.get(
        "content"
      ) ?? ""
    ).trim()


  if (!content) {

    return {
      success: false,
      message:
        "Note content is required."
    }

  }


  const lead =
    await prisma.lead.findFirst({

      where: {

        id:
          leadId,

        orgId

      },

      select: {

        id:
          true

      }

    })


  if (!lead) {

    return {
      success: false,
      message:
        "Lead not found or access denied."
    }

  }


  await prisma.$transaction(
    async (tx) => {

      await tx.leadNote.create({

        data: {

          leadId,

          content,

          createdBy:
            userId

        }

      })


      await tx.leadActivity.create({

        data: {

          leadId,

          type:
            "note",

          title:
            "A new note was added"

        }

      })

    }
  )


  revalidatePath(
    `/admin/data-entry/${leadId}`
  )


  return {
    success: true,
    message:
      "Note added successfully."
  }
}

// ============================================================
// DELETE LEAD NOTE
// ============================================================

export async function deleteLeadNoteAction(
  leadId: string,
  noteId: string
):
  Promise<{
    success: boolean

    message: string
  }> {

  try {

    const {
      orgId
    } =
      await getAuthContext()


    // --------------------------------------------------------
    // VERIFY LEAD OWNERSHIP
    // --------------------------------------------------------

    const lead =
      await getLeadForOrganization(
        leadId,
        orgId
      )


    if (!lead) {

      return {

        success:
          false,

        message:
          "Lead not found or access denied."

      }
    }


    // --------------------------------------------------------
    // VERIFY NOTE
    // --------------------------------------------------------

    const note =
      await prisma.leadNote.findFirst({

        where: {

          id:
            noteId,

          leadId

        },

        select: {
          id: true
        }

      })


    if (!note) {

      return {

        success:
          false,

        message:
          "Note not found."

      }
    }


    // --------------------------------------------------------
    // DELETE NOTE
    // --------------------------------------------------------

    await prisma.leadNote.delete({

      where: {
        id:
          noteId
      }

    })


  } catch (error) {

    console.error(
      "DELETE_DATA_ENTRY_NOTE_ERROR",
      error
    )


    return {

      success:
        false,

      message:
        "Unable to delete the note."

    }
  }


  revalidatePath(
    `/admin/data-entry/${leadId}`
  )


  return {

    success:
      true,

    message:
      "Note deleted successfully."

  }
}


// ============================================================
// CHANGE LEAD STATUS
// ============================================================

export async function changeLeadStatusAction(
  leadId: string,
  status: LeadStatus
):
  Promise<{
    success: boolean

    message: string
  }> {

  try {

    const {
      orgId
    } =
      await getAuthContext()


    // --------------------------------------------------------
    // VALIDATE STATUS
    // --------------------------------------------------------

    if (
      !Object.values(
        LeadStatus
      ).includes(status)
    ) {

      return {

        success:
          false,

        message:
          "Invalid lead status."

      }
    }


    // --------------------------------------------------------
    // VERIFY LEAD
    // --------------------------------------------------------

    const lead =
      await getLeadForOrganization(
        leadId,
        orgId
      )


    if (!lead) {

      return {

        success:
          false,

        message:
          "Lead not found or access denied."

      }
    }


    if (
      lead.status === status
    ) {

      return {

        success:
          true,

        message:
          "Lead already has this status."

      }
    }


    // --------------------------------------------------------
    // UPDATE + ACTIVITY
    // --------------------------------------------------------

    await prisma.$transaction(
      async (tx) => {

        await tx.lead.update({

          where: {
            id:
              leadId
          },

          data: {
            status
          }

        })


        await tx.leadActivity.create({

          data: {

            leadId,

            type:
              "status_changed",

            title:
              `Status changed from ${lead.status} to ${status}`

          }

        })

      }
    )


  } catch (error) {

    console.error(
      "CHANGE_DATA_ENTRY_STATUS_ERROR",
      error
    )


    return {

      success:
        false,

      message:
        "Unable to change lead status."

    }
  }


  revalidatePath(
    "/admin/data-entry"
  )

  revalidatePath(
    `/admin/data-entry/${leadId}`
  )


  return {

    success:
      true,

    message:
      "Lead status updated successfully."

  }
}