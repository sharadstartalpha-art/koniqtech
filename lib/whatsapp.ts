import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export async function sendWhatsApp({
  to,
  body,
}: {
  to: string;
  body: string;
}) {

  return client.messages.create({
    body,

    from:
      `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,

    to:
      `whatsapp:${to}`,
  });
}