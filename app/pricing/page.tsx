const upgrade = async (plan: string) => {
  const res = await fetch("/api/stripe/checkout", {
    method: "POST",
    body: JSON.stringify({ plan }),
  });

  const data = await res.json();

  window.location.href = data.url;
};



const upgradeStarter = () => {
  window.location.href = "https://paypal.me/sharad/19";
};

<button
  onClick={upgradeStarter}
  className="bg-blue-600 text-white px-4 py-2 rounded"
>
  Pay with PayPal
</button>

export default function PricingPage() {
  return (
    <div className="p-10 space-y-6">
      <h1 className="text-3xl font-bold">Pricing</h1>

      <div className="grid grid-cols-3 gap-6">
        <Plan
          name="Starter"
          price="$19"
          credits="500 leads"
        />
        <Plan
          name="Growth"
          price="$49"
          credits="2000 leads"
        />
        <Plan
          name="Pro"
          price="$99"
          credits="5000 leads"
        />
      </div>
    </div>
  );
}

function Plan({ name, price, credits }: any) {
  return (
    <div className="border p-6 rounded">
      <h2 className="text-xl font-bold">{name}</h2>
      <p className="text-2xl">{price}/mo</p>
      <p>{credits}</p>

      <button className="mt-4 bg-black text-white px-4 py-2 rounded">
        Upgrade
      </button>
    </div>
  );
}