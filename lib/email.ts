import { Resend } from "resend";

/* ============================= */
/* RESEND CLIENT                 */
/* ============================= */
export const resend = new Resend(process.env.RESEND_API_KEY);

/* ============================= */
/* GENERIC EMAIL SENDER          */
/* ============================= */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  return resend.emails.send({
    from: "KoniqTech <noreply@koniqtech.com>",
    to,
    subject,
    html,
  });
}

/* ============================= */
/* INVITE EMAIL                  */
/* ============================= */
export async function sendInviteEmail(email: string, link: string) {
  return sendEmail({
    to: email,
    subject: "You're invited to join a team 🚀",
    html: `
      <h2>You’ve been invited!</h2>
      <p>Click below to join the team:</p>
      <a href="${link}" 
         style="padding:10px 20px;background:black;color:white;text-decoration:none;border-radius:5px;">
        Accept Invite
      </a>
    `,
  });
}

/* ============================= */
/* EMAIL PATTERN GENERATOR       */
/* ============================= */
export function generateEmailPatterns(
  first: string,
  last: string,
  domain: string
): string[] {
  if (!first || !last || !domain) return [];

  const f = first.toLowerCase();
  const l = last.toLowerCase();

  return [
    `${f}@${domain}`,
    `${f}.${l}@${domain}`,
    `${f}${l}@${domain}`,
    `${f[0]}${l}@${domain}`,
    `${f}${l[0]}@${domain}`,
  ];
}