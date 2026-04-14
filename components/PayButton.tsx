"use client";

export default function PayButton({
  amount,
  teamId,
}: {
  amount: number;
  teamId?: string;
}) {
  const handlePay = async () => {
    const res = await fetch("/api/paypal/create-order", {
      method: "POST",
      body: JSON.stringify({ amount, teamId }),
    });

    const data = await res.json();

    window.location.href = data.approveUrl;
  };

  return (
    <button
      onClick={handlePay}
      className="bg-black text-white px-6 py-3 rounded-xl"
    >
      Pay ${amount}
    </button>
  );
}