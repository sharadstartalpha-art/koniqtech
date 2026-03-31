"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function Pricing() {
  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
      }}
    >
      <div>
        <h1 className="text-3xl font-semibold mb-10">Pricing</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "Starter", price: "19" },
            { name: "Growth", price: "49" },
            { name: "Pro", price: "99" },
          ].map((plan) => (
            <div
              key={plan.name}
              className="p-6 rounded-2xl border shadow-sm bg-white"
            >
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <p className="text-3xl font-bold mt-2">${plan.price}/mo</p>

              <div className="mt-6">
                <PayPalButtons
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [
                        {
                          amount: {
                            value: plan.price,
                          },
                        },
                      ],
                    });
                  }}
                  onApprove={async (data, actions) => {
                    await actions.order?.capture();

                    alert("Payment successful 🎉");

                    // 🔥 TODO: call your API to upgrade user plan
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </PayPalScriptProvider>
  );
}