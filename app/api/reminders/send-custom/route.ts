import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const { email, content } = await req.json();

  if (!email || !content) {
    return new Response("Missing fields", { status: 400 });
  }

  /* =========================
     🔄 CONVERT HTML → TEXT
  ========================= */
  const textContent = content
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "");

  /* =========================
     📧 MAILER
  ========================= */
  const transporter = nodemailer.createTransport({
    service: "gmail", // or your SMTP
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"KoniqTech" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Invoice Reminder",
    text: textContent,   // ✅ TEXT
    html: content,       // ✅ HTML
  });

  return Response.json({ success: true });
}