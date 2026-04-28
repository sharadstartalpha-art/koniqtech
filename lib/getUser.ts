import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function getUser() {
  try {
    // ✅ FIX: await cookies()
    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    const { payload } = await jwtVerify(token, secret);

    return payload as {
      id: string;
      email: string;
      role: string;
    };
  } catch (err) {
    console.error("GET USER ERROR:", err);
    return null;
  }
}