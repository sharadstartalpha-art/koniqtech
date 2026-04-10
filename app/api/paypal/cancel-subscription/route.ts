export async function POST(req: Request) {
  const { subscriptionId } = await req.json();

  await fetch(
    `https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${subscriptionId}/cancel`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYPAL_ACCESS_TOKEN}`,
      },
    }
  );

  return new Response("Cancelled");
}