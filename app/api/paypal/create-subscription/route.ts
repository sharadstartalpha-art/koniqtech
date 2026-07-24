import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/shared/lib/prisma";

import {
  getPayPalAccessToken,
  getPayPalBaseUrl,
  getPayPalPlanId,
} from "@/shared/lib/paypal";

export async function POST(req: NextRequest) {
  try {
    

    const { plan, orgId } = await req.json();

   if (
  !orgId ||
  (plan !== "starter" &&
    plan !== "growth" &&
    plan !== "professional")
) {
  return NextResponse.json(
    {
      message: "Invalid organization or plan.",
    },
    {
      status: 400,
    }
  );
}

   const organization = await prisma.organization.findUnique({
  where: {
     id: orgId,
  },
});

    if (!organization) {
      return NextResponse.json(
        { message: "Organization not found." },
        { status: 404 }
      );
    }

    const accessToken = await getPayPalAccessToken();

    const response = await fetch(
      `${getPayPalBaseUrl()}/v1/billing/subscriptions`,
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          plan_id: getPayPalPlanId(plan),

          custom_id: organization.id,

          application_context: {
            brand_name: "KoniqTech",

            locale: "en-US",

            shipping_preference: "NO_SHIPPING",

            user_action: "SUBSCRIBE_NOW",

            payment_method: {
              payer_selected: "PAYPAL",
              payee_preferred: "IMMEDIATE_PAYMENT_REQUIRED",
            },

           return_url:
           `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?orgId=${organization.id}`,

           cancel_url:
`${process.env.NEXT_PUBLIC_APP_URL}/register/plan?orgId=${organization.id}`,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data);

      return NextResponse.json(
        {
          message: "Unable to create subscription.",
          paypal: data,
        },
        {
          status: 500,
        }
      );
    }

    const approveLink = data.links?.find(
      (link: any) => link.rel === "approve"
    );

    if (!approveLink) {
      return NextResponse.json(
        {
          message: "Approval URL not found.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
  approvalUrl: approveLink.href,
});
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Internal server error.",
      },
      {
        status: 500,
      }
    );
  }
}