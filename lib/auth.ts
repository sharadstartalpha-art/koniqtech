import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET!
);

/* =========================================
   USER PAYLOAD
========================================= */

export type UserPayload = {
  id: string;

  email: string;

  role: string;

  name?: string | null;

  phone?: string | null;

  companyName?: string | null;

  businessPhone?: string | null;

  businessEmail?: string | null;

  whatsappNumber?: string | null;
};

/* =========================================
   GET USER
========================================= */

export async function getUser(): Promise<UserPayload | null> {
  try {

    const cookieStore =
      await cookies();

    const token =
      cookieStore.get("token")
        ?.value;

    if (!token) {
      return null;
    }

    const { payload } =
      await jwtVerify(
        token,
        secret
      );

    /* =====================================
       VALIDATION
    ===================================== */

    if (
      typeof payload.id !==
        "string" ||
      typeof payload.email !==
        "string" ||
      typeof payload.role !==
        "string"
    ) {
      return null;
    }

    /* =====================================
       RETURN USER
    ===================================== */

    return {
      id:
        payload.id,

      email:
        payload.email,

      role:
        payload.role,

      name:
        typeof payload.name ===
        "string"
          ? payload.name
          : null,

      phone:
        typeof payload.phone ===
        "string"
          ? payload.phone
          : null,

      companyName:
        typeof payload.companyName ===
        "string"
          ? payload.companyName
          : null,

      businessPhone:
        typeof payload.businessPhone ===
        "string"
          ? payload.businessPhone
          : null,

      businessEmail:
        typeof payload.businessEmail ===
        "string"
          ? payload.businessEmail
          : null,

      whatsappNumber:
        typeof payload.whatsappNumber ===
        "string"
          ? payload.whatsappNumber
          : null,
    };

  } catch (err) {

    console.error(
      "GET USER ERROR:",
      err
    );

    return null;
  }
}