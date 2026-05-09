import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { getUser } from "@/lib/auth";

/* =========================
   GET USER AUTOMATION
========================= */

export async function GET() {
  try {
    const user = await getUser();

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

    const workflows =
      await prisma.reminderSchedule.findMany({
        where: {
          userId: user.id,
        },

        include: {
          template: true,
          invoice: true,
        },

        orderBy: {
          step: "asc",
        },
      });

    return NextResponse.json(workflows);

  } catch (error) {
    console.error(
      "AUTOMATION GET ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to load workflows",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================
   CREATE AUTOMATION
========================= */

export async function POST(
  req: Request
) {
  try {
    const user = await getUser();

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

    const body = await req.json();

    const {
      invoiceId,
      workflows,
    } = body;

    if (!invoiceId) {
      return NextResponse.json(
        {
          error: "Invoice required",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Array.isArray(workflows)
    ) {
      return NextResponse.json(
        {
          error: "Invalid workflow",
        },
        {
          status: 400,
        }
      );
    }

    /* =========================
       DELETE OLD WORKFLOW
    ========================= */

    await prisma.reminderSchedule.deleteMany(
      {
        where: {
          invoiceId,
          userId: user.id,
        },
      }
    );

    /* =========================
       CREATE NEW STEPS
    ========================= */

    const created = [];

    for (
      let i = 0;
      i < workflows.length;
      i++
    ) {
      const step =
        workflows[i];

      const sendDate =
        new Date();

      sendDate.setDate(
        sendDate.getDate() +
          Number(step.delay || 0)
      );

      const createdStep =
        await prisma.reminderSchedule.create(
          {
            data: {
              userId:
                user.id,

              invoiceId,

              templateId:
                step.templateId,

              step:
                Number(
                  step.step ||
                    i + 1
                ),

              amount:
                Number(
                  step.amount || 0
                ),

              type:
                step.type,

              mode: "auto",

              status:
                "pending",

              sendAt:
                sendDate,
            },
          }
        );

      created.push(
        createdStep
      );
    }

    return NextResponse.json({
      success: true,
      workflows: created,
    });

  } catch (error) {
    console.error(
      "AUTOMATION CREATE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to create workflow",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================
   DELETE WORKFLOW
========================= */

export async function DELETE(
  req: Request
) {
  try {
    const user = await getUser();

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

    const { searchParams } =
      new URL(req.url);

    const invoiceId =
      searchParams.get(
        "invoiceId"
      );

    if (!invoiceId) {
      return NextResponse.json(
        {
          error:
            "Invoice required",
        },
        {
          status: 400,
        }
      );
    }

    await prisma.reminderSchedule.deleteMany(
      {
        where: {
          invoiceId,
          userId: user.id,
        },
      }
    );

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error(
      "AUTOMATION DELETE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to delete workflow",
      },
      {
        status: 500,
      }
    );
  }
}