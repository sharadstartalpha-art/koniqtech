export default function ThanksPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-white px-6">

      <div className="max-w-xl w-full bg-white border border-gray-200 rounded-3xl shadow-2xl p-12 text-center">

        <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-4xl mx-auto mb-6">
          ✓
        </div>

        <h1 className="text-5xl font-bold tracking-tight mb-4">
          Message Sent!
        </h1>

        <p className="text-gray-600 text-lg leading-relaxed mb-10">
          Thank you for contacting KoniqTech.
          Our team will get back to you within 24 hours.
        </p>

        <a
          href="/"
          className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-semibold transition"
        >
          Back to Homepage
        </a>

      </div>
    </div>
  );
}