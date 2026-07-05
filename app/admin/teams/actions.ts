"use server"

import { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

/* =========================================================
   TYPES
========================================================= */

export type TeamActionState = {
  success: boolean
  message: string
  teamId?: string

  errors?: {
    name?: string
    description?: string
    departmentId?: string
    leaderId?: string
    memberIds?: string
    general?: string
  }
}

/* =========================================================
   AUTHORIZATION
========================================================= */

const TEAM_MANAGEMENT_ROLES = new Set([
  "super_admin",
  "platform_manager"
])

type TeamAdminContext = {
  userId: string
  orgId: string
  role: string
}

/**
 * Returns the current internal admin context.
 *
 * Team CRUD is currently restricted to:
 *
 * - super_admin
 * - platform_manager
 */
async function getTeamAdminContext(): Promise<TeamAdminContext> {
  const session = await auth()

  if (!session?.user) {
    throw new Error("UNAUTHORIZED")
  }

  const userId = String(
    session.user.id ?? ""
  )

  const orgId = String(
    session.user.orgId ?? ""
  )

  const role = String(
    session.user.role ?? ""
  )

  if (!userId) {
    throw new Error(
      "AUTHENTICATED_USER_ID_MISSING"
    )
  }

  if (!orgId) {
    throw new Error(
      "ORGANIZATION_CONTEXT_MISSING"
    )
  }

  if (!TEAM_MANAGEMENT_ROLES.has(role)) {
    throw new Error("FORBIDDEN")
  }

  return {
    userId,
    orgId,
    role
  }
}

/* =========================================================
   FORM HELPERS
========================================================= */

function getString(
  formData: FormData,
  key: string
): string {
  const value = formData.get(key)

  if (typeof value !== "string") {
    return ""
  }

  return value.trim()
}

/**
 * Supports:
 *
 * formData.append("memberIds", id)
 *
 * and:
 *
 * formData.append("memberIds[]", id)
 */
function getMemberIds(
  formData: FormData
): string[] {
  const directIds = formData
    .getAll("memberIds")
    .filter(
      (value): value is string =>
        typeof value === "string"
    )
    .map((value) => value.trim())
    .filter(Boolean)

  const bracketIds = formData
    .getAll("memberIds[]")
    .filter(
      (value): value is string =>
        typeof value === "string"
    )
    .map((value) => value.trim())
    .filter(Boolean)

  return Array.from(
    new Set([
      ...directIds,
      ...bracketIds
    ])
  )
}

/* =========================================================
   VALIDATION
========================================================= */

function validateTeamFields({
  name,
  description
}: {
  name: string
  description: string
}): TeamActionState["errors"] {
  const errors: NonNullable<
    TeamActionState["errors"]
  > = {}

  if (!name) {
    errors.name =
      "Team name is required"
  }

  if (name.length > 100) {
    errors.name =
      "Team name must be under 100 characters"
  }

  if (description.length > 1000) {
    errors.description =
      "Description must be under 1000 characters"
  }

  return errors
}

/* =========================================================
   INTERNAL USER VALIDATION

   IMPORTANT:
   Team uses User relations.

   For internal KoniqTech teams, only Users linked to an
   Employee record are allowed.
========================================================= */

async function validateInternalUsers({
  orgId,
  leaderId,
  memberIds
}: {
  orgId: string
  leaderId: string | null
  memberIds: string[]
}): Promise<TeamActionState | null> {
  const idsToValidate = Array.from(
    new Set([
      ...(leaderId ? [leaderId] : []),
      ...memberIds
    ])
  )

  if (idsToValidate.length === 0) {
    return null
  }

  const validUsers =
    await prisma.user.findMany({
      where: {
        id: {
          in: idsToValidate
        },

        orgId,

        status: "active",

        employee: {
          isNot: null
        }
      },

      select: {
        id: true
      }
    })

  const validUserIds = new Set(
    validUsers.map((user) => user.id)
  )

  if (
    leaderId &&
    !validUserIds.has(leaderId)
  ) {
    return {
      success: false,

      message:
        "The selected team leader is not a valid active internal employee.",

      errors: {
        leaderId:
          "Select a valid internal employee"
      }
    }
  }

  const invalidMembers =
    memberIds.filter(
      (memberId) =>
        !validUserIds.has(memberId)
    )

  if (invalidMembers.length > 0) {
    return {
      success: false,

      message:
        "One or more selected team members are invalid.",

      errors: {
        memberIds:
          "All team members must be active internal employees"
      }
    }
  }

  return null
}

/* =========================================================
   CREATE TEAM
========================================================= */

export async function createTeamAction(
  formData: FormData
): Promise<TeamActionState> {
  try {
    const {
      orgId
    } = await getTeamAdminContext()

    /* -----------------------------------------------------
       FORM DATA
    ----------------------------------------------------- */

    const name =
      getString(formData, "name")

    const description =
      getString(
        formData,
        "description"
      )

    const departmentIdValue =
      getString(
        formData,
        "departmentId"
      )

    const leaderIdValue =
      getString(
        formData,
        "leaderId"
      )

    const departmentId =
      departmentIdValue || null

    const leaderId =
      leaderIdValue || null

    const memberIds =
      getMemberIds(formData)

    /* -----------------------------------------------------
       BASIC VALIDATION
    ----------------------------------------------------- */

    const errors =
      validateTeamFields({
        name,
        description
      })

    if (
      errors &&
      Object.keys(errors).length > 0
    ) {
      return {
        success: false,
        message:
          "Please correct the highlighted fields.",
        errors
      }
    }

    /* -----------------------------------------------------
       DUPLICATE TEAM CHECK
    ----------------------------------------------------- */

    const duplicate =
      await prisma.team.findUnique({
        where: {
          orgId_name: {
            orgId,
            name
          }
        },

        select: {
          id: true
        }
      })

    if (duplicate) {
      return {
        success: false,

        message:
          "A team with this name already exists.",

        errors: {
          name:
            "Team name already exists"
        }
      }
    }

    /* -----------------------------------------------------
       DEPARTMENT VALIDATION
    ----------------------------------------------------- */

    if (departmentId) {
      const department =
        await prisma.department.findFirst({
          where: {
            id: departmentId,
            orgId,
            active: true
          },

          select: {
            id: true
          }
        })

      if (!department) {
        return {
          success: false,

          message:
            "The selected department is invalid.",

          errors: {
            departmentId:
              "Select a valid active department"
          }
        }
      }
    }

    /* -----------------------------------------------------
       INTERNAL USER VALIDATION
    ----------------------------------------------------- */

    const userValidation =
      await validateInternalUsers({
        orgId,
        leaderId,
        memberIds
      })

    if (userValidation) {
      return userValidation
    }

    /* -----------------------------------------------------
       LEADER SHOULD ALSO BE A MEMBER

       This makes team membership consistent.
    ----------------------------------------------------- */

    const finalMemberIds =
      leaderId
        ? Array.from(
            new Set([
              ...memberIds,
              leaderId
            ])
          )
        : memberIds

    /* -----------------------------------------------------
       TRANSACTION

       1. Create Team
       2. Assign selected User records through teamId
    ----------------------------------------------------- */

    const createdTeam =
      await prisma.$transaction(
        async (tx) => {
          const team =
            await tx.team.create({
              data: {
                orgId,
                name,

                description:
                  description || null,

                departmentId,

                leaderId,

                active: true
              },

              select: {
                id: true
              }
            })

          if (
            finalMemberIds.length > 0
          ) {
            await tx.user.updateMany({
              where: {
                id: {
                  in: finalMemberIds
                },

                orgId,

                employee: {
                  isNot: null
                }
              },

              data: {
                teamId: team.id
              }
            })
          }

          return team
        }
      )

    /* -----------------------------------------------------
       REVALIDATE
    ----------------------------------------------------- */

    revalidatePath(
      "/admin/teams"
    )

    revalidatePath(
      "/admin/employees"
    )

    return {
      success: true,

      message:
        "Team created successfully.",

      teamId:
        createdTeam.id
    }
  } catch (error) {
    console.error(
      "CREATE_TEAM_ERROR:",
      error
    )

    if (
      error instanceof
        Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,

        message:
          "A team with this name already exists.",

        errors: {
          name:
            "Team name already exists"
        }
      }
    }

    if (
      error instanceof Error &&
      error.message === "FORBIDDEN"
    ) {
      return {
        success: false,
        message:
          "You do not have permission to create teams."
      }
    }

    if (
      error instanceof Error &&
      error.message === "UNAUTHORIZED"
    ) {
      return {
        success: false,
        message:
          "Your session has expired. Please sign in again."
      }
    }

    return {
      success: false,

      message:
        "Unable to create team. Please try again."
    }
  }
}

/* =========================================================
   UPDATE TEAM
========================================================= */

export async function updateTeamAction(
  teamId: string,
  formData: FormData
): Promise<TeamActionState> {
  try {
    const {
      orgId
    } = await getTeamAdminContext()

    if (!teamId) {
      return {
        success: false,
        message: "Invalid team ID."
      }
    }

    /* -----------------------------------------------------
       LOAD EXISTING TEAM
    ----------------------------------------------------- */

    const existingTeam =
      await prisma.team.findFirst({
        where: {
          id: teamId,
          orgId
        },

        select: {
          id: true
        }
      })

    if (!existingTeam) {
      return {
        success: false,
        message: "Team not found."
      }
    }

    /* -----------------------------------------------------
       FORM DATA
    ----------------------------------------------------- */

    const name =
      getString(formData, "name")

    const description =
      getString(
        formData,
        "description"
      )

    const departmentIdValue =
      getString(
        formData,
        "departmentId"
      )

    const leaderIdValue =
      getString(
        formData,
        "leaderId"
      )

    const activeValue =
      getString(
        formData,
        "active"
      )

    const departmentId =
      departmentIdValue || null

    const leaderId =
      leaderIdValue || null

    const memberIds =
      getMemberIds(formData)

    const active =
      activeValue === "true" ||
      activeValue === "on" ||
      activeValue === "1"

    /* -----------------------------------------------------
       BASIC VALIDATION
    ----------------------------------------------------- */

    const errors =
      validateTeamFields({
        name,
        description
      })

    if (
      errors &&
      Object.keys(errors).length > 0
    ) {
      return {
        success: false,

        message:
          "Please correct the highlighted fields.",

        errors
      }
    }

    /* -----------------------------------------------------
       DUPLICATE CHECK
    ----------------------------------------------------- */

    const duplicate =
      await prisma.team.findFirst({
        where: {
          orgId,
          name,

          NOT: {
            id: teamId
          }
        },

        select: {
          id: true
        }
      })

    if (duplicate) {
      return {
        success: false,

        message:
          "A team with this name already exists.",

        errors: {
          name:
            "Team name already exists"
        }
      }
    }

    /* -----------------------------------------------------
       DEPARTMENT VALIDATION
    ----------------------------------------------------- */

    if (departmentId) {
      const department =
        await prisma.department.findFirst({
          where: {
            id: departmentId,
            orgId,
            active: true
          },

          select: {
            id: true
          }
        })

      if (!department) {
        return {
          success: false,

          message:
            "The selected department is invalid.",

          errors: {
            departmentId:
              "Select a valid active department"
          }
        }
      }
    }

    /* -----------------------------------------------------
       INTERNAL USER VALIDATION
    ----------------------------------------------------- */

    const userValidation =
      await validateInternalUsers({
        orgId,
        leaderId,
        memberIds
      })

    if (userValidation) {
      return userValidation
    }

    /* -----------------------------------------------------
       LEADER ALSO BECOMES MEMBER
    ----------------------------------------------------- */

    const finalMemberIds =
      leaderId
        ? Array.from(
            new Set([
              ...memberIds,
              leaderId
            ])
          )
        : memberIds

    /* -----------------------------------------------------
       TRANSACTION

       IMPORTANT:

       Team.members is controlled by User.teamId.

       Therefore:

       1. Remove old members from this team.
       2. Update Team.
       3. Assign new selected members.
    ----------------------------------------------------- */

    await prisma.$transaction(
      async (tx) => {
        /* Remove existing members */

        await tx.user.updateMany({
          where: {
            orgId,
            teamId
          },

          data: {
            teamId: null
          }
        })

        /* Update team */

        await tx.team.update({
          where: {
            id: teamId
          },

          data: {
            name,

            description:
              description || null,

            departmentId,

            leaderId,

            active
          }
        })

        /* Assign selected members */

        if (
          finalMemberIds.length > 0
        ) {
          await tx.user.updateMany({
            where: {
              id: {
                in: finalMemberIds
              },

              orgId,

              employee: {
                isNot: null
              }
            },

            data: {
              teamId
            }
          })
        }
      }
    )

    /* -----------------------------------------------------
       REVALIDATE
    ----------------------------------------------------- */

    revalidatePath(
      "/admin/teams"
    )

    revalidatePath(
      `/admin/teams/${teamId}`
    )

    revalidatePath(
      `/admin/teams/${teamId}/edit`
    )

    revalidatePath(
      "/admin/employees"
    )

    return {
      success: true,

      message:
        "Team updated successfully.",

      teamId
    }
  } catch (error) {
    console.error(
      "UPDATE_TEAM_ERROR:",
      error
    )

    if (
      error instanceof
        Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,

        message:
          "A team with this name already exists.",

        errors: {
          name:
            "Team name already exists"
        }
      }
    }

    if (
      error instanceof Error &&
      error.message === "FORBIDDEN"
    ) {
      return {
        success: false,
        message:
          "You do not have permission to update teams."
      }
    }

    return {
      success: false,

      message:
        "Unable to update team. Please try again."
    }
  }
}

/* =========================================================
   DELETE TEAM
========================================================= */

export async function deleteTeamAction(
  teamId: string
): Promise<TeamActionState> {
  try {
    const {
      orgId
    } = await getTeamAdminContext()

    if (!teamId) {
      return {
        success: false,
        message: "Invalid team ID."
      }
    }

    /* -----------------------------------------------------
       LOAD TEAM
    ----------------------------------------------------- */

    const team =
      await prisma.team.findFirst({
        where: {
          id: teamId,
          orgId
        },

        select: {
          id: true,
          name: true,

          _count: {
            select: {
              members: true,
              TeamInvitation: true
            }
          }
        }
      })

    if (!team) {
      return {
        success: false,
        message: "Team not found."
      }
    }

    /* -----------------------------------------------------
       DELETE PROTECTION

       Members can be detached automatically.

       Invitations should be resolved/deleted first because
       they may contain operational invitation history.
    ----------------------------------------------------- */

    if (
      team._count.TeamInvitation > 0
    ) {
      return {
        success: false,

        message:
          `Cannot delete ${team.name}. ` +
          `${team._count.TeamInvitation} team invitation(s) are still linked to it.`
      }
    }

    /* -----------------------------------------------------
       TRANSACTION

       1. Remove User.teamId references.
       2. Delete Team.
    ----------------------------------------------------- */

    await prisma.$transaction(
      async (tx) => {
        await tx.user.updateMany({
          where: {
            orgId,
            teamId
          },

          data: {
            teamId: null
          }
        })

        await tx.team.delete({
          where: {
            id: teamId
          }
        })
      }
    )

    revalidatePath(
      "/admin/teams"
    )

    revalidatePath(
      "/admin/employees"
    )

    return {
      success: true,

      message:
        "Team deleted successfully."
    }
  } catch (error) {
    console.error(
      "DELETE_TEAM_ERROR:",
      error
    )

    if (
      error instanceof
        Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return {
        success: false,

        message:
          "This team is still connected to other records and cannot be deleted."
      }
    }

    if (
      error instanceof Error &&
      error.message === "FORBIDDEN"
    ) {
      return {
        success: false,

        message:
          "You do not have permission to delete teams."
      }
    }

    return {
      success: false,

      message:
        "Unable to delete team. Please try again."
    }
  }
}

/* =========================================================
   TOGGLE TEAM STATUS
========================================================= */

export async function toggleTeamStatusAction(
  teamId: string
): Promise<TeamActionState> {
  try {
    const {
      orgId
    } = await getTeamAdminContext()

    if (!teamId) {
      return {
        success: false,
        message: "Invalid team ID."
      }
    }

    const team =
      await prisma.team.findFirst({
        where: {
          id: teamId,
          orgId
        },

        select: {
          id: true,
          active: true
        }
      })

    if (!team) {
      return {
        success: false,
        message: "Team not found."
      }
    }

    const newStatus =
      !team.active

    await prisma.team.update({
      where: {
        id: teamId
      },

      data: {
        active: newStatus
      }
    })

    revalidatePath(
      "/admin/teams"
    )

    revalidatePath(
      `/admin/teams/${teamId}`
    )

    revalidatePath(
      `/admin/teams/${teamId}/edit`
    )

    return {
      success: true,

      message: newStatus
        ? "Team activated successfully."
        : "Team deactivated successfully.",

      teamId
    }
  } catch (error) {
    console.error(
      "TOGGLE_TEAM_STATUS_ERROR:",
      error
    )

    if (
      error instanceof Error &&
      error.message === "FORBIDDEN"
    ) {
      return {
        success: false,

        message:
          "You do not have permission to change team status."
      }
    }

    return {
      success: false,

      message:
        "Unable to change team status."
    }
  }
}