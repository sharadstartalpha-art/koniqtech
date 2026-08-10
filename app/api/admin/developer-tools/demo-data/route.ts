import { NextRequest, NextResponse } from "next/server";

import {
  JobStatus,
  LeadStatus,
  Prisma,
  QuoteStatus,
  UserRole,
} from "@prisma/client";

import { auth } from "@/auth";
import { prisma } from "@/shared/lib/prisma";

function unauthorized() {
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

function forbidden() {
  return NextResponse.json(
    {
      success: false,
      message: "Forbidden",
    },
    {
      status: 403,
    }
  );
}

function internalError(error: unknown) {
  console.error(
    "Developer Tools Demo Data",
    error
  );

  return NextResponse.json(
    {
      success: false,
      message: "Internal Server Error",
    },
    {
      status: 500,
    }
  );
}

function validateOrgId(
  orgId: string | null
) {
  if (!orgId?.trim()) {
    return {
      valid: false,
      message:
        "orgId is required.",
    };
  }

  if (orgId.length > 100) {
    return {
      valid: false,
      message:
        "Invalid organization ID.",
    };
  }

  return {
    valid: true,
    message: null,
  };
}

function normalizeTemplate(
  template: unknown
) {
  if (
    typeof template !== "string"
  ) {
    return "organization";
  }

  const value =
    template
      .trim()
      .toLowerCase();

  const allowedTemplates = [
    "roofing",
    "hvac",
    "plumbing",
    "landscaping",
    "cleaning",
    "organization",
  ];

  if (
    !allowedTemplates.includes(
      value
    )
  ) {
    return "organization";
  }

  return value;
}

function handleDatabaseError(
  error: unknown
) {
  if (
    error instanceof
    Prisma.PrismaClientKnownRequestError
  ) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Database operation failed.",
        code: error.code,
      },
      {
        status: 400,
      }
    );
  }

  if (
    error instanceof
    Prisma.PrismaClientValidationError
  ) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Invalid database operation.",
      },
      {
        status: 400,
      }
    );
  }

  return null;
}

export async function GET(
  request: NextRequest
) {
  try {
    const session = await auth();

    if (!session) {
      return unauthorized();
    }

    if (
      session.user.role !==
      UserRole.super_admin
    ) {
      return forbidden();
    }

    const { searchParams } =
      new URL(request.url);

   const orgId =
  searchParams
    .get("orgId")
    ?.trim() ?? "";

const orgValidation =
  validateOrgId(orgId);

if (!orgValidation.valid) {
  return NextResponse.json(
    {
      success: false,
      message:
        orgValidation.message,
    },
    {
      status: 400,
    }
  );
}

    const organization =
      await prisma.organization.findUnique({
        where: {
          id: orgId,
        },

        select: {
          id: true,
          name: true,
          slug: true,
          active: true,
          crmType: true,
          industry: true,
        },
      });

    if (!organization) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Organization not found.",
        },
        {
          status: 404,
        }
      );
    }

    const [
      users,
      leads,
      customers,
      deals,
      jobs,
      pipelines,
      quotes,
      invoices,
    ] =
      await prisma.$transaction([
        prisma.user.count({
          where: {
            orgId,
          },
        }),

        prisma.lead.count({
          where: {
            orgId,
          },
        }),

        prisma.customer.count({
          where: {
            orgId,
          },
        }),

        prisma.deal.count({
          where: {
            orgId,
          },
        }),

        prisma.job.count({
          where: {
            orgId,
          },
        }),

        prisma.pipeline.count({
          where: {
            orgId,
          },
        }),

        prisma.quote.count({
          where: {
            orgId,
          },
        }),

        prisma.invoice.count({
          where: {
            orgId,
          },
        }),
      ]);

    return NextResponse.json(
      {
        success: true,

        data: {
          organization,

          counts: {
            users,
            leads,
            customers,
            deals,
            jobs,
            pipelines,
            quotes,
            invoices,
          },
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return internalError(error);
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    const session = await auth();

    if (!session) {
      return unauthorized();
    }

    if (
      session.user.role !==
      UserRole.super_admin
    ) {
      return forbidden();
    }

    const body =
      await request.json();

    const orgId =
  typeof body?.orgId === "string"
    ? body.orgId.trim()
    : "";

const orgValidation =
  validateOrgId(orgId);

if (!orgValidation.valid) {
  return NextResponse.json(
    {
      success: false,
      message:
        orgValidation.message,
    },
    {
      status: 400,
    }
  );
}

const template =
  normalizeTemplate(
    body?.template
  );

    const organization =
      await prisma.organization.findUnique({
        where: {
          id: orgId,
        },

        select: {
          id: true,
          name: true,
          active: true,
          industry: true,
          crmType: true,
        },
      });

    if (!organization) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Organization not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (!organization.active) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Organization is inactive.",
        },
        {
          status: 400,
        }
      );
    }


const existingDemoPipeline =
  await prisma.pipeline.findFirst({
    where: {
      orgId,

      name:
        "DEMO - Sales Pipeline",
    },

    select: {
      id: true,
    },
  });

if (existingDemoPipeline) {
  return NextResponse.json(
    {
      success: false,

      message:
        "Demo data already exists for this organization. Remove the existing demo data before generating it again.",
    },
    {
      status: 409,
    }
  );
}
    


    const generated =
      await prisma.$transaction(
        
        async (tx) => {

          /*
           * --------------------------------------------------
           * 1. Pipeline
           * --------------------------------------------------
           */

          const pipeline =
            await tx.pipeline.create({
              data: {
                orgId,

                name:
                  "DEMO - Sales Pipeline",
              },
            });

          const stageNames = [
            "New",
            "Qualified",
            "Proposal",
            "Won",
          ];

          const stages = [];

          for (
            let index = 0;
            index <
              stageNames.length;
            index++
          ) {
            const stage =
              await tx.pipelineStage.create({
                data: {
                  pipelineId:
                    pipeline.id,

                  name:
                    stageNames[index],

                  position:
                    index,
                },
              });

            stages.push(stage);
          }

          /*
           * --------------------------------------------------
           * 2. Customers
           * --------------------------------------------------
           */

          const customers = [];

          for (
            let index = 1;
            index <= 15;
            index++
          ) {
            const customer =
              await tx.customer.create({
                data: {
                  orgId,

                  companyName:
                    `DEMO Customer ${index}`,

                  firstName:
                    `Demo${index}`,

                  lastName:
                    "Customer",

                  email:
                    `demo.customer.${index}.${orgId.slice(
                      0,
                      8
                    )}@example.com`,

                  phone:
                    `555-010-${String(
                      index
                    ).padStart(
                      2,
                      "0"
                    )}`,

                  address:
                    `${100 + index} Demo Street`,

                  city:
                    "Demo City",

                  state:
                    "CA",

                  zip:
                    "90001",

                  notes:
                    "DEMO-DATA",
                },
              });

            customers.push(customer);
          }

          /*
           * --------------------------------------------------
           * 3. Leads
           * --------------------------------------------------
           */

          const leads = [];

          for (
            let index = 1;
            index <= 20;
            index++
          ) {
            const lead =
              await tx.lead.create({
                data: {
                  orgId,

                  source:
                    "DEMO-DATA",

                  firstName:
                    `Demo Lead ${index}`,

                  lastName:
                    "Prospect",

                  phone:
                    `555-020-${String(
                      index
                    ).padStart(
                      2,
                      "0"
                    )}`,

                  email:
                    `demo.lead.${index}.${orgId.slice(
                      0,
                      8
                    )}@example.com`,

                  companyName:
                    `DEMO Prospect ${index}`,

                  address:
                    `${200 + index} Prospect Avenue`,

                  budget:
                    5000 +
                    index * 1000,

                  priority:
                    index % 3 === 0
                      ? "High"
                      : "Medium",

                  tags:
                    "demo",

                  industry:
                    organization.industry ??
                    undefined,

                  status:
                    index % 5 === 0
                      ? LeadStatus.won
                      : index % 3 === 0
                      ? LeadStatus.contacted
                      : LeadStatus.new,
                },
              });

            leads.push(lead);
          }

          /*
           * --------------------------------------------------
           * 4. Deals
           * --------------------------------------------------
           */

          const deals = [];

          for (
            let index = 1;
            index <= 10;
            index++
          ) {
            const customer =
              customers[
                (index - 1) %
                  customers.length
              ];

            const stage =
              stages[
                (index - 1) %
                  stages.length
              ];

            const deal =
              await tx.deal.create({
                data: {
                  orgId,

                  customerId:
                    customer.id,

                  stageId:
                    stage.id,

                  title:
                    `DEMO Deal ${index}`,

                  value:
                    new Prisma.Decimal(
                      5000 +
                        index * 2500
                    ),

                  probability:
                    25 +
                    (index % 4) * 20,

                  expectedClose:
                    new Date(
                      Date.now() +
                        index *
                          7 *
                          24 *
                          60 *
                          60 *
                          1000
                    ),
                },
              });

            deals.push(deal);
          }

          /*
           * --------------------------------------------------
           * 5. Quotes
           * --------------------------------------------------
           */

          const quotes = [];

          for (
            let index = 1;
            index <= 8;
            index++
          ) {
            const customer =
              customers[
                (index - 1) %
                  customers.length
              ];

            const subtotal =
              new Prisma.Decimal(
                3000 +
                  index * 750
              );

            const tax =
              subtotal.mul(
                new Prisma.Decimal(
                  "0.08"
                )
              );

            const total =
              subtotal.add(tax);

            const quote =
              await tx.quote.create({
                data: {
                  orgId,

                  customerId:
                    customer.id,

                  quoteNumber:
                    `DEMO-Q-${Date.now()}-${index}`,

                  subtotal,

                  tax,

                  total,

                  status:
                    index % 4 === 0
                      ? QuoteStatus.approved
                      : index % 3 === 0
                      ? QuoteStatus.sent
                      : QuoteStatus.draft,

                  validUntil:
                    new Date(
                      Date.now() +
                        30 *
                          24 *
                          60 *
                          60 *
                          1000
                    ),

                  items: {
                    create: [
                      {
                        itemName:
                          `${template.toUpperCase()} Service`,
                        qty: 1,
                        price:
                          subtotal,
                        total:
                          subtotal,
                      },
                    ],
                  },
                },
              });

            quotes.push(quote);
          }

          /*
           * --------------------------------------------------
           * 6. Jobs
           * --------------------------------------------------
           */

          const jobs = [];

          for (
            let index = 1;
            index <= 10;
            index++
          ) {
            const customer =
              customers[
                (index - 1) %
                  customers.length
              ];

            const quote =
              quotes[
                (index - 1) %
                  quotes.length
              ];

            const job =
              await tx.job.create({
                data: {
                  orgId,

                  customerId:
                    customer.id,

                  quoteId:
                    quote.id,

                  title:
                    `DEMO ${template.toUpperCase()} Job ${index}`,

                  status:
                    index % 4 === 0
                      ? JobStatus.completed
                      : index % 3 === 0
                      ? JobStatus.in_progress
                      : JobStatus.scheduled,

                  scheduledDate:
                    new Date(
                      Date.now() +
                        index *
                          24 *
                          60 *
                          60 *
                          1000
                    ),

                  completedDate:
                    index % 4 === 0
                      ? new Date()
                      : null,

                  notes:
                    "DEMO-DATA",
                },
              });

            jobs.push(job);
          }

          /*
           * --------------------------------------------------
           * 7. Invoices
           * --------------------------------------------------
           */

          const invoices = [];

          for (
            let index = 1;
            index <= 10;
            index++
          ) {
            const customer =
              customers[
                (index - 1) %
                  customers.length
              ];

            const job =
              jobs[
                (index - 1) %
                  jobs.length
              ];

            const subtotal =
              new Prisma.Decimal(
                2500 +
                  index * 500
              );

            const tax =
              subtotal.mul(
                new Prisma.Decimal(
                  "0.08"
                )
              );

            const total =
              subtotal.add(tax);

            const paid =
              index % 3 === 0;

            await tx.invoice.create({
              data: {
                orgId,

                customerId:
                  customer.id,

                jobId:
                  job.id,

                invoiceNumber:
                  `DEMO-INV-${Date.now()}-${index}`,

                subtotal,

                tax,

                total,

                status:
                  paid
                    ? "paid"
                    : "sent",

                dueDate:
                  new Date(
                    Date.now() +
                      30 *
                        24 *
                        60 *
                        60 *
                        1000
                  ),

                sentAt:
                  new Date(),

                paidAt:
                  paid
                    ? new Date()
                    : null,
              },
            });

            invoices.push(true);
          }

          return {
            pipeline: 1,

            pipelineStages:
              stages.length,

            customers:
              customers.length,

            leads:
              leads.length,

            deals:
              deals.length,

            quotes:
              quotes.length,

            jobs:
              jobs.length,

            invoices:
              invoices.length,
          };
        }
      );

    return NextResponse.json(
      {
        success: true,

        message:
          "Demo data generated successfully.",

        data: {
          organizationId:
            orgId,

          organization:
            organization.name,

          template,

          generated,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
  console.error(
    "Generate Demo Data Error",
    error
  );

  const databaseError =
    handleDatabaseError(
      error
    );

  if (databaseError) {
    return databaseError;
  }

  return internalError(
    error
  );
}
}

export async function DELETE(
  request: NextRequest
) {
  try {
    const session = await auth();

    if (!session) {
      return unauthorized();
    }

    if (
      session.user.role !==
      UserRole.super_admin
    ) {
      return forbidden();
    }

    const { searchParams } =
      new URL(request.url);

   const orgId =
  searchParams
    .get("orgId")
    ?.trim() ?? "";

const orgValidation =
  validateOrgId(orgId);

if (!orgValidation.valid) {
  return NextResponse.json(
    {
      success: false,
      message:
        orgValidation.message,
    },
    {
      status: 400,
    }
  );
}

    const organization =
      await prisma.organization.findUnique({
        where: {
          id: orgId,
        },

        select: {
          id: true,
          name: true,
        },
      });

    if (!organization) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Organization not found.",
        },
        {
          status: 404,
        }
      );
    }




    const demoPipeline =
  await prisma.pipeline.findFirst({
    where: {
      orgId,

      name:
        "DEMO - Sales Pipeline",
    },

    select: {
      id: true,
    },
  });

if (!demoPipeline) {
  return NextResponse.json(
    {
      success: true,

      message:
        "No demo data found for this organization.",

      data: {
        organizationId:
          orgId,

        deleted: {
          invoices: 0,
          jobs: 0,
          quoteItems: 0,
          quotes: 0,
          deals: 0,
          leads: 0,
          customers: 0,
          pipelineStages: 0,
          pipelines: 0,
        },
      },
    },
    {
      status: 200,
    }
  );
}




    const deleted =
      await prisma.$transaction(
        async (tx) => {
          /*
           * --------------------------------------------------
           * 1. Find demo customers
           * --------------------------------------------------
           */

          const demoCustomers =
            await tx.customer.findMany({
              where: {
                orgId,

                notes: "DEMO-DATA",
              },

              select: {
                id: true,
              },
            });

          const customerIds =
            demoCustomers.map(
              (customer) =>
                customer.id
            );

          /*
           * --------------------------------------------------
           * 2. Delete invoices
           * --------------------------------------------------
           */

          const invoices =
            await tx.invoice.deleteMany({
              where: {
                orgId,

                invoiceNumber: {
                  startsWith:
                    "DEMO-INV-",
                },
              },
            });

          /*
           * --------------------------------------------------
           * 3. Delete jobs
           * --------------------------------------------------
           */

          const jobs =
            await tx.job.deleteMany({
              where: {
                orgId,

                notes: "DEMO-DATA",
              },
            });

          /*
           * --------------------------------------------------
           * 4. Delete quote items
           * --------------------------------------------------
           *
           * Quote items belong to the demo quotes.
           */

          const demoQuotes =
            await tx.quote.findMany({
              where: {
                orgId,

                quoteNumber: {
                  startsWith:
                    "DEMO-Q-",
                },
              },

              select: {
                id: true,
              },
            });

          const quoteIds =
            demoQuotes.map(
              (quote) =>
                quote.id
            );

          const quoteItems =
            quoteIds.length > 0
              ? await tx.quoteItem.deleteMany({
                  where: {
                    quoteId: {
                      in: quoteIds,
                    },
                  },
                })
              : { count: 0 };

          /*
           * --------------------------------------------------
           * 5. Delete quotes
           * --------------------------------------------------
           */

          const quotes =
            await tx.quote.deleteMany({
              where: {
                orgId,

                quoteNumber: {
                  startsWith:
                    "DEMO-Q-",
                },
              },
            });

          /*
           * --------------------------------------------------
           * 6. Delete deals
           * --------------------------------------------------
           */

          const deals =
            await tx.deal.deleteMany({
              where: {
                orgId,

                title: {
                  startsWith:
                    "DEMO Deal",
                },
              },
            });

          /*
           * --------------------------------------------------
           * 7. Delete leads
           * --------------------------------------------------
           */

          const leads =
            await tx.lead.deleteMany({
              where: {
                orgId,

                source: "DEMO-DATA",
              },
            });

          /*
           * --------------------------------------------------
           * 8. Delete customers
           * --------------------------------------------------
           */

          const customers =
            customerIds.length > 0
              ? await tx.customer.deleteMany({
                  where: {
                    orgId,

                    id: {
                      in: customerIds,
                    },
                  },
                })
              : { count: 0 };

          /*
           * --------------------------------------------------
           * 9. Delete demo pipeline
           * --------------------------------------------------
           *
           * Deals are already removed above.
           * Pipeline stages can therefore be removed safely.
           */

          const demoPipelines =
            await tx.pipeline.findMany({
              where: {
                orgId,

                name:
                  "DEMO - Sales Pipeline",
              },

              select: {
                id: true,
              },
            });

          const pipelineIds =
            demoPipelines.map(
              (pipeline) =>
                pipeline.id
            );

          const stages =
            pipelineIds.length > 0
              ? await tx.pipelineStage.deleteMany({
                  where: {
                    pipelineId: {
                      in: pipelineIds,
                    },
                  },
                })
              : { count: 0 };

          const pipelines =
            await tx.pipeline.deleteMany({
              where: {
                orgId,

                name:
                  "DEMO - Sales Pipeline",
              },
            });

          return {
            invoices:
              invoices.count,

            jobs:
              jobs.count,

            quoteItems:
              quoteItems.count,

            quotes:
              quotes.count,

            deals:
              deals.count,

            leads:
              leads.count,

            customers:
              customers.count,

            pipelineStages:
              stages.count,

            pipelines:
              pipelines.count,
          };
        }
      );

    return NextResponse.json(
      {
        success: true,

        message:
          "Demo data removed successfully.",

        data: {
          organizationId:
            orgId,

          organization:
            organization.name,

          deleted,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
  console.error(
    "Delete Demo Data Error",
    error
  );

  const databaseError =
    handleDatabaseError(
      error
    );

  if (databaseError) {
    return databaseError;
  }

  return internalError(
    error
  );
}
}