import Imap from "imap";
import { simpleParser } from "mailparser";
import { prisma } from "./prisma";

export function startInboxListener() {
  const imap = new Imap({
    user: process.env.EMAIL_USER!,
    password: process.env.EMAIL_PASS!,
    host: "mail.koniqtech.com",
    port: 993,
    tls: true,
    authTimeout: 10000,

    // ⚠️ remove in production if not needed
    tlsOptions: {
      rejectUnauthorized: false,
    },
  });

  // 🔁 Queue system (prevents overload)
  let processing = false;
  const queue: any[] = [];

  function processQueue() {
    if (processing || queue.length === 0) return;

    processing = true;
    const stream = queue.shift();

    handleEmail(stream)
      .catch(console.error)
      .finally(() => {
        processing = false;
        processQueue();
      });
  }

  async function handleEmail(stream: any) {
    try {
      const parsed = await simpleParser(stream);

      const fromEmail = parsed.from?.value?.[0]?.address || "";
      const subject = parsed.subject || "";
      const inReplyTo = parsed.inReplyTo;

      if (!fromEmail) return;

      // 🚫 FILTER spam/system emails
      if (
        fromEmail.includes("noreply") ||
        fromEmail.includes("no-reply") ||
        fromEmail.includes("mailer") ||
        fromEmail.includes("notifications") ||
        fromEmail.includes("support") ||
        fromEmail.includes("stripe") ||
        fromEmail.includes("vercel") ||
        fromEmail.includes("upstash") ||
        fromEmail.includes("hostinger") ||
        fromEmail.includes("google")
      ) {
        return;
      }

      // ✅ Detect reply (better than just "Re:")
      const isReply =
        !!inReplyTo || subject.toLowerCase().startsWith("re:");

      if (!isReply) return;

      console.log("💬 Reply from:", fromEmail);

      // 🔍 Match campaign recipient
      const recipient = await prisma.campaignRecipient.findFirst({
        where: { email: fromEmail },
      });

      if (!recipient) {
        console.log("⛔ Not a campaign contact:", fromEmail);
        return;
      }

      // 🚫 Skip already handled
      if (recipient.status === "REPLIED") return;

      // ✅ Update DB
      await prisma.campaignRecipient.update({
        where: { id: recipient.id },
        data: {
          status: "REPLIED",
          repliedAt: new Date(),
        },
      });

      console.log("✅ Marked REPLIED:", fromEmail);
    } catch (err) {
      console.error("❌ Parse error:", err);
    }
  }

  function fetchEmails() {
    imap.search(["UNSEEN"], (err, results) => {
      if (err) {
        console.error("❌ Search error:", err);
        return;
      }

      if (!results || results.length === 0) return;

      // 🔥 Limit emails (avoid overload)
      const latest = results.slice(-20);

      const fetch = imap.fetch(latest, { bodies: "" });

      fetch.on("message", (msg: any) => {
        msg.on("body", (stream: any) => {
          queue.push(stream);
          processQueue();
        });
      });

      fetch.on("error", (err: any) => {
        console.error("❌ Fetch error:", err);
      });
    });
  }

  imap.once("ready", () => {
    imap.openBox("INBOX", false, (err) => {
      if (err) {
        console.error("❌ Inbox open error:", err);
        return;
      }

      console.log("📬 Inbox ready");

      // 🔥 Initial fetch
      fetchEmails();

      // 🔥 Listen for new emails
      imap.on("mail", () => {
        console.log("📩 New mail detected");
        fetchEmails();
      });
    });
  });

  imap.once("error", (err: any) => {
    console.error("❌ IMAP Error:", err);
  });

  imap.once("end", () => {
    console.log("🔌 IMAP disconnected");
  });

  imap.connect();
}