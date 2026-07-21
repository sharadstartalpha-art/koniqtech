import {
  BillingCycle,
  CRMType,
  Industry,
  Prisma,
  SubscriptionStatus,
  UserRole,
} from "@prisma/client";

import { prisma } from "@/shared/lib/prisma";
import { hashPassword } from "@/shared/lib/auth/password";

const TRIAL_DAYS = 7;

export interface RegisterInput {
  fullName: string;
  companyName: string;
  email: string;
  password: string;
  otp: string;

  industry: Industry;
  crmType: CRMType;

  phone?: string;
  website?: string;

  timezone?: string;
  currency?: string;
  language?: string;

  plan?: string;
}

export interface RegisterResult {
  success: boolean;

  userId: string;

  organizationId: string;

  roleId: string;

  subscriptionId: string;

  slug: string;

  message: string;
}

export class RegisterError extends Error {
  constructor(message: string) {
    super(message);

    this.name = "RegisterError";
  }
}

const DEFAULT_PLAN = "starter";

const DEFAULT_TIMEZONE = "UTC";

const DEFAULT_CURRENCY = "USD";

const DEFAULT_LANGUAGE = "en";

const DEFAULT_USER_LIMIT = 5;

const DEFAULT_STORAGE_LIMIT = 20;

const DEFAULT_AI_CREDITS = 1000;

const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;


async function generateUniqueSlug(
  companyName: string
): Promise<string> {
  const base = slugify(companyName);

  let slug = base;

  let exists = await prisma.organization.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
    },
  });

  while (exists) {
    slug = `${base}-${randomSuffix()}`;

    exists = await prisma.organization.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
      },
    });
  }

  return slug;
}


async function validateRegistrationInput(
  input: RegisterInput
): Promise<{
  email: string;
  passwordHash: string;
  slug: string;
  otpRecord: {
    id: string;
    email: string;
  };
}> {
  const data = prepareInput(input);

  validateName(data.fullName);

  validateCompany(data.companyName);

  validateEmail(data.email);

  validatePassword(data.password);

  if (!data.otp.trim()) {
    throw new RegisterError("OTP is required.");
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
    select: {
      id: true,
      
    },
  });

  if (existingUser) {
    throw new RegisterError(
      "An account with this email already exists."
    );
  }

  const otpRecord = await prisma.otpCode.findFirst({
    where: {
      email: data.email,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!otpRecord) {
    throw new RegisterError(
      "OTP not found. Please request a new OTP."
    );
  }

  if (otpRecord.verified) {
    throw new RegisterError(
      "This OTP has already been used."
    );
  }

  if (otpRecord.expiresAt < new Date()) {
    await prisma.otpCode.delete({
      where: {
        id: otpRecord.id,
      },
    });

    throw new RegisterError(
      "OTP has expired. Please request a new one."
    );
  }

  if (otpRecord.code !== data.otp.trim()) {
    throw new RegisterError(
      "Invalid OTP."
    );
  }

  const slug = await generateUniqueSlug(
    data.companyName
  );

  const passwordHash = await hashPassword(
    data.password
  );

  return {
    email: data.email,
    passwordHash,
    slug,
    otpRecord: {
      id: otpRecord.id,
      email: otpRecord.email,
    },
  };
}



async function createRegistration(
  ctx: RegistrationContext
): Promise<RegisterResult> {
  return prisma.$transaction(async (tx) => {
    const organization = await tx.organization.create({
      data: {
        name: ctx.prepared.companyName,

        slug: ctx.slug,

        industry: ctx.prepared.industry,

        crmType: ctx.prepared.crmType,

        plan: ctx.prepared.plan,

        phone: ctx.prepared.phone,

        website: ctx.prepared.website,

        email: ctx.prepared.email,

        timezone: ctx.prepared.timezone,

        currency: ctx.prepared.currency,

        language: ctx.prepared.language,

        usersLimit: DEFAULT_USER_LIMIT,

        trialEndsAt: ctx.trial.end,
      },
    });

    const ownerRole =
      await tx.organizationRole.create({
        data: {
          orgId: organization.id,

          name: "Owner",

          description:
            "Organization Owner",

          isSystem: true,

          
        },
      });


          const user = await tx.user.create({
      data: {
        orgId: organization.id,

        organizationRoleId: ownerRole.id,

        role: UserRole.owner,

        name: ctx.prepared.fullName,

        email: ctx.prepared.email,

        passwordHash: ctx.passwordHash,

        phone: ctx.prepared.phone,

       

        
      },
    });



        const preferences =
      await tx.userPreference.create({
        data: {
          userId: user.id,

          timezone:
            ctx.prepared.timezone ??
            DEFAULT_TIMEZONE,

          language:
            ctx.prepared.language ??
            DEFAULT_LANGUAGE,
        },
      });


    const subscription =
      await tx.subscription.create({
        data: {
          orgId: organization.id,

          provider: "paypal",

          plan: ctx.prepared.plan ?? DEFAULT_PLAN,

          status: SubscriptionStatus.trial,

          billingCycle: BillingCycle.monthly,

          amount: new Prisma.Decimal(0),

          currency:
            ctx.prepared.currency ??
            DEFAULT_CURRENCY,

          trialStart: ctx.trial.start,

          trialEnd: ctx.trial.end,

          userLimit: DEFAULT_USER_LIMIT,

          storageLimit: DEFAULT_STORAGE_LIMIT,

          aiCredits: DEFAULT_AI_CREDITS,
        },
      });


    await tx.otpCode.delete({
      where: {
        id: ctx.otpId,
      },
    });


        return {
      success: true,

      userId: user.id,

      organizationId: organization.id,

      roleId: ownerRole.id,

      subscriptionId: subscription.id,

      slug: organization.slug,

      message:
        "Account created successfully.",
    };
  });
}


export async function emailExists(
  email: string
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: {
      email: normalizeEmail(email),
    },
    select: {
      id: true,
    },
  });

  return !!user;
}


export async function registerUser(
  input: RegisterInput
): Promise<RegisterResult> {
  try {
    const context =
      await buildRegistrationContext(input);

    return await createRegistration(context);
  } catch (error) {
    if (error instanceof RegisterError) {
      throw error;
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError
    ) {
      switch (error.code) {
        case "P2002":
          throw new RegisterError(
            "A record with the same unique value already exists."
          );

        case "P2025":
          throw new RegisterError(
            "Required record was not found."
          );

        default:
          throw new RegisterError(
            "Database operation failed."
          );
      }
    }

    if (error instanceof Error) {
      throw new RegisterError(error.message);
    }

    throw new RegisterError(
      "Unable to complete registration."
    );
  }
}









  function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizeCompany(name: string): string {
  return name.trim().replace(/\s+/g, " ");
}

function validateEmail(email: string) {
  if (!EMAIL_REGEX.test(email)) {
    throw new RegisterError("Invalid email address.");
  }
}

function validateName(name: string) {
  if (!name.trim()) {
    throw new RegisterError("Full name is required.");
  }

  if (name.trim().length < 2) {
    throw new RegisterError(
      "Full name must contain at least 2 characters."
    );
  }
}

function validateCompany(name: string) {
  if (!name.trim()) {
    throw new RegisterError(
      "Company name is required."
    );
  }

  if (name.trim().length < 2) {
    throw new RegisterError(
      "Company name is too short."
    );
  }
}


function validatePassword(password: string) {
  if (password.length < 8) {
    throw new RegisterError(
      "Password must be at least 8 characters."
    );
  }

  if (!/[A-Z]/.test(password)) {
    throw new RegisterError(
      "Password must contain an uppercase letter."
    );
  }

  if (!/[a-z]/.test(password)) {
    throw new RegisterError(
      "Password must contain a lowercase letter."
    );
  }

  if (!/[0-9]/.test(password)) {
    throw new RegisterError(
      "Password must contain a number."
    );
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    throw new RegisterError(
      "Password must contain a special character."
    );
  }
}


function slugify(company: string) {
  return company
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+/g, "")
    .replace(/-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function randomSuffix(length = 5) {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}


function getTrialDates() {
  const start = new Date();

  const end = new Date(start);

  end.setDate(end.getDate() + TRIAL_DAYS);

  return {
    start,
    end,
  };
}


function prepareInput(
  input: RegisterInput
): RegisterInput {
  return {
    ...input,

    fullName: input.fullName.trim(),

    companyName: normalizeCompany(
      input.companyName
    ),

    email: normalizeEmail(input.email),

    timezone:
      input.timezone ?? DEFAULT_TIMEZONE,

    currency:
      input.currency ?? DEFAULT_CURRENCY,

    language:
      input.language ?? DEFAULT_LANGUAGE,

    plan: input.plan ?? DEFAULT_PLAN,
  };
}


interface RegistrationContext {
  input: RegisterInput;

  prepared: RegisterInput;

  slug: string;

  passwordHash: string;

  otpId: string;

  trial: {
    start: Date;
    end: Date;
  };
}

async function buildRegistrationContext(
  input: RegisterInput
): Promise<RegistrationContext> {
 
const prepared = prepareInput(input);
  const validation =
    await validateRegistrationInput(prepared);

  return {
    input,

    prepared,

    slug: validation.slug,

    passwordHash: validation.passwordHash,

    otpId: validation.otpRecord.id,

    trial: getTrialDates(),
  };
}