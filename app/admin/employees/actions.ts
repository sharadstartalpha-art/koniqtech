"use server"

import bcrypt from "bcryptjs"
import { UserRole } from "@prisma/client"

import { auth } from "@/auth"
import prisma from "@/shared/lib/prisma"

import {
  revalidatePath
} from "next/cache"

import {
  redirect
} from "next/navigation"

/* =========================================================
   INTERNAL PLATFORM ROLES
========================================================= */

const INTERNAL_PLATFORM_ROLES = new Set<UserRole>([
  UserRole.super_admin,
  UserRole.platform_manager,
  UserRole.platform_sales,
  UserRole.support,
  UserRole.finance,
  UserRole.developer,
  UserRole.qa,
  UserRole.customer_success,
  UserRole.marketing,
  UserRole.data_entry,
])

const EMPLOYEE_MANAGEMENT_ROLES = new Set<UserRole>([
  UserRole.super_admin,
  UserRole.platform_manager,
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

  userRole: UserRole

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
   AUTHORIZATION HELPERS
========================================================= */

async function requireEmployeeManager() {
  const session = await auth()

  if (!session?.user) {
    throw new Error("UNAUTHENTICATED")
  }

  const role = session.user.role as UserRole

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

  const role = session.user.role as UserRole

  if (role !== UserRole.super_admin) {
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

    userRole: roleValue as UserRole,

    departmentId: getRequiredString(
      formData,
      "departmentId"
    ),

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

  if (
    !INTERNAL_PLATFORM_ROLES.has(
      input.userRole
    )
  ) {
    errors.userRole =
      "Select a valid internal platform role."
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
    } = await requireEmployeeManager()

    const input =
      readEmployeeInput(formData)

    const errors =
      validateEmployeeInput(
        input,
        "create"
      )

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message:
          "Please correct the highlighted fields.",
        errors,
      }
    }

    /*
    ---------------------------------------------------------
    Only Super Admin can create another Super Admin.
    ---------------------------------------------------------
    */

    if (
      input.userRole ===
        UserRole.super_admin &&
      currentRole !==
        UserRole.super_admin
    ) {
      return {
        success: false,
        message:
          "Only Super Admin can create another Super Admin account.",
      }
    }

    const {
      department,
    } = await validateReferences(
      input.departmentId,
      input.roleId,
      input.managerId
    )

    /*
    ---------------------------------------------------------
    Ensure department belongs to KoniqTech organization
    ---------------------------------------------------------
    */

    const koniqTechOrganization =
      await prisma.organization.findUnique({
        where: {
          slug: "koniqtech",
        },

        select: {
          id: true,
        },
      })

    if (!koniqTechOrganization) {
      return {
        success: false,
        message:
          "KoniqTech organization was not found.",
      }
    }

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

    /*
    ---------------------------------------------------------
    Check unique values
    ---------------------------------------------------------
    */

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

    const passwordHash =
      await bcrypt.hash(
        input.password!,
        10
      )

    /*
    ---------------------------------------------------------
    USER + EMPLOYEE TRANSACTION
    ---------------------------------------------------------
    */

    const employee =
      await prisma.$transaction(
        async (tx) => {
          const user =
            await tx.user.create({
              data: {
                orgId:
                  koniqTechOrganization.id,

                name:
                  `${input.firstName} ${input.lastName}`,

                email: input.email,

                passwordHash,

                role: input.userRole,

                phone: input.phone,

                departmentId:
                  input.departmentId,

                status: input.active
                  ? "active"
                  : "inactive",

                emailVerified: false,

                phoneVerified: false,
              },
            })

          return tx.employee.create({
            data: {
              userId: user.id,

              employeeCode:
                input.employeeCode,

              firstName:
                input.firstName,

              lastName:
                input.lastName,

              email: input.email,

              phone: input.phone,

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

    /*
    ---------------------------------------------------------
    Record internal employee activity
    ---------------------------------------------------------
    */

    if (session.user.email) {
      const actorEmployee =
        await prisma.employee.findUnique({
          where: {
            email:
              session.user.email.toLowerCase(),
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

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message:
          "Please correct the highlighted fields.",
        errors,
      }
    }

    const existingEmployee =
      await prisma.employee.findUnique({
        where: {
          id: employeeId,
        },

        include: {
          user: {
            select: {
              id: true,
              role: true,
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

    /*
    ---------------------------------------------------------
    Protect Super Admin role changes
    ---------------------------------------------------------
    */

    if (
      existingEmployee.user?.role ===
        UserRole.super_admin &&
      currentRole !==
        UserRole.super_admin
    ) {
      return {
        success: false,
        message:
          "Only Super Admin can modify a Super Admin employee.",
      }
    }

    if (
      input.userRole ===
        UserRole.super_admin &&
      currentRole !==
        UserRole.super_admin
    ) {
      return {
        success: false,
        message:
          "Only Super Admin can assign the Super Admin role.",
      }
    }

    const {
      department,
    } = await validateReferences(
      input.departmentId,
      input.roleId,
      input.managerId,
      employeeId
    )

    const koniqTechOrganization =
      await prisma.organization.findUnique({
        where: {
          slug: "koniqtech",
        },

        select: {
          id: true,
        },
      })

    if (!koniqTechOrganization) {
      return {
        success: false,
        message:
          "KoniqTech organization was not found.",
      }
    }

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

    /*
    ---------------------------------------------------------
    Unique email/code validation
    ---------------------------------------------------------
    */

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

    /*
    ---------------------------------------------------------
    UPDATE TRANSACTION
    ---------------------------------------------------------
    */

    await prisma.$transaction(
      async (tx) => {
        let userId =
          existingEmployee.userId

        /*
        -----------------------------------------------------
        Repair legacy Employee without User account
        -----------------------------------------------------
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

                role:
                  input.userRole,

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
          const userUpdateData = {
            name:
              `${input.firstName} ${input.lastName}`,

            email:
              input.email,

            phone:
              input.phone,

            role:
              input.userRole,

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

    /*
    ---------------------------------------------------------
    Prevent self deletion
    ---------------------------------------------------------
    */

    if (
      session.user.email &&
      employee.email.toLowerCase() ===
        session.user.email.toLowerCase()
    ) {
      return {
        success: false,
        message:
          "You cannot delete your own employee account.",
      }
    }

    /*
    ---------------------------------------------------------
    Prevent deleting Super Admin account
    ---------------------------------------------------------
    */

    if (
      employee.user?.role ===
      UserRole.super_admin
    ) {
      return {
        success: false,
        message:
          "Super Admin employee accounts cannot be deleted from this action.",
      }
    }

    /*
    ---------------------------------------------------------
    Prevent manager deletion while subordinates exist
    ---------------------------------------------------------
    */

    if (
      employee._count.subordinates > 0
    ) {
      return {
        success: false,
        message:
          "Reassign this employee's subordinates before deleting the employee.",
      }
    }

    /*
    ---------------------------------------------------------
    DELETE EMPLOYEE + USER

    Employee is deleted first because Employee.user uses
    onDelete: SetNull when User is deleted.
    ---------------------------------------------------------
    */

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
    const {
      role: currentRole,
    } = await requireEmployeeManager()

    const employee =
      await prisma.employee.findUnique({
        where: {
          id: employeeId,
        },

        select: {
          id: true,
          active: true,
          userId: true,

          user: {
            select: {
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

    if (
      employee.user?.role ===
        UserRole.super_admin &&
      currentRole !==
        UserRole.super_admin
    ) {
      return {
        success: false,
        message:
          "Only Super Admin can change a Super Admin employee status.",
      }
    }

    const newStatus =
      !employee.active

    await prisma.$transaction(
      async (tx) => {
        await tx.employee.update({
          where: {
            id: employeeId,
          },

          data: {
            active: newStatus,
          },
        })

        if (employee.userId) {
          await tx.user.update({
            where: {
              id: employee.userId,
            },

            data: {
              status: newStatus
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

    return error.message
  }

  return "An unexpected error occurred."
}