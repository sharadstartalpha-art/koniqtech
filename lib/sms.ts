import Twilio from "twilio";

const client = Twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export async function sendSMS({
  to,
  body,
}: {
  to: string;
  body: string;
}) {
  return await client.messages.create({
    from:
      process.env
        .TWILIO_PHONE_NUMBER!,

    to,

    body,
  });
}