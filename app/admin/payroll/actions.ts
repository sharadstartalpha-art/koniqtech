"use server"

import {
  Prisma,
  SalaryStatus,
  SalaryType,
  UserRole
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

export type PayrollActionState = {
  success: boolean

  message: string

  errors?: Record<
    string,
    string
  >
}


// ============================================================
// ACCESS ROLES
// ============================================================

const MANAGE_ROLES: UserRole[] = [
  UserRole.super_admin,
  UserRole.platform_manager
]


// ============================================================
// CONSTANTS
// ============================================================

const VALID_SALARY_TYPES =
  Object.values(
    SalaryType
  )


const VALID_SALARY_STATUSES =
  Object.values(
    SalaryStatus
  )


// ============================================================
// AUTHORIZATION
// ============================================================

async function requirePayrollManager() {

  const session =
    await auth()


  if (
    !session?.user?.id ||
    !session.user.role
  ) {
    redirect("/login")
  }


  const role =
    session.user.role as UserRole


  if (
    !MANAGE_ROLES.includes(
      role
    )
  ) {
    throw new Error(
      "You are not authorized to manage payroll."
    )
  }


  return session
}


// ============================================================
// FORM HELPERS
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
// DECIMAL PARSER
// ============================================================

function parseDecimal(
  value: FormDataEntryValue | null
) {

  if (
    typeof value !== "string" ||
    value.trim() === ""
  ) {
    return new Prisma.Decimal(0)
  }


  const normalized =
    value
      .replace(/,/g, "")
      .trim()


  try {

    const decimal =
      new Prisma.Decimal(
        normalized
      )


    if (decimal.isNegative()) {

      throw new Error(
        "Negative value"
      )
    }


    return decimal

  } catch {

    return null
  }
}


// ============================================================
// INTEGER PARSER
// ============================================================

function parseInteger(
  value: FormDataEntryValue | null
) {

  if (
    typeof value !== "string" ||
    value.trim() === ""
  ) {
    return null
  }


  const number =
    Number(value)


  if (
    !Number.isInteger(number)
  ) {
    return null
  }


  return number
}


// ============================================================
// DATE PARSER
// ============================================================

function parseOptionalDate(
  value: string
) {

  if (!value) {
    return null
  }


  const date =
    new Date(
      `${value}T00:00:00.000Z`
    )


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return null
  }


  return date
}


// ============================================================
// PAYROLL CALCULATION
// ============================================================

type PayrollCalculationInput = {
  basicSalary: Prisma.Decimal

  hra: Prisma.Decimal

  allowance: Prisma.Decimal

  bonus: Prisma.Decimal

  incentive: Prisma.Decimal

  overtime: Prisma.Decimal

  deductions: Prisma.Decimal

  tax: Prisma.Decimal
}


function calculateNetSalary({
  basicSalary,
  hra,
  allowance,
  bonus,
  incentive,
  overtime,
  deductions,
  tax
}: PayrollCalculationInput) {

  const grossSalary =
    basicSalary
      .plus(hra)
      .plus(allowance)
      .plus(bonus)
      .plus(incentive)
      .plus(overtime)


  const totalDeductions =
    deductions
      .plus(tax)


  const netSalary =
    grossSalary.minus(
      totalDeductions
    )


  return {
    grossSalary,
    totalDeductions,
    netSalary
  }
}


// ============================================================
// VALIDATE PAYROLL FORM
// ============================================================

function validatePayrollForm(
  formData: FormData
) {

  const errors:
    Record<string, string> = {}


  // ----------------------------------------------------------
  // EMPLOYEE
  // ----------------------------------------------------------

  const employeeId =
    getString(
      formData,
      "employeeId"
    )


  if (!employeeId) {

    errors.employeeId =
      "Employee is required."
  }


  // ----------------------------------------------------------
  // SALARY TYPE
  // ----------------------------------------------------------

  const salaryTypeValue =
    getString(
      formData,
      "salaryType"
    )


  const salaryType =
    VALID_SALARY_TYPES.includes(
      salaryTypeValue as SalaryType
    )
      ? salaryTypeValue as SalaryType
      : null


  if (!salaryType) {

    errors.salaryType =
      "Valid salary type is required."
  }


  // ----------------------------------------------------------
  // PAY MONTH
  // ----------------------------------------------------------

  const payMonth =
    parseInteger(
      formData.get(
        "payMonth"
      )
    )


  if (
    payMonth === null ||
    payMonth < 1 ||
    payMonth > 12
  ) {

    errors.payMonth =
      "Pay month must be between 1 and 12."
  }


  // ----------------------------------------------------------
  // PAY YEAR
  // ----------------------------------------------------------

  const payYear =
    parseInteger(
      formData.get(
        "payYear"
      )
    )


  if (
    payYear === null ||
    payYear < 2000 ||
    payYear > 2200
  ) {

    errors.payYear =
      "Enter a valid pay year."
  }


  // ----------------------------------------------------------
  // SALARY VALUES
  // ----------------------------------------------------------

  const basicSalary =
    parseDecimal(
      formData.get(
        "basicSalary"
      )
    )


  const hra =
    parseDecimal(
      formData.get(
        "hra"
      )
    )


  const allowance =
    parseDecimal(
      formData.get(
        "allowance"
      )
    )


  const bonus =
    parseDecimal(
      formData.get(
        "bonus"
      )
    )


  const incentive =
    parseDecimal(
      formData.get(
        "incentive"
      )
    )


  const overtime =
    parseDecimal(
      formData.get(
        "overtime"
      )
    )


  const deductions =
    parseDecimal(
      formData.get(
        "deductions"
      )
    )


  const tax =
    parseDecimal(
      formData.get(
        "tax"
      )
    )


  // ----------------------------------------------------------
  // DECIMAL VALIDATION
  // ----------------------------------------------------------

  if (
    !basicSalary ||
    basicSalary.lte(0)
  ) {

    errors.basicSalary =
      "Basic salary must be greater than zero."
  }


  if (!hra) {

    errors.hra =
      "HRA must be zero or greater."
  }


  if (!allowance) {

    errors.allowance =
      "Allowance must be zero or greater."
  }


  if (!bonus) {

    errors.bonus =
      "Bonus must be zero or greater."
  }


  if (!incentive) {

    errors.incentive =
      "Incentive must be zero or greater."
  }


  if (!overtime) {

    errors.overtime =
      "Overtime amount must be zero or greater."
  }


  if (!deductions) {

    errors.deductions =
      "Deductions must be zero or greater."
  }


  if (!tax) {

    errors.tax =
      "Tax must be zero or greater."
  }


  // ----------------------------------------------------------
  // PAYMENT DATE
  // ----------------------------------------------------------

  const paymentDateValue =
    getString(
      formData,
      "paymentDate"
    )


  const paymentDate =
    parseOptionalDate(
      paymentDateValue
    )


  if (
    paymentDateValue &&
    !paymentDate
  ) {

    errors.paymentDate =
      "Enter a valid payment date."
  }


  // ----------------------------------------------------------
  // PAYMENT INFORMATION
  // ----------------------------------------------------------

  const paymentMethod =
    getOptionalString(
      formData,
      "paymentMethod"
    )


  const transactionId =
    getOptionalString(
      formData,
      "transactionId"
    )


  const remarks =
    getOptionalString(
      formData,
      "remarks"
    )


  // ----------------------------------------------------------
  // STATUS
  // ----------------------------------------------------------

  const statusValue =
    getString(
      formData,
      "status"
    )


  const status =
    VALID_SALARY_STATUSES.includes(
      statusValue as SalaryStatus
    )
      ? statusValue as SalaryStatus
      : SalaryStatus.pending


  // ----------------------------------------------------------
  // RETURN ERRORS
  // ----------------------------------------------------------

  if (
    Object.keys(errors).length > 0
  ) {

    return {
      success: false as const,
      errors
    }
  }


  // ----------------------------------------------------------
  // TYPE GUARD
  // ----------------------------------------------------------

  if (
    !salaryType ||
    payMonth === null ||
    payYear === null ||
    !basicSalary ||
    !hra ||
    !allowance ||
    !bonus ||
    !incentive ||
    !overtime ||
    !deductions ||
    !tax
  ) {

    return {
      success: false as const,

      errors: {
        form:
          "Payroll data is incomplete."
      }
    }
  }


  // ----------------------------------------------------------
  // CALCULATE NET SALARY
  // ----------------------------------------------------------

  const {
    netSalary
  } =
    calculateNetSalary({

      basicSalary,

      hra,

      allowance,

      bonus,

      incentive,

      overtime,

      deductions,

      tax

    })


  if (
    netSalary.isNegative()
  ) {

    return {
      success: false as const,

      errors: {

        deductions:
          "Total deductions and tax cannot exceed gross earnings."

      }
    }
  }


  // ----------------------------------------------------------
  // VALID DATA
  // ----------------------------------------------------------

  return {

    success:
      true as const,

    data: {

      employeeId,

      salaryType,

      basicSalary,

      hra,

      allowance,

      bonus,

      incentive,

      overtime,

      deductions,

      tax,

      netSalary,

      payMonth,

      payYear,

      paymentDate,

      paymentMethod,

      transactionId,

      status,

      remarks

    }

  }
}


// ============================================================
// REVALIDATE PAYROLL PATHS
// ============================================================

function revalidatePayrollPaths(
  id?: string
) {

  revalidatePath(
    "/admin/payroll"
  )


  if (id) {

    revalidatePath(
      `/admin/payroll/${id}`
    )


    revalidatePath(
      `/admin/payroll/${id}/edit`
    )
  }
}


// ============================================================
// CREATE PAYROLL
// ============================================================

export async function createPayrollAction(
  _previousState: PayrollActionState,
  formData: FormData
): Promise<PayrollActionState> {

  await requirePayrollManager()


  const validation =
    validatePayrollForm(
      formData
    )


  if (!validation.success) {

    return {

      success:
        false,

      message:
        "Please correct the payroll form errors.",

      errors:
        validation.errors

    }
  }


  const {
    data
  } = validation


  // ----------------------------------------------------------
  // VERIFY EMPLOYEE
  // ----------------------------------------------------------

  const employee =
    await prisma.employee.findUnique({

      where: {
        id:
          data.employeeId
      },

      select: {
        id: true,
        active: true
      }

    })


  if (!employee) {

    return {

      success:
        false,

      message:
        "Selected employee was not found.",

      errors: {
        employeeId:
          "Employee does not exist."
      }

    }
  }


  if (!employee.active) {

    return {

      success:
        false,

      message:
        "Payroll cannot be created for an inactive employee.",

      errors: {
        employeeId:
          "Select an active employee."
      }

    }
  }


  // ----------------------------------------------------------
  // DUPLICATE MONTH CHECK
  // ----------------------------------------------------------

  const existingPayroll =
    await prisma.employeeSalary.findUnique({

      where: {

        employeeId_payMonth_payYear: {

          employeeId:
            data.employeeId,

          payMonth:
            data.payMonth,

          payYear:
            data.payYear

        }

      },

      select: {
        id: true
      }

    })


  if (existingPayroll) {

    return {

      success:
        false,

      message:
        "A payroll record already exists for this employee and pay period.",

      errors: {

        payMonth:
          "Payroll already exists for the selected month and year."

      }

    }
  }


  // ----------------------------------------------------------
  // CREATE RECORD
  // ----------------------------------------------------------

  try {

    const payroll =
      await prisma.employeeSalary.create({

        data: {

          employeeId:
            data.employeeId,

          salaryType:
            data.salaryType,

          basicSalary:
            data.basicSalary,

          hra:
            data.hra,

          allowance:
            data.allowance,

          bonus:
            data.bonus,

          incentive:
            data.incentive,

          overtime:
            data.overtime,

          deductions:
            data.deductions,

          tax:
            data.tax,

          netSalary:
            data.netSalary,

          payMonth:
            data.payMonth,

          payYear:
            data.payYear,

          paymentDate:
            data.paymentDate,

          paymentMethod:
            data.paymentMethod,

          transactionId:
            data.transactionId,

          status:
            data.status,

          remarks:
            data.remarks

        },

        select: {
          id: true
        }

      })


    revalidatePayrollPaths(
      payroll.id
    )


    redirect(
      `/admin/payroll/${payroll.id}`
    )

  } catch (error) {

    // --------------------------------------------------------
    // NEXT.JS REDIRECT MUST PASS THROUGH
    // --------------------------------------------------------

    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.startsWith(
        "NEXT_REDIRECT"
      )
    ) {
      throw error
    }


    // --------------------------------------------------------
    // PRISMA UNIQUE CONSTRAINT
    // --------------------------------------------------------

    if (
      error instanceof
        Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {

      return {

        success:
          false,

        message:
          "Payroll already exists for this employee and pay period.",

        errors: {

          payMonth:
            "Duplicate payroll period."

        }

      }
    }


    console.error(
      "CREATE_PAYROLL_ERROR",
      error
    )


    return {

      success:
        false,

      message:
        "Unable to create payroll record."

    }
  }
}


// ============================================================
// UPDATE PAYROLL
// ============================================================

export async function updatePayrollAction(
  payrollId: string,
  _previousState: PayrollActionState,
  formData: FormData
): Promise<PayrollActionState> {

  await requirePayrollManager()


  if (!payrollId) {

    return {

      success:
        false,

      message:
        "Payroll record ID is required."

    }
  }


  const existingPayroll =
    await prisma.employeeSalary.findUnique({

      where: {
        id:
          payrollId
      },

      select: {
        id: true,
        status: true
      }

    })


  if (!existingPayroll) {

    return {

      success:
        false,

      message:
        "Payroll record was not found."

    }
  }


  const validation =
    validatePayrollForm(
      formData
    )


  if (!validation.success) {

    return {

      success:
        false,

      message:
        "Please correct the payroll form errors.",

      errors:
        validation.errors

    }
  }


  const {
    data
  } = validation


  // ----------------------------------------------------------
  // VERIFY EMPLOYEE
  // ----------------------------------------------------------

  const employee =
    await prisma.employee.findUnique({

      where: {
        id:
          data.employeeId
      },

      select: {
        id: true
      }

    })


  if (!employee) {

    return {

      success:
        false,

      message:
        "Selected employee was not found.",

      errors: {

        employeeId:
          "Employee does not exist."

      }

    }
  }


  // ----------------------------------------------------------
  // DUPLICATE PAYROLL CHECK
  // ----------------------------------------------------------

  const duplicatePayroll =
    await prisma.employeeSalary.findFirst({

      where: {

        employeeId:
          data.employeeId,

        payMonth:
          data.payMonth,

        payYear:
          data.payYear,

        NOT: {
          id:
            payrollId
        }

      },

      select: {
        id: true
      }

    })


  if (duplicatePayroll) {

    return {

      success:
        false,

      message:
        "Another payroll record already exists for this employee and pay period.",

      errors: {

        payMonth:
          "Duplicate payroll period."

      }

    }
  }


  // ----------------------------------------------------------
  // UPDATE RECORD
  // ----------------------------------------------------------

  try {

    await prisma.employeeSalary.update({

      where: {
        id:
          payrollId
      },

      data: {

        employeeId:
          data.employeeId,

        salaryType:
          data.salaryType,

        basicSalary:
          data.basicSalary,

        hra:
          data.hra,

        allowance:
          data.allowance,

        bonus:
          data.bonus,

        incentive:
          data.incentive,

        overtime:
          data.overtime,

        deductions:
          data.deductions,

        tax:
          data.tax,

        netSalary:
          data.netSalary,

        payMonth:
          data.payMonth,

        payYear:
          data.payYear,

        paymentDate:
          data.paymentDate,

        paymentMethod:
          data.paymentMethod,

        transactionId:
          data.transactionId,

        status:
          data.status,

        remarks:
          data.remarks

      }

    })


    revalidatePayrollPaths(
      payrollId
    )


    redirect(
      `/admin/payroll/${payrollId}`
    )

  } catch (error) {

    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.startsWith(
        "NEXT_REDIRECT"
      )
    ) {
      throw error
    }


    if (
      error instanceof
        Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {

      return {

        success:
          false,

        message:
          "Payroll already exists for this employee and pay period.",

        errors: {

          payMonth:
            "Duplicate payroll period."

        }

      }
    }


    console.error(
      "UPDATE_PAYROLL_ERROR",
      error
    )


    return {

      success:
        false,

      message:
        "Unable to update payroll record."

    }
  }
}


// ============================================================
// MARK PAYROLL AS PAID
// ============================================================

export async function markPayrollPaidAction(
  payrollId: string,
  formData: FormData
) {

  await requirePayrollManager()


  if (!payrollId) {

    throw new Error(
      "Payroll record ID is required."
    )
  }


  const payroll =
    await prisma.employeeSalary.findUnique({

      where: {
        id:
          payrollId
      },

      select: {
        id: true,
        status: true
      }

    })


  if (!payroll) {

    throw new Error(
      "Payroll record was not found."
    )
  }


  const paymentDateValue =
    getString(
      formData,
      "paymentDate"
    )


  const paymentDate =
    paymentDateValue
      ? parseOptionalDate(
          paymentDateValue
        )
      : new Date()


  if (!paymentDate) {

    throw new Error(
      "Invalid payment date."
    )
  }


  const paymentMethod =
    getOptionalString(
      formData,
      "paymentMethod"
    )


  const transactionId =
    getOptionalString(
      formData,
      "transactionId"
    )


  await prisma.employeeSalary.update({

    where: {
      id:
        payrollId
    },

    data: {

      status:
        SalaryStatus.paid,

      paymentDate,

      paymentMethod,

      transactionId

    }

  })


  revalidatePayrollPaths(
    payrollId
  )
}


// ============================================================
// REVERT PAYROLL TO PENDING
// ============================================================

export async function revertPayrollToPendingAction(
  payrollId: string
) {

  await requirePayrollManager()


  if (!payrollId) {

    throw new Error(
      "Payroll record ID is required."
    )
  }


  const payroll =
    await prisma.employeeSalary.findUnique({

      where: {
        id:
          payrollId
      },

      select: {
        id: true
      }

    })


  if (!payroll) {

    throw new Error(
      "Payroll record was not found."
    )
  }


  await prisma.employeeSalary.update({

    where: {
      id:
        payrollId
    },

    data: {

      status:
        SalaryStatus.pending,

      paymentDate:
        null,

      paymentMethod:
        null,

      transactionId:
        null

    }

  })


  revalidatePayrollPaths(
    payrollId
  )
}


// ============================================================
// DELETE PAYROLL
// ============================================================

export async function deletePayrollAction(
  payrollId: string
) {

  await requirePayrollManager()


  if (!payrollId) {

    throw new Error(
      "Payroll record ID is required."
    )
  }


  const payroll =
    await prisma.employeeSalary.findUnique({

      where: {
        id:
          payrollId
      },

      select: {
        id: true,
        status: true
      }

    })


  if (!payroll) {

    throw new Error(
      "Payroll record was not found."
    )
  }


  // ----------------------------------------------------------
  // PROTECT PAID PAYROLL RECORDS
  // ----------------------------------------------------------

  if (
    payroll.status ===
    SalaryStatus.paid
  ) {

    throw new Error(
      "Paid payroll records cannot be deleted. Revert the payment status first."
    )
  }


  await prisma.employeeSalary.delete({

    where: {
      id:
        payrollId
    }

  })


  revalidatePath(
    "/admin/payroll"
  )


  redirect(
    "/admin/payroll"
  )
}