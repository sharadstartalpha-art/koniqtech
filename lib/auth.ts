import { cookies } from "next/headers";
import { jwtVerify } from "jose";

import { prisma } from "./prisma";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET!
);

export async function getUser() {
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

    if (
      typeof payload.id !==
      "string"
    ) {
      return null;
    }

    /* =====================================
       GET FRESH USER FROM DATABASE
    ===================================== */

    const user =
      await prisma.user.findUnique({
        where: {
          id: payload.id,
        },
      });

    if (!user) {
      return null;
    }

    return user;

  } catch (err) {

    console.error(
      "GET USER ERROR:",
      err
    );

    return null;
  }
}