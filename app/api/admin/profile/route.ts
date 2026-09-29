
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

/*
|--------------------------------------------------------------------------
| Internal Admin Roles
|--------------------------------------------------------------------------
|
| These are KoniqTech internal platform roles.
| Customer CRM roles should NOT be able to use /api/admin/*.
|
*/

const INTERNAL_ADMIN_ROLES = [
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
] as const;

/*
|--------------------------------------------------------------------------
| GET /api/admin/profile
|--------------------------------------------------------------------------
|
| Returns the currently authenticated internal admin profile.
|
*/

export async function GET(_request: NextRequest) {
  try {
    const session = await auth();

    /*
    |--------------------------------------------------------------------------
    | Authentication
    |--------------------------------------------------------------------------
    */

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Internal Admin Role Check
    |--------------------------------------------------------------------------
    */

    const role = String(
      (session.user as { role?: unknown }).role ?? ""
    )
      .trim()
      .toLowerCase();

    if (
      !INTERNAL_ADMIN_ROLES.includes(
        role as (typeof INTERNAL_ADMIN_ROLES)[number]
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied",
        },
        {
          status: 403,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Load Current User
    |--------------------------------------------------------------------------
    */

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("[ADMIN_PROFILE_GET]", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load profile",
      },
      {
        status: 500,
      }
    );
  }
}

/*
|--------------------------------------------------------------------------
| PATCH /api/admin/profile
|--------------------------------------------------------------------------
|
| Updates editable profile information.
|
| Editable:
|   - name
|   - avatar
|
| NOT editable here:
|   - email
|   - role
|   - id
|
*/

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    /*
    |--------------------------------------------------------------------------
    | Authentication
    |--------------------------------------------------------------------------
    */

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Internal Admin Role Check
    |--------------------------------------------------------------------------
    */

    const role = String(
      (session.user as { role?: unknown }).role ?? ""
    )
      .trim()
      .toLowerCase();

    if (
      !INTERNAL_ADMIN_ROLES.includes(
        role as (typeof INTERNAL_ADMIN_ROLES)[number]
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied",
        },
        {
          status: 403,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Parse Request Body
    |--------------------------------------------------------------------------
    */

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON request",
        },
        {
          status: 400,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Validate Request Body
    |--------------------------------------------------------------------------
    */

    if (
      typeof body !== "object" ||
      body === null ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body",
        },
        {
          status: 400,
        }
      );
    }

    const data = body as Record<string, unknown>;

    /*
    |--------------------------------------------------------------------------
    | Validate Name
    |--------------------------------------------------------------------------
    */

    let name: string | undefined;

    if (data.name !== undefined) {
      if (typeof data.name !== "string") {
        return NextResponse.json(
          {
            success: false,
            message: "Name must be a string",
          },
          {
            status: 400,
          }
        );
      }

      name = data.name.trim();

      if (name.length < 2) {
        return NextResponse.json(
          {
            success: false,
            message: "Name must contain at least 2 characters",
          },
          {
            status: 400,
          }
        );
      }

      if (name.length > 100) {
        return NextResponse.json(
          {
            success: false,
            message: "Name is too long",
          },
          {
            status: 400,
          }
        );
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Validate Avatar
    |--------------------------------------------------------------------------
    */

    let avatar: string | null | undefined;

    if (data.avatar !== undefined) {
      if (
        data.avatar !== null &&
        typeof data.avatar !== "string"
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Avatar must be a string or null",
          },
          {
            status: 400,
          }
        );
      }

      avatar =
        data.avatar === null
          ? null
          : data.avatar.trim();

      if (
        typeof avatar === "string" &&
        avatar.length > 2000
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Avatar URL is too long",
          },
          {
            status: 400,
          }
        );
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Build Update Object
    |--------------------------------------------------------------------------
    */

    const updateData: {
      name?: string;
      avatar?: string | null;
    } = {};

    if (name !== undefined) {
      updateData.name = name;
    }

    if (avatar !== undefined) {
      updateData.avatar = avatar;
    }

    /*
    |--------------------------------------------------------------------------
    | No Changes
    |--------------------------------------------------------------------------
    */

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No profile changes supplied",
        },
        {
          status: 400,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Update Profile
    |--------------------------------------------------------------------------
    */

    const user = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
      },
    });

    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("[ADMIN_PROFILE_PATCH]", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update profile",
      },
      {
        status: 500,
      }
    );
  }
}

