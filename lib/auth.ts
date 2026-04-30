import { cookies } from "next/headers";
import { jwtVerify, JWTPayload } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export type UserPayload = {
  id: string;
  email: string;
  role: string;
};

export async function getUser(): Promise<UserPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    const { payload } = await jwtVerify(token, secret);

    // ✅ Validate required fields
    if (
      typeof payload.id !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.role !== "string"
    ) {
      return null;
    }

    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };

  } catch (err) {
    console.error("AUTH ERROR:", err);
    return null;
  }
}