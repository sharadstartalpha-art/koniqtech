export default function Pricing() {
  const plans = [
    { name: "Starter", price: "$19/mo", leads: "500 leads" },
    { name: "Growth", price: "$49/mo", leads: "2000 leads" },
    { name: "Pro", price: "$99/mo", leads: "5000 leads" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-10">Pricing</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`p-6 rounded-2xl border shadow-sm ${
              plan.name === "Pro"
                ? "border-black scale-105 bg-white"
                : "bg-white"
            }`}
          >
            <h3 className="text-lg font-semibold">{plan.name}</h3>
            <p className="text-3xl font-bold mt-2">{plan.price}</p>
            <p className="text-gray-500 text-sm mt-1">
              {plan.leads}
            </p>

            <button className="mt-6 w-full bg-black text-white py-2 rounded-lg hover:opacity-90">
              Upgrade
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}