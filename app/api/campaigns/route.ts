// app/api/campaigns/route.ts

import { prisma } from "@/lib/prisma";

import { getUser } from "@/lib/auth";

import { NextResponse } from "next/server";

/* =========================================
   GET CAMPAIGNS
========================================= */

export async function GET() {

  try {

    const user =
      await getUser();

    if (!user) {

      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const campaigns =
      await prisma.campaign.findMany({

        where: {
          userId: user.id,
        },

        orderBy: {
          createdAt: "desc",
        },

        take: 100,
      });

    /* =========================================
       STATS
    ========================================= */

    const total =
      campaigns.length;

    const sent =
      campaigns.filter(
        (c: any) =>
          c.status === "sent"
      ).length;

    const pending =
      campaigns.filter(
        (c: any) =>
          c.status === "pending"
      ).length;

    const failed =
      campaigns.filter(
        (c: any) =>
          c.status === "failed"
      ).length;

    return NextResponse.json({

      success: true,

      campaigns,

      stats: {
        total,
        sent,
        pending,
        failed,
      },
    });

  } catch (err) {

    console.error(
      "CAMPAIGN GET ERROR:",
      err
    );

    return NextResponse.json(
      {
        error:
          "Failed to load campaigns",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================
   CREATE CAMPAIGN
========================================= */

export async function POST(
  req: Request
) {

  try {

    const user =
      await getUser();

    if (!user) {

      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const body =
      await req.json();

    const {
      name,
      channel,
      message,
      scheduleDate,
    } = body;

    if (
      !name ||
      !channel ||
      !message
    ) {

      return NextResponse.json(
        {
          error:
            "Missing required fields",
        },
        {
          status: 400,
        }
      );
    }

    /* =========================================
       CREATE CAMPAIGN
    ========================================= */

    const campaign =
      await prisma.campaign.create({

        data: {

          userId:
            user.id,

          name,

          channel,

          message,

          status:
            scheduleDate
              ? "pending"
              : "sent",

          scheduleDate:
            scheduleDate
              ? new Date(
                  scheduleDate
                )
              : null,
        },
      });

    console.log(
      "🚀 Campaign created:",
      campaign.name
    );

    return NextResponse.json({

      success: true,

      campaign,
    });

  } catch (err) {

    console.error(
      "CAMPAIGN CREATE ERROR:",
      err
    );

    return NextResponse.json(
      {
        error:
          "Failed to create campaign",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================
   DELETE CAMPAIGN
========================================= */

export async function DELETE(
  req: Request
) {

  try {

    const user =
      await getUser();

    if (!user) {

      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const {
      searchParams,
    } = new URL(req.url);

    const id =
      searchParams.get("id");

    if (!id) {

      return NextResponse.json(
        {
          error:
            "Campaign ID required",
        },
        {
          status: 400,
        }
      );
    }

    await prisma.campaign.delete({

      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
    });

  } catch (err) {

    console.error(
      "CAMPAIGN DELETE ERROR:",
      err
    );

    return NextResponse.json(
      {
        error:
          "Failed to delete campaign",
      },
      {
        status: 500,
      }
    );
  }
}