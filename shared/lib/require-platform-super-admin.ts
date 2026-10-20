
import { NextResponse } from "next/server";
import { auth } from "@/auth";

type SessionUser = {
  id?: unknown;
  role?: unknown;
  orgId?: unknown;
};

export async function requirePlatformSuperAdmin() {
  const session = await auth();

  if (!session?.user) {
    return {
      user: null,
      response: NextResponse.json(
        { error: "Please sign in." },
        { status: 401 },
      ),
    };
  }

  const sessionUser = session.user as SessionUser;
  const role = String(sessionUser.role ?? "")
    .trim()
    .toLowerCase();

  if (role !== "super_admin") {
    return {
      user: null,
      response: NextResponse.json(
        { error: "Super Admin access is required." },
        { status: 403 },
      ),
    };
  }

  const id =
    typeof sessionUser.id === "string" ? sessionUser.id : "";
  const orgId =
    typeof sessionUser.orgId === "string" ? sessionUser.orgId : "";

  if (!id || !orgId) {
    return {
      user: null,
      response: NextResponse.json(
        { error: "The platform administrator account is not configured correctly." },
        { status: 403 },
      ),
    };
  }

  return {
    user: { id, orgId },
    response: null,
  };
}
