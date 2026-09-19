"use server"

import bcrypt from "bcryptjs"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

import { revalidatePath } from "next/cache"

/* =========================================================
   INTERNAL PLATFORM ROLES
========================================================= */

const INTERNAL_PLATFORM_ROLES = new Set([
  "super_admin",
  "platform_manager",
  "platform_sales",
  "support",
  "finance",
  "developer",
  "qa",
  "customer_success",
  "marketing",
  "data_entry",
])

const EMPLOYEE_MANAGEMENT_ROLES = new Set([
  "super_admin",
  "platform_manager",
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
   FORM DATA TYPE
========================================================= */

type EmployeeInput = {
  employeeCode: string
  firstName: string
  lastName: string
  email: string
  phone: string | null

  organizationRoleId: string

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
 * Internal platform authorization must use session.user.role.
 *
 * employeeRole is the HR/employee role and is intentionally
 * not used for platform-level authorization.
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
   AUTHORIZATION HELPERS
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
   NORMALIZE EMAIL
========================================================= */

function normalizeEmail(value: string) {
  return value
    .trim()
    .toLowerCase()
}

/* =========================================================
   READ EMPLOYEE INPUT
========================================================= */

function readEmployeeInput(
  formData: FormData
): EmployeeInput {
  const roleValue = getRequiredString(
    formData,
    "userRole"
  )

  return {
    employeeCode: getRequiredString(
      formData,
      "employeeCode"
    ),

    firstName: getRequiredString(
      formData,
      "firstName"
    ),

    lastName: getRequiredString(
      formData,
      "lastName"
    ),

    email: normalizeEmail(
      getRequiredString(
        formData,
        "email"
      )
    ),

    phone: getOptionalString(
      formData,
      "phone"
    ),

    /*
     * Platform role comes from the EmployeeForm
     * as the OrganizationRole name, for example:
     *
     * super_admin
     * platform_manager
     * platform_sales
     * data_entry
     *
     * The server resolves this name to the
     * actual OrganizationRole database ID.
     */
    organizationRoleId: roleValue,

    departmentId: getRequiredString(
      formData,
      "departmentId"
    ),

    /*
     * This is EmployeeRole ID.
     */
    roleId: getRequiredString(
      formData,
      "roleId"
    ),

    managerId: getOptionalString(
      formData,
      "managerId"
    ),

    designation: getOptionalString(
      formData,
      "designation"
    ),

    joiningDate: getOptionalDate(
      formData,
      "joiningDate"
    ),

    dateOfBirth: getOptionalDate(
      formData,
      "dateOfBirth"
    ),

    gender: getOptionalString(
      formData,
      "gender"
    ),

    address: getOptionalString(
      formData,
      "address"
    ),

    city: getOptionalString(
      formData,
      "city"
    ),

    state: getOptionalString(
      formData,
      "state"
    ),

    country: getOptionalString(
      formData,
      "country"
    ),

    postalCode: getOptionalString(
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

    bloodGroup: getOptionalString(
      formData,
      "bloodGroup"
    ),

    employmentType:
      getOptionalString(
        formData,
        "employmentType"
      ),

    salaryType: getOptionalString(
      formData,
      "salaryType"
    ),

    bankName: getOptionalString(
      formData,
      "bankName"
    ),

    accountNumber: getOptionalString(
      formData,
      "accountNumber"
    ),

    ifscCode: getOptionalString(
      formData,
      "ifscCode"
    ),

    upiId: getOptionalString(
      formData,
      "upiId"
    ),

    active: getBoolean(
      formData,
      "active",
      true
    ),

    password: getOptionalString(
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
  const errors: Record<string, string> = {}

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

  /*
   * Do NOT validate organizationRoleId
   * against INTERNAL_PLATFORM_ROLES here.
   *
   * organizationRoleId is a database ID.
   * The actual OrganizationRole is validated
   * against the database later.
   */

  if (
    !input.organizationRoleId
  ) {
    errors.userRole =
      "Platform role is required."
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
   VERIFY INTERNAL REFERENCES
========================================================= */

async function validateReferences(
  departmentId: string,
  roleId: string,
  managerId: string | null,
  currentEmployeeId?: string
) {
  const [
    department,
    employeeRole,
    manager,
  ] = await Promise.all([
    prisma.department.findUnique({
      where: {
        id: departmentId,
      },

      select: {
        id: true,
        orgId: true,
      },
    }),

    prisma.employeeRole.findUnique({
      where: {
        id: roleId,
      },

      select: {
        id: true,
      },
    }),

    managerId
      ? prisma.employee.findUnique({
          where: {
            id: managerId,
          },

          select: {
            id: true,
            active: true,
          },
        })
      : Promise.resolve(null),
  ])

  if (!department) {
    throw new Error(
      "Selected department does not exist."
    )
  }

  if (!employeeRole) {
    throw new Error(
      "Selected employee role does not exist."
    )
  }

  if (managerId && !manager) {
    throw new Error(
      "Selected manager does not exist."
    )
  }

  if (
    managerId &&
    currentEmployeeId &&
    managerId === currentEmployeeId
  ) {
    throw new Error(
      "An employee cannot be their own manager."
    )
  }

  if (
    managerId &&
    manager &&
    !manager.active
  ) {
    throw new Error(
      "An inactive employee cannot be assigned as manager."
    )
  }

  return {
    department,
    employeeRole,
    manager,
  }
}

/* =========================================================
   VALIDATE ORGANIZATION ROLE
========================================================= */

async function validateOrganizationRole(
  organizationRoleValue: string,
  organizationId: string
) {
  const value = String(
    organizationRoleValue ?? ""
  )
    .trim()

  if (!value) {
    throw new Error(
      "Platform role is required."
    )
  }

  /*
   * ---------------------------------------------------------
   * First try the value as an OrganizationRole ID.
   *
   * This supports forms that submit:
   *
   *   <option value={role.id}>
   *
   * ---------------------------------------------------------
   */

  let selectedRole =
    await prisma.organizationRole.findUnique({
      where: {
        id: value,
      },

      select: {
        id: true,
        name: true,
        orgId: true,
      },
    })

  /*
   * ---------------------------------------------------------
   * If no role was found by ID, try it as a role name.
   *
   * This supports forms that submit:
   *
   *   <option value="super_admin">
   *
   * ---------------------------------------------------------
   */

  if (!selectedRole) {
    const normalizedName =
      value.toLowerCase()

    if (
      !INTERNAL_PLATFORM_ROLES.has(
        normalizedName
      )
    ) {
      throw new Error(
        "Selected platform role is invalid."
      )
    }

    selectedRole =
      await prisma.organizationRole.findUnique({
        where: {
          orgId_name: {
            orgId: organizationId,
            name: normalizedName,
          },
        },

        select: {
          id: true,
          name: true,
          orgId: true,
        },
      })
  }

  /*
   * ---------------------------------------------------------
   * Role must exist.
   * ---------------------------------------------------------
   */

  if (!selectedRole) {
    throw new Error(
      "Selected platform role does not exist for the KoniqTech organization."
    )
  }

  /*
   * ---------------------------------------------------------
   * Tenant / organization isolation.
   *
   * Never allow a role belonging to another organization.
   * ---------------------------------------------------------
   */

  if (
    selectedRole.orgId !==
    organizationId
  ) {
    throw new Error(
      "Selected platform role does not belong to the KoniqTech organization."
    )
  }

  /*
   * ---------------------------------------------------------
   * Normalize and validate the actual role name.
   * ---------------------------------------------------------
   */

  const roleName = String(
    selectedRole.name ?? ""
  )
    .trim()
    .toLowerCase()

  if (
    !INTERNAL_PLATFORM_ROLES.has(
      roleName
    )
  ) {
    throw new Error(
      "Selected platform role is invalid."
    )
  }

  return {
    id: selectedRole.id,
    name: roleName,
    orgId: selectedRole.orgId,
  }
}

/* =========================================================
   GET CURRENT PLATFORM ORGANIZATION
========================================================= */

async function getCurrentOrganization(
  session: {
    user: unknown
  }
) {
  const user = session.user as {
    orgId?: unknown
  }

  const organizationId = String(
    user.orgId ?? ""
  ).trim()

  if (!organizationId) {
    throw new Error(
      "Your administrator account is not linked to an organization."
    )
  }

  const organization =
    await prisma.organization.findUnique({
      where: {
        id: organizationId,
      },

      select: {
        id: true,
        slug: true,
        name: true,
      },
    })

  if (!organization) {
    throw new Error(
      "The organization linked to your administrator account was not found."
    )
  }

  return organization
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
    } = await requireEmployeeManager()

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

    /* ---------------------------------------------------------
       Get KoniqTech organization
    --------------------------------------------------------- */

    const koniqTechOrganization =
      await getKoniqTechOrganization()

    /* ---------------------------------------------------------
       Validate selected platform role
    --------------------------------------------------------- */

    const selectedRole =
      await validateOrganizationRole(
        input.organizationRoleId,
        koniqTechOrganization.id
      )

    /*
     * Only Super Admin can create another
     * Super Admin account.
     */
    if (
      selectedRole.name ===
        "super_admin" &&
      currentRole !== "super_admin"
    ) {
      return {
        success: false,
        message:
          "Only Super Admin can create another Super Admin account.",
        errors: {
          userRole:
            "Only Super Admin can assign the Super Admin role.",
        },
      }
    }

    /* ---------------------------------------------------------
       Validate internal references
    --------------------------------------------------------- */

    const {
      department,
    } = await validateReferences(
      input.departmentId,
      input.roleId,
      input.managerId
    )

    /*
     * The selected department must belong
     * to the internal KoniqTech organization.
     */
    if (
      department.orgId !==
      koniqTechOrganization.id
    ) {
      return {
        success: false,
        message:
          "Selected department does not belong to the KoniqTech organization.",
      }
    }

    /* ---------------------------------------------------------
       Check unique values
    --------------------------------------------------------- */

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

    /* ---------------------------------------------------------
       Hash password
    --------------------------------------------------------- */

    const passwordHash =
      await bcrypt.hash(
        input.password!,
        10
      )

    /* ---------------------------------------------------------
       USER + EMPLOYEE TRANSACTION
    --------------------------------------------------------- */

    const employee =
      await prisma.$transaction(
        async (tx) => {
          /*
           * Create login account first.
           */
          const user =
            await tx.user.create({
              data: {
                orgId:
                  koniqTechOrganization.id,

                name:
                  `${input.firstName} ${input.lastName}`,

                email:
                  input.email,

                passwordHash,

                phone:
                  input.phone,

                departmentId:
                  input.departmentId,

                organizationRoleId:
                  selectedRole.id,

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

          /*
           * Create employee profile.
           */
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
                input.departmentId,

              roleId:
                input.roleId,

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

    /* ---------------------------------------------------------
       Record employee activity
    --------------------------------------------------------- */

    if (session.user.email) {
      const actorEmployee =
        await prisma.employee.findUnique({
          where: {
            email:
              session.user.email
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

    /* ---------------------------------------------------------
       Revalidate
    --------------------------------------------------------- */

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
    } = await requireEmployeeManager()

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

    /* ---------------------------------------------------------
       Load employee
    --------------------------------------------------------- */

    const existingEmployee =
      await prisma.employee.findUnique({
        where: {
          id: employeeId,
        },

        include: {
          user: {
            include: {
              organizationRole: true,
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

    /* ---------------------------------------------------------
       Protect existing Super Admin
    --------------------------------------------------------- */

    const existingRoleName =
      String(
        existingEmployee.user
          ?.organizationRole
          ?.name ?? ""
      )
        .trim()
        .toLowerCase()

    if (
      existingRoleName ===
        "super_admin" &&
      currentRole !== "super_admin"
    ) {
      return {
        success: false,
        message:
          "Only Super Admin can modify a Super Admin employee.",
      }
    }

    /* ---------------------------------------------------------
       Get KoniqTech organization
    --------------------------------------------------------- */

    const koniqTechOrganization =
      await getKoniqTechOrganization()

    /* ---------------------------------------------------------
       Validate selected platform role
    --------------------------------------------------------- */

    const selectedRole =
      await validateOrganizationRole(
        input.organizationRoleId,
        koniqTechOrganization.id
      )

    if (
      selectedRole.name ===
        "super_admin" &&
      currentRole !== "super_admin"
    ) {
      return {
        success: false,
        message:
          "Only Super Admin can assign the Super Admin role.",
        errors: {
          userRole:
            "Only Super Admin can assign the Super Admin role.",
        },
      }
    }

    /* ---------------------------------------------------------
       Validate internal references
    --------------------------------------------------------- */

    const {
      department,
    } = await validateReferences(
      input.departmentId,
      input.roleId,
      input.managerId,
      employeeId
    )

    if (
      department.orgId !==
      koniqTechOrganization.id
    ) {
      return {
        success: false,
        message:
          "Selected department does not belong to the KoniqTech organization.",
      }
    }

    /* ---------------------------------------------------------
       Unique email/code validation
    --------------------------------------------------------- */

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

    /* ---------------------------------------------------------
       UPDATE TRANSACTION
    --------------------------------------------------------- */

    await prisma.$transaction(
      async (tx) => {
        let userId =
          existingEmployee.userId

        /*
         * Repair legacy Employee without User.
         */
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
                  koniqTechOrganization.id,

                name:
                  `${input.firstName} ${input.lastName}`,

                email:
                  input.email,

                passwordHash,

                organizationRoleId:
                  selectedRole.id,

                phone:
                  input.phone,

                departmentId:
                  input.departmentId,

                status:
                  input.active
                    ? "active"
                    : "inactive",
              },
            })

          userId = newUser.id
        } else {
          /*
           * Update existing login account.
           */

          const userUpdateData = {
            name:
              `${input.firstName} ${input.lastName}`,

            email:
              input.email,

            phone:
              input.phone,

            organizationRoleId:
              selectedRole.id,

            departmentId:
              input.departmentId,

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
          }

          await tx.user.update({
            where: {
              id: userId,
            },

            data:
              userUpdateData,
          })
        }

        /*
         * Update employee profile.
         */

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
              input.departmentId,

            roleId:
              input.roleId,

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

    /* ---------------------------------------------------------
       Revalidate
    --------------------------------------------------------- */

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

              organizationRole: {
                select: {
                  name: true,
                },
              },
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

    /* ---------------------------------------------------------
       Prevent self deletion
    --------------------------------------------------------- */

    if (
      session.user.email &&
      employee.email.toLowerCase() ===
        session.user.email
          .toLowerCase()
    ) {
      return {
        success: false,
        message:
          "You cannot delete your own employee account.",
      }
    }

    /* ---------------------------------------------------------
       Prevent deleting Super Admin
    --------------------------------------------------------- */

    const employeeRoleName =
      String(
        employee.user
          ?.organizationRole
          ?.name ?? ""
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

    /* ---------------------------------------------------------
       Prevent deleting manager with subordinates
    --------------------------------------------------------- */

    if (
      employee._count.subordinates >
      0
    ) {
      return {
        success: false,
        message:
          "Reassign this employee's subordinates before deleting the employee.",
      }
    }

    /* ---------------------------------------------------------
       DELETE EMPLOYEE + USER
    --------------------------------------------------------- */

    await prisma.$transaction(
      async (tx) => {
        await tx.employee.delete({
          where: {
            id: employeeId,
          },
        })

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

              organizationRole: {
                select: {
                  name: true,
                },
              },
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

    /* ---------------------------------------------------------
       Prevent changing Super Admin status
    --------------------------------------------------------- */

    const employeeRoleName =
      String(
        employee.user
          ?.organizationRole
          ?.name ?? ""
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

    /* ---------------------------------------------------------
       Update Employee + User together
    --------------------------------------------------------- */

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
  if (
    error instanceof Error
  ) {
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

    return error.message
  }

  return "An unexpected error occurred."
}