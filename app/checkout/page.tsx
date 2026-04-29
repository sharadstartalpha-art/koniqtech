"use client";

export default function Checkout() {
  const subscribe = async () => {
    const res = await fetch("/api/payments/subscribe", {
      method: "POST",
    });

    const data = await res.json();
    window.location.href = data.url;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      <div className="bg-white p-8 rounded-xl shadow max-w-md w-full">

        <h1 className="text-2xl font-bold mb-2 text-center">
          Start Recovering Payments Today
        </h1>

        <p className="text-gray-500 text-center mb-6">
          Get paid faster with automated follow-ups
        </p>

        {/* PRICE */}
        <div className="text-center mb-6">
          <span className="text-4xl font-bold">$29</span>
          <span className="text-gray-500">/month</span>
        </div>

        {/* BENEFITS */}
        <ul className="space-y-3 mb-6 text-sm">
          <li>✔ Unlimited reminders</li>
          <li>✔ AI-powered emails</li>
          <li>✔ Payment tracking</li>
        </ul>

        {/* CTA */}
        <button
          onClick={subscribe}
          className="w-full bg-black text-white py-3 rounded-lg text-lg"
        >
          Start Free Trial
        </button>

        {/* TRUST */}
        <p className="text-xs text-gray-400 text-center mt-4">
          No credit card required • Cancel anytime
        </p>

      </div>

    </div>
  );
}