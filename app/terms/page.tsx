export default function TermsPage() {
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

        {/* TITLE */}

        <div className="mb-14">

          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-5">
            Terms & Conditions
          </div>

          <h1 className="text-5xl font-bold tracking-tight text-gray-900 leading-tight">
            Terms of Service
          </h1>

          <p className="mt-5 text-lg text-gray-500 leading-relaxed max-w-3xl">
            These Terms govern your use of
            KoniqTech invoice recovery and
            reminder automation services.
            By creating an account, you
            agree to these terms.
          </p>

          <p className="mt-4 text-sm text-gray-400">
            Last updated: May 2026
          </p>

        </div>

        {/* BODY */}

        <div className="space-y-10">

          <Section
            title="1. Acceptance of Terms"
            content="
By accessing or using KoniqTech, you agree to comply with these Terms of Service and all applicable laws and regulations. If you do not agree, you may not use the platform.
            "
          />

          <Section
            title="2. Platform Usage"
            content="
KoniqTech provides invoice recovery tools, automated reminders, payment links, analytics, and related business automation services. Users are responsible for ensuring that all invoices and communications sent through the platform are lawful and accurate.
            "
          />

          <Section
            title="3. User Responsibilities"
            content="
You are responsible for maintaining the confidentiality of your account credentials and for all activity occurring under your account. You agree not to misuse the platform, spam recipients, or engage in fraudulent activity.
            "
          />

          <Section
            title="4. Subscription & Billing"
            content="
Certain features require a paid subscription. Subscription fees are billed according to your selected plan. Payments are non-refundable unless otherwise required by law.
            "
          />

          <Section
            title="5. Email Delivery"
            content="
KoniqTech attempts to maximize reminder delivery rates but does not guarantee email delivery to all recipients. Delivery may depend on recipient mail servers, spam filters, and third-party infrastructure.
            "
          />

          <Section
            title="6. Data & Privacy"
            content="
We process user data in accordance with our Privacy Policy. By using the platform, you consent to the collection and processing of information necessary to operate the service.
            "
          />

          <Section
            title="7. Service Availability"
            content="
We may modify, suspend, or discontinue parts of the platform at any time. While we strive for high uptime, uninterrupted service is not guaranteed.
            "
          />

          <Section
            title="8. Account Suspension"
            content="
We reserve the right to suspend or terminate accounts that violate these Terms, abuse the platform, or engage in harmful or illegal activities.
            "
          />

          <Section
            title="9. Limitation of Liability"
            content="
KoniqTech shall not be liable for indirect, incidental, or consequential damages arising from the use or inability to use the platform.
            "
          />

          <Section
            title="10. Contact"
            content="
If you have questions regarding these Terms, you may contact us through the support section inside the platform.
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
              href="/privacy"
              className="text-gray-500 hover:text-orange-600 transition"
            >
              Privacy Policy
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