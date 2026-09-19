"use server"

import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

/* =========================================================
   INTERNAL PLATFORM CONFIGURATION
========================================================= */

/*
 * KoniqTech has a separate internal platform organization.
 *
 * IMPORTANT:
 * Internal platform access uses User.role:
 *
 *   super_admin
 *   user
 *
 * It does NOT use OrganizationRole.
 *
 * OrganizationRole belongs to customer CRM tenants.
 */
const KONIQTECH_PLATFORM_SLUG = "platform"

/*
 * PlatformRole in Prisma currently contains only:
 *
 *   super_admin
 *   user
 */
const PLATFORM_ROLES = new Set([
  "super_admin",
  "user",
])

/*
 * Employee management is currently restricted to
 * KoniqTech Super Admin because PlatformRole contains
 * only super_admin/user.
 *
 * Do NOT use EmployeeRole for platform authorization.
 */
const EMPLOYEE_MANAGEMENT_ROLES = new Set([
  "super_admin",
])

/* =========================================================
   ACTION RESULT
========================================================= */

export type EmployeeActionState = {
  success: boolean
  message: string
  errors?: Record<string, string>
}

/* =========================================================
   FORM INPUT
========================================================= */

type EmployeeInput = {
  employeeCode: string
  firstName: string
  lastName: string
  email: string
  phone: string | null

  /*
   * Platform access role.
   *
   * This maps to User.role.
   *
   * Allowed:
   *   super_admin
   *   user
   */
  platformRole: string

  /*
   * Internal HR/employee role.
   *
   * This maps to Employee.roleId.
   */
  departmentId: string
  roleId: string
  managerId: string | null

  designation: string | null

  joiningDate: Date | null
  dateOfBirth: Date | null

  gender: string | null

  address: string | null
  city: string | null
  state: string | null
  country: string | null
  postalCode: string | null

  emergencyContactName: string | null
  emergencyContactPhone: string | null

  bloodGroup: string | null

  employmentType: string | null
  salaryType: string | null

  bankName: string | null
  accountNumber: string | null
  ifscCode: string | null
  upiId: string | null

  active: boolean

  password: string | null
}

/* =========================================================
   SESSION ROLE
========================================================= */

/**
 * Internal platform authorization MUST use
 * session.user.role.
 *
 * It must NOT use:
 *
 *   organizationRole
 *   EmployeeRole
 */
function getSessionRole(session: {
  user: unknown
}) {
  const user = session.user as {
    role?: unknown
  }

  return String(user.role ?? "")
    .trim()
    .toLowerCase()
}

/* =========================================================
   AUTHORIZATION
========================================================= */

async function requireEmployeeManager() {
  const session = await auth()

  if (!session?.user) {
    throw new Error("UNAUTHENTICATED")
  }

  const role = getSessionRole(session)

  if (!EMPLOYEE_MANAGEMENT_ROLES.has(role)) {
    throw new Error("FORBIDDEN")
  }

  return {
    session,
    role,
  }
}

/* =========================================================
   SUPER ADMIN
========================================================= */

async function requireSuperAdmin() {
  const session = await auth()

  if (!session?.user) {
    throw new Error("UNAUTHENTICATED")
  }

  const role = getSessionRole(session)

  if (role !== "super_admin") {
    throw new Error("FORBIDDEN")
  }

  return session
}

/* =========================================================
   FORM HELPERS
========================================================= */

function getRequiredString(
  formData: FormData,
  key: string
) {
  return String(
    formData.get(key) ?? ""
  ).trim()
}

function getOptionalString(
  formData: FormData,
  key: string
) {
  const value = String(
    formData.get(key) ?? ""
  ).trim()

  return value || null
}

function getOptionalDate(
  formData: FormData,
  key: string
) {
  const value = getOptionalString(
    formData,
    key
  )

  if (!value) {
    return null
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date
}

function getBoolean(
  formData: FormData,
  key: string,
  defaultValue = false
) {
  const value = formData.get(key)

  if (value === null) {
    return defaultValue
  }

  return (
    value === "true" ||
    value === "1" ||
    value === "on"
  )
}

/* =========================================================
   EMAIL NORMALIZATION
========================================================= */

function normalizeEmail(value: string) {
  return value
    .trim()
    .toLowerCase()
}

/* =========================================================
   PLATFORM ROLE NORMALIZATION
========================================================= */

/**
 * EmployeeForm should eventually submit:
 *
 *   userRole="user"
 *
 * or:
 *
 *   userRole="super_admin"
 *
 * For backwards compatibility, this helper also accepts
 * "platformRole".
 */
function getPlatformRole(
  formData: FormData
) {
  const directValue =
    formData.get("platformRole")

  const legacyValue =
    formData.get("userRole")

  const value =
    directValue ??
    legacyValue ??
    ""

  return String(value)
    .trim()
    .toLowerCase()
}

/* =========================================================
   READ EMPLOYEE INPUT
========================================================= */

function readEmployeeInput(
  formData: FormData
): EmployeeInput {
  return {
    employeeCode:
      getRequiredString(
        formData,
        "employeeCode"
      ),

    firstName:
      getRequiredString(
        formData,
        "firstName"
      ),

    lastName:
      getRequiredString(
        formData,
        "lastName"
      ),

    email:
      normalizeEmail(
        getRequiredString(
          formData,
          "email"
        )
      ),

    phone:
      getOptionalString(
        formData,
        "phone"
      ),

    /*
     * Internal platform access.
     *
     * This becomes User.role.
     */
    platformRole:
      getPlatformRole(formData),

    /*
     * Internal department.
     */
    departmentId:
      getRequiredString(
        formData,
        "departmentId"
      ),

    /*
     * EmployeeRole ID.
     */
    roleId:
      getRequiredString(
        formData,
        "roleId"
      ),

    managerId:
      getOptionalString(
        formData,
        "managerId"
      ),

    designation:
      getOptionalString(
        formData,
        "designation"
      ),

    joiningDate:
      getOptionalDate(
        formData,
        "joiningDate"
      ),

    dateOfBirth:
      getOptionalDate(
        formData,
        "dateOfBirth"
      ),

    gender:
      getOptionalString(
        formData,
        "gender"
      ),

    address:
      getOptionalString(
        formData,
        "address"
      ),

    city:
      getOptionalString(
        formData,
        "city"
      ),

    state:
      getOptionalString(
        formData,
        "state"
      ),

    country:
      getOptionalString(
        formData,
        "country"
      ),

    postalCode:
      getOptionalString(
        formData,
        "postalCode"
      ),

    emergencyContactName:
      getOptionalString(
        formData,
        "emergencyContactName"
      ),

    emergencyContactPhone:
      getOptionalString(
        formData,
        "emergencyContactPhone"
      ),

    bloodGroup:
      getOptionalString(
        formData,
        "bloodGroup"
      ),

    employmentType:
      getOptionalString(
        formData,
        "employmentType"
      ),

    salaryType:
      getOptionalString(
        formData,
        "salaryType"
      ),

    bankName:
      getOptionalString(
        formData,
        "bankName"
      ),

    accountNumber:
      getOptionalString(
        formData,
        "accountNumber"
      ),

    ifscCode:
      getOptionalString(
        formData,
        "ifscCode"
      ),

    upiId:
      getOptionalString(
        formData,
        "upiId"
      ),

    active:
      getBoolean(
        formData,
        "active",
        true
      ),

    password:
      getOptionalString(
        formData,
        "password"
      ),
  }
}

/* =========================================================
   VALIDATE INPUT
========================================================= */

function validateEmployeeInput(
  input: EmployeeInput,
  mode: "create" | "update"
): Record<string, string> {
  const errors: Record<
    string,
    string
  > = {}

  if (!input.employeeCode) {
    errors.employeeCode =
      "Employee code is required."
  }

  if (!input.firstName) {
    errors.firstName =
      "First name is required."
  }

  if (!input.lastName) {
    errors.lastName =
      "Last name is required."
  }

  if (!input.email) {
    errors.email =
      "Email address is required."
  }

  if (
    input.email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      input.email
    )
  ) {
    errors.email =
      "Enter a valid email address."
  }

  if (!input.departmentId) {
    errors.departmentId =
      "Department is required."
  }

  if (!input.roleId) {
    errors.roleId =
      "Employee role is required."
  }

  if (!input.platformRole) {
    errors.userRole =
      "Platform access role is required."
  }

  if (
    input.platformRole &&
    !PLATFORM_ROLES.has(
      input.platformRole
    )
  ) {
    errors.userRole =
      "Invalid platform access role."
  }

  if (
    mode === "create" &&
    (!input.password ||
      input.password.length < 8)
  ) {
    errors.password =
      "Password must be at least 8 characters."
  }

  if (
    mode === "update" &&
    input.password &&
    input.password.length < 8
  ) {
    errors.password =
      "Password must be at least 8 characters."
  }

  return errors
}

/* =========================================================
   GET KONIQTECH PLATFORM ORGANIZATION
========================================================= */

async function getKoniqTechOrganization() {
  const organization =
    await prisma.organization.findUnique({
      where: {
        slug:
          KONIQTECH_PLATFORM_SLUG,
      },

      select: {
        id: true,
        name: true,
        slug: true,
        active: true,
      },
    })

  if (!organization) {
    throw new Error(
      "KoniqTech Platform organization was not found."
    )
  }

  if (!organization.active) {
    throw new Error(
      "KoniqTech Platform organization is inactive."
    )
  }

  return organization
}

/* =========================================================
   VALIDATE DEPARTMENT
========================================================= */

/**
 * Department belongs to an organization.
 *
 * Internal employees must always use departments
 * belonging to the KoniqTech Platform organization.
 */
async function validateDepartment(
  departmentId: string,
  organizationId: string
) {
  const department =
    await prisma.department.findUnique({
      where: {
        id: departmentId,
      },

      select: {
        id: true,
        orgId: true,
        name: true,
        active: true,
      },
    })

  if (!department) {
    throw new Error(
      "Selected department does not exist."
    )
  }

  if (
    department.orgId !==
    organizationId
  ) {
    throw new Error(
      "Selected department does not belong to the KoniqTech Platform organization."
    )
  }

  if (!department.active) {
    throw new Error(
      "Selected department is inactive."
    )
  }

  return department
}

/* =========================================================
   VALIDATE EMPLOYEE ROLE
========================================================= */

/**
 * EmployeeRole is intentionally separate from
 * OrganizationRole.
 *
 * EmployeeRole has no orgId in the current Prisma schema,
 * therefore it is validated only by its ID.
 */
async function validateEmployeeRole(
  roleId: string
) {
  const role =
    await prisma.employeeRole.findUnique({
      where: {
        id: roleId,
      },

      select: {
        id: true,
        name: true,
      },
    })

  if (!role) {
    throw new Error(
      "Selected employee role does not exist."
    )
  }

  return role
}

/* =========================================================
   VALIDATE MANAGER
========================================================= */

async function validateManager(
  managerId: string | null,
  currentEmployeeId?: string
) {
  if (!managerId) {
    return null
  }

  if (
    currentEmployeeId &&
    managerId === currentEmployeeId
  ) {
    throw new Error(
      "An employee cannot be their own manager."
    )
  }

  const manager =
    await prisma.employee.findUnique({
      where: {
        id: managerId,
      },

      select: {
        id: true,
        firstName: true,
        lastName: true,
        employeeCode: true,
        active: true,
      },
    })

  if (!manager) {
    throw new Error(
      "Selected manager does not exist."
    )
  }

  if (!manager.active) {
    throw new Error(
      "An inactive employee cannot be assigned as manager."
    )
  }

  return manager
}

/* =========================================================
   VALIDATE INTERNAL REFERENCES
========================================================= */

async function validateReferences(
  departmentId: string,
  roleId: string,
  managerId: string | null,
  organizationId: string,
  currentEmployeeId?: string
) {
  const [
    department,
    employeeRole,
    manager,
  ] = await Promise.all([
    validateDepartment(
      departmentId,
      organizationId
    ),

    validateEmployeeRole(
      roleId
    ),

    validateManager(
      managerId,
      currentEmployeeId
    ),
  ])

  return {
    department,
    employeeRole,
    manager,
  }
}

/* =========================================================
   CREATE EMPLOYEE
========================================================= */

export async function createEmployeeAction(
  formData: FormData
): Promise<EmployeeActionState> {
  try {
    const {
      session,
      role: currentRole,
    } =
      await requireEmployeeManager()

    const input =
      readEmployeeInput(formData)

    const errors =
      validateEmployeeInput(
        input,
        "create"
      )

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

    /* -------------------------------------------------------
       KoniqTech Platform organization
    ------------------------------------------------------- */

    const organization =
      await getKoniqTechOrganization()

    /* -------------------------------------------------------
       Super Admin protection
    ------------------------------------------------------- */

    if (
      input.platformRole ===
        "super_admin" &&
      currentRole !==
        "super_admin"
    ) {
      return {
        success: false,
        message:
          "Only Super Admin can create another Super Admin account.",
        errors: {
          userRole:
            "Only Super Admin can assign the Super Admin platform access role.",
        },
      }
    }

    /* -------------------------------------------------------
       Validate internal references
    ------------------------------------------------------- */

    const {
      department,
      employeeRole,
    } =
      await validateReferences(
        input.departmentId,
        input.roleId,
        input.managerId,
        organization.id
      )

    /* -------------------------------------------------------
       Check unique values
    ------------------------------------------------------- */

    const [
      existingUser,
      existingEmployeeEmail,
      existingEmployeeCode,
    ] = await Promise.all([
      prisma.user.findUnique({
        where: {
          email: input.email,
        },

        select: {
          id: true,
        },
      }),

      prisma.employee.findUnique({
        where: {
          email: input.email,
        },

        select: {
          id: true,
        },
      }),

      prisma.employee.findUnique({
        where: {
          employeeCode:
            input.employeeCode,
        },

        select: {
          id: true,
        },
      }),
    ])

    if (
      existingUser ||
      existingEmployeeEmail
    ) {
      return {
        success: false,
        message:
          "An account with this email address already exists.",

        errors: {
          email:
            "This email address is already in use.",
        },
      }
    }

    if (existingEmployeeCode) {
      return {
        success: false,
        message:
          "Employee code already exists.",

        errors: {
          employeeCode:
            "This employee code is already in use.",
        },
      }
    }

    /* -------------------------------------------------------
       Hash password
    ------------------------------------------------------- */

    const passwordHash =
      await bcrypt.hash(
        input.password!,
        10
      )

    /* -------------------------------------------------------
       USER + EMPLOYEE TRANSACTION
    ------------------------------------------------------- */

    const employee =
      await prisma.$transaction(
        async (tx) => {
          /* -------------------------------------------------
             Create internal platform login
          ------------------------------------------------- */

          const user =
            await tx.user.create({
              data: {
                orgId:
                  organization.id,

                name:
                  `${input.firstName} ${input.lastName}`,

                email:
                  input.email,

                passwordHash,

                phone:
                  input.phone,

                /*
                 * Internal platform role.
                 *
                 * IMPORTANT:
                 * This is User.role.
                 *
                 * organizationRoleId remains NULL.
                 */
                role:
                  input.platformRole ===
                  "super_admin"
                    ? "super_admin"
                    : "user",

                organizationRoleId:
                  null,

                departmentId:
                  department.id,

                status:
                  input.active
                    ? "active"
                    : "inactive",

                emailVerified:
                  false,

                phoneVerified:
                  false,
              },
            })

          /* -------------------------------------------------
             Create employee profile
          ------------------------------------------------- */

          return tx.employee.create({
            data: {
              userId:
                user.id,

              employeeCode:
                input.employeeCode,

              firstName:
                input.firstName,

              lastName:
                input.lastName,

              email:
                input.email,

              phone:
                input.phone,

              departmentId:
                department.id,

              roleId:
                employeeRole.id,

              managerId:
                input.managerId,

              designation:
                input.designation,

              joiningDate:
                input.joiningDate,

              dateOfBirth:
                input.dateOfBirth,

              gender:
                input.gender,

              address:
                input.address,

              city:
                input.city,

              state:
                input.state,

              country:
                input.country,

              postalCode:
                input.postalCode,

              emergencyContactName:
                input.emergencyContactName,

              emergencyContactPhone:
                input.emergencyContactPhone,

              bloodGroup:
                input.bloodGroup,

              employmentType:
                input.employmentType,

              salaryType:
                input.salaryType,

              bankName:
                input.bankName,

              accountNumber:
                input.accountNumber,

              ifscCode:
                input.ifscCode,

              upiId:
                input.upiId,

              active:
                input.active,
            },
          })
        }
      )

    /* -------------------------------------------------------
       Record employee activity
    ------------------------------------------------------- */

    if (session.user.email) {
      const actorEmployee =
        await prisma.employee.findUnique({
          where: {
            email:
              session.user.email
                .trim()
                .toLowerCase(),
          },

          select: {
            id: true,
          },
        })

      if (actorEmployee) {
        await prisma.employeeActivity.create({
          data: {
            employeeId:
              actorEmployee.id,

            action:
              "employee_created",

            entity:
              "Employee",

            entityId:
              employee.id,
          },
        })
      }
    }

    /* -------------------------------------------------------
       Revalidate
    ------------------------------------------------------- */

    revalidateEmployeePaths(
      employee.id
    )

    return {
      success: true,
      message:
        "Employee and login account created successfully.",
    }
  } catch (error) {
    console.error(
      "CREATE_EMPLOYEE_ERROR:",
      error
    )

    return {
      success: false,
      message:
        getActionErrorMessage(error),
    }
  }
}

/* =========================================================
   UPDATE EMPLOYEE
========================================================= */

export async function updateEmployeeAction(
  employeeId: string,
  formData: FormData
): Promise<EmployeeActionState> {
  try {
    const {
      role: currentRole,
    } =
      await requireEmployeeManager()

    const input =
      readEmployeeInput(formData)

    const errors =
      validateEmployeeInput(
        input,
        "update"
      )

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

    /* -------------------------------------------------------
       Get KoniqTech Platform organization
    ------------------------------------------------------- */

    const organization =
      await getKoniqTechOrganization()

    /* -------------------------------------------------------
       Load employee
    ------------------------------------------------------- */

    const existingEmployee =
      await prisma.employee.findUnique({
        where: {
          id: employeeId,
        },

        include: {
          user: {
            select: {
              id: true,
              orgId: true,
              role: true,
              organizationRoleId: true,
              email: true,
            },
          },
        },
      })

    if (!existingEmployee) {
      return {
        success: false,
        message:
          "Employee was not found.",
      }
    }

    /* -------------------------------------------------------
       Validate existing user organization
    ------------------------------------------------------- */

    if (
      existingEmployee.user &&
      existingEmployee.user.orgId !==
        organization.id
    ) {
      return {
        success: false,
        message:
          "This employee does not belong to the KoniqTech Platform organization.",
      }
    }

    /* -------------------------------------------------------
       Protect existing Super Admin
    ------------------------------------------------------- */

    const existingRole =
      String(
        existingEmployee.user
          ?.role ?? ""
      )
        .trim()
        .toLowerCase()

    if (
      existingRole ===
        "super_admin" &&
      currentRole !==
        "super_admin"
    ) {
      return {
        success: false,
        message:
          "Only Super Admin can modify a Super Admin employee.",
      }
    }

    /* -------------------------------------------------------
       Protect assignment of Super Admin
    ------------------------------------------------------- */

    if (
      input.platformRole ===
        "super_admin" &&
      currentRole !==
        "super_admin"
    ) {
      return {
        success: false,
        message:
          "Only Super Admin can assign the Super Admin platform access role.",

        errors: {
          userRole:
            "Only Super Admin can assign the Super Admin platform access role.",
        },
      }
    }

    /* -------------------------------------------------------
       Validate internal references
    ------------------------------------------------------- */

    const {
      department,
      employeeRole,
    } =
      await validateReferences(
        input.departmentId,
        input.roleId,
        input.managerId,
        organization.id,
        employeeId
      )

    /* -------------------------------------------------------
       Unique email/code validation
    ------------------------------------------------------- */

    const [
      emailUser,
      emailEmployee,
      codeEmployee,
    ] = await Promise.all([
      prisma.user.findUnique({
        where: {
          email: input.email,
        },

        select: {
          id: true,
        },
      }),

      prisma.employee.findUnique({
        where: {
          email: input.email,
        },

        select: {
          id: true,
        },
      }),

      prisma.employee.findUnique({
        where: {
          employeeCode:
            input.employeeCode,
        },

        select: {
          id: true,
        },
      }),
    ])

    if (
      emailUser &&
      emailUser.id !==
        existingEmployee.userId
    ) {
      return {
        success: false,
        message:
          "Another login account already uses this email address.",

        errors: {
          email:
            "This email address is already in use.",
        },
      }
    }

    if (
      emailEmployee &&
      emailEmployee.id !==
        employeeId
    ) {
      return {
        success: false,
        message:
          "Another employee already uses this email address.",

        errors: {
          email:
            "This email address is already in use.",
        },
      }
    }

    if (
      codeEmployee &&
      codeEmployee.id !==
        employeeId
    ) {
      return {
        success: false,
        message:
          "Another employee already uses this employee code.",

        errors: {
          employeeCode:
            "This employee code is already in use.",
        },
      }
    }

    /* -------------------------------------------------------
       UPDATE TRANSACTION
    ------------------------------------------------------- */

    await prisma.$transaction(
      async (tx) => {
        let userId =
          existingEmployee.userId

        /* ---------------------------------------------------
           Repair legacy Employee without User
        --------------------------------------------------- */

        if (!userId) {
          if (!input.password) {
            throw new Error(
              "A password is required because this employee does not yet have a login account."
            )
          }

          const passwordHash =
            await bcrypt.hash(
              input.password,
              10
            )

          const newUser =
            await tx.user.create({
              data: {
                orgId:
                  organization.id,

                name:
                  `${input.firstName} ${input.lastName}`,

                email:
                  input.email,

                passwordHash,

                phone:
                  input.phone,

                role:
                  input.platformRole ===
                  "super_admin"
                    ? "super_admin"
                    : "user",

                /*
                 * Internal employee accounts
                 * must not use customer
                 * OrganizationRole.
                 */
                organizationRoleId:
                  null,

                departmentId:
                  department.id,

                status:
                  input.active
                    ? "active"
                    : "inactive",

                emailVerified:
                  false,

                phoneVerified:
                  false,
              },
            })

          userId =
            newUser.id
        } else {
          /* -------------------------------------------------
             Update existing login account
          ------------------------------------------------- */

          await tx.user.update({
            where: {
              id: userId,
            },

            data: {
              name:
                `${input.firstName} ${input.lastName}`,

              email:
                input.email,

              phone:
                input.phone,

              role:
                input.platformRole ===
                "super_admin"
                  ? "super_admin"
                  : "user",

              /*
               * Explicitly remove any legacy
               * customer OrganizationRole assignment.
               */
              organizationRoleId:
                null,

              departmentId:
                department.id,

              status:
                input.active
                  ? "active"
                  : "inactive",

              ...(input.password
                ? {
                    passwordHash:
                      await bcrypt.hash(
                        input.password,
                        10
                      ),
                  }
                : {}),
            },
          })
        }

        /* ---------------------------------------------------
           Update employee profile
        --------------------------------------------------- */

        await tx.employee.update({
          where: {
            id: employeeId,
          },

          data: {
            userId,

            employeeCode:
              input.employeeCode,

            firstName:
              input.firstName,

            lastName:
              input.lastName,

            email:
              input.email,

            phone:
              input.phone,

            departmentId:
              department.id,

            roleId:
              employeeRole.id,

            managerId:
              input.managerId,

            designation:
              input.designation,

            joiningDate:
              input.joiningDate,

            dateOfBirth:
              input.dateOfBirth,

            gender:
              input.gender,

            address:
              input.address,

            city:
              input.city,

            state:
              input.state,

            country:
              input.country,

            postalCode:
              input.postalCode,

            emergencyContactName:
              input.emergencyContactName,

            emergencyContactPhone:
              input.emergencyContactPhone,

            bloodGroup:
              input.bloodGroup,

            employmentType:
              input.employmentType,

            salaryType:
              input.salaryType,

            bankName:
              input.bankName,

            accountNumber:
              input.accountNumber,

            ifscCode:
              input.ifscCode,

            upiId:
              input.upiId,

            active:
              input.active,
          },
        })
      }
    )

    /* -------------------------------------------------------
       Revalidate
    ------------------------------------------------------- */

    revalidateEmployeePaths(
      employeeId
    )

    return {
      success: true,
      message:
        "Employee and login account updated successfully.",
    }
  } catch (error) {
    console.error(
      "UPDATE_EMPLOYEE_ERROR:",
      error
    )

    return {
      success: false,
      message:
        getActionErrorMessage(error),
    }
  }
}

/* =========================================================
   DELETE EMPLOYEE
========================================================= */

export async function deleteEmployeeAction(
  employeeId: string
): Promise<EmployeeActionState> {
  try {
    const session =
      await requireSuperAdmin()

    const organization =
      await getKoniqTechOrganization()

    const employee =
      await prisma.employee.findUnique({
        where: {
          id: employeeId,
        },

        select: {
          id: true,
          userId: true,
          email: true,

          user: {
            select: {
              id: true,
              orgId: true,
              role: true,
            },
          },

          _count: {
            select: {
              subordinates: true,
              tasks: true,
              attendances: true,
              leaves: true,
              documents: true,
            },
          },
        },
      })

    if (!employee) {
      return {
        success: false,
        message:
          "Employee was not found.",
      }
    }

    /* -------------------------------------------------------
       Verify organization
    ------------------------------------------------------- */

    if (
      employee.user &&
      employee.user.orgId !==
        organization.id
    ) {
      return {
        success: false,
        message:
          "This employee does not belong to the KoniqTech Platform organization.",
      }
    }

    /* -------------------------------------------------------
       Prevent self deletion
    ------------------------------------------------------- */

    if (
      session.user.email &&
      employee.email
        .trim()
        .toLowerCase() ===
        session.user.email
          .trim()
          .toLowerCase()
    ) {
      return {
        success: false,
        message:
          "You cannot delete your own employee account.",
      }
    }

    /* -------------------------------------------------------
       Prevent deleting Super Admin
    ------------------------------------------------------- */

    const employeeRoleName =
      String(
        employee.user?.role ??
          ""
      )
        .trim()
        .toLowerCase()

    if (
      employeeRoleName ===
      "super_admin"
    ) {
      return {
        success: false,
        message:
          "Super Admin employee accounts cannot be deleted.",
      }
    }

    /* -------------------------------------------------------
       Prevent deleting manager with subordinates
    ------------------------------------------------------- */

    if (
      employee._count
        .subordinates > 0
    ) {
      return {
        success: false,
        message:
          "Reassign this employee's subordinates before deleting the employee.",
      }
    }

    /* -------------------------------------------------------
       DELETE EMPLOYEE + USER
    ------------------------------------------------------- */

    await prisma.$transaction(
      async (tx) => {
        await tx.employee.delete({
          where: {
            id: employeeId,
          },
        })

        /*
         * Employee.userId is optional and uses
         * onDelete: SetNull.
         *
         * We explicitly delete the login account
         * because this action is deleting the
         * complete internal employee account.
         */
        if (employee.userId) {
          await tx.user.delete({
            where: {
              id: employee.userId,
            },
          })
        }
      }
    )

    revalidatePath(
      "/admin/employees"
    )

    return {
      success: true,
      message:
        "Employee and login account deleted successfully.",
    }
  } catch (error) {
    console.error(
      "DELETE_EMPLOYEE_ERROR:",
      error
    )

    return {
      success: false,
      message:
        getActionErrorMessage(error),
    }
  }
}

/* =========================================================
   TOGGLE EMPLOYEE STATUS
========================================================= */

export async function toggleEmployeeStatusAction(
  employeeId: string
): Promise<EmployeeActionState> {
  try {
    await requireEmployeeManager()

    const organization =
      await getKoniqTechOrganization()

    const employee =
      await prisma.employee.findUnique({
        where: {
          id: employeeId,
        },

        select: {
          id: true,
          active: true,
          userId: true,
          email: true,

          user: {
            select: {
              id: true,
              orgId: true,
              role: true,
            },
          },
        },
      })

    if (!employee) {
      return {
        success: false,
        message:
          "Employee was not found.",
      }
    }

    /* -------------------------------------------------------
       Organization isolation
    ------------------------------------------------------- */

    if (
      employee.user &&
      employee.user.orgId !==
        organization.id
    ) {
      return {
        success: false,
        message:
          "This employee does not belong to the KoniqTech Platform organization.",
      }
    }

    /* -------------------------------------------------------
       Prevent changing Super Admin status
    ------------------------------------------------------- */

    const employeeRoleName =
      String(
        employee.user?.role ??
          ""
      )
        .trim()
        .toLowerCase()

    if (
      employeeRoleName ===
      "super_admin"
    ) {
      return {
        success: false,
        message:
          "Super Admin employee accounts cannot be activated or deactivated.",
      }
    }

    const newStatus =
      !employee.active

    /* -------------------------------------------------------
       Update Employee + User together
    ------------------------------------------------------- */

    await prisma.$transaction(
      async (tx) => {
        await tx.employee.update({
          where: {
            id: employeeId,
          },

          data: {
            active:
              newStatus,
          },
        })

        if (employee.userId) {
          await tx.user.update({
            where: {
              id: employee.userId,
            },

            data: {
              status:
                newStatus
                  ? "active"
                  : "inactive",
            },
          })
        }
      }
    )

    revalidateEmployeePaths(
      employeeId
    )

    return {
      success: true,
      message: newStatus
        ? "Employee activated successfully."
        : "Employee deactivated successfully.",
    }
  } catch (error) {
    console.error(
      "TOGGLE_EMPLOYEE_STATUS_ERROR:",
      error
    )

    return {
      success: false,
      message:
        getActionErrorMessage(error),
    }
  }
}

/* =========================================================
   REVALIDATE EMPLOYEE PATHS
========================================================= */

function revalidateEmployeePaths(
  employeeId: string
) {
  revalidatePath(
    "/admin/employees"
  )

  revalidatePath(
    `/admin/employees/${employeeId}`
  )

  revalidatePath(
    `/admin/employees/${employeeId}/edit`
  )

  revalidatePath(
    `/admin/employees/${employeeId}/attendance`
  )

  revalidatePath(
    `/admin/employees/${employeeId}/leave`
  )

  revalidatePath(
    `/admin/employees/${employeeId}/tasks`
  )

  revalidatePath(
    `/admin/employees/${employeeId}/payroll`
  )

  revalidatePath(
    `/admin/employees/${employeeId}/documents`
  )

  revalidatePath(
    `/admin/employees/${employeeId}/activity`
  )
}

/* =========================================================
   ERROR MESSAGE
========================================================= */

function getActionErrorMessage(
  error: unknown
) {
  if (error instanceof Error) {
    if (
      error.message ===
      "UNAUTHENTICATED"
    ) {
      return "You must be logged in to perform this action."
    }

    if (
      error.message ===
      "FORBIDDEN"
    ) {
      return "You do not have permission to perform this action."
    }

    if (
      error.message.includes(
        "Unique constraint"
      )
    ) {
      return "A record with the same unique value already exists."
    }

    if (
      error.message.includes(
        "Foreign key constraint"
      )
    ) {
      return "This record cannot be changed because it is referenced by another record."
    }

    if (
      error.message.includes(
        "Record to delete does not exist"
      )
    ) {
      return "The employee or login account no longer exists."
    }

    return error.message
  }

  return "An unexpected error occurred."
}