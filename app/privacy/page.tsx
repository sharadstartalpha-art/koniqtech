export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#fafaf8]">

      {/* HEADER */}

      <div className="border-b bg-white/80 backdrop-blur sticky top-0 z-20">

        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">

          <a
            href="/"
            className="flex items-center gap-2"
          >
            <div className="bg-orange-500 text-white px-4 py-2 rounded-xl font-semibold shadow-sm">
              KoniqTech
            </div>
          </a>

          <a
            href="/register"
            className="text-sm text-gray-600 hover:text-orange-600 transition"
          >
            Back
          </a>

        </div>

      </div>

      {/* CONTENT */}

      <div className="max-w-4xl mx-auto px-6 py-16">

        {/* HERO */}

        <div className="mb-14">

          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-5">
            Privacy & Data Protection
          </div>

          <h1 className="text-5xl font-bold tracking-tight text-gray-900 leading-tight">
            Privacy Policy
          </h1>

          <p className="mt-5 text-lg text-gray-500 leading-relaxed max-w-3xl">
            Your privacy matters to us.
            This Privacy Policy explains
            how KoniqTech collects,
            stores, uses, and protects
            your information when using
            our invoice recovery platform.
          </p>

          <p className="mt-4 text-sm text-gray-400">
            Last updated: May 2026
          </p>

        </div>

        {/* POLICY */}

        <div className="space-y-10">

          <Section
            title="1. Information We Collect"
            content="
We may collect personal information such as your name, email address, billing details, invoices, customer contact information, and payment-related data necessary to provide our services.
            "
          />

          <Section
            title="2. How We Use Your Information"
            content="
Your information is used to operate the platform, process payments, send invoice reminders, improve user experience, provide customer support, and maintain platform security.
            "
          />

          <Section
            title="3. Email Communications"
            content="
By using KoniqTech, you authorize us to send transactional emails such as login verification, invoices, payment reminders, and system notifications.
            "
          />

          <Section
            title="4. Data Security"
            content="
We implement industry-standard security measures to protect your data against unauthorized access, misuse, or disclosure. However, no online service can guarantee absolute security.
            "
          />

          <Section
            title="5. Payment Processing"
            content="
Payments are securely processed through third-party providers such as PayPal or Stripe. We do not store sensitive card information on our servers.
            "
          />

          <Section
            title="6. Third-Party Services"
            content="
We may use trusted third-party providers for analytics, email delivery, cloud hosting, authentication, and payment processing. These services may process data on our behalf.
            "
          />

          <Section
            title="7. Cookies & Analytics"
            content="
KoniqTech may use cookies and analytics tools to improve performance, understand user behavior, and personalize the experience.
            "
          />

          <Section
            title="8. Data Retention"
            content="
We retain your data only as long as necessary to provide services, comply with legal obligations, resolve disputes, and enforce agreements.
            "
          />

          <Section
            title="9. User Rights"
            content="
You may request access, correction, or deletion of your personal data by contacting support. Certain information may be retained for compliance or security purposes.
            "
          />

          <Section
            title="10. Policy Updates"
            content="
We may update this Privacy Policy periodically. Continued use of the platform after updates constitutes acceptance of the revised policy.
            "
          />

          <Section
            title="11. Contact"
            content="
If you have questions regarding this Privacy Policy or your data, please contact us through the support section inside the platform.
            "
          />

        </div>

        {/* FOOTER */}

        <div className="mt-20 border-t pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <p className="text-sm text-gray-500">
            © 2026 KoniqTech. All rights
            reserved.
          </p>

          <div className="flex items-center gap-5 text-sm">

            <a
              href="/terms"
              className="text-gray-500 hover:text-orange-600 transition"
            >
              Terms of Service
            </a>

            <a
              href="/login"
              className="text-gray-500 hover:text-orange-600 transition"
            >
              Login
            </a>

          </div>

        </div>

      </div>

    </div>
  );
}

/* =========================
   SECTION
========================= */

function Section({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">

      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        {title}
      </h2>

      <p className="text-gray-600 leading-8 whitespace-pre-line">
        {content}
      </p>

    </div>
  );
}