"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function SubscribePage() {
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    axios.get("/api/products").then((res) => {
      setPlans(res.data);
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">

      <h1 className="text-xl font-semibold mb-6">
        Choose a plan
      </h1>

      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-sm font-medium mb-4">
          Plans
        </h2>

        <div className="grid grid-cols-3 gap-4">
          {plans.map((p) => (
            <div key={p.id} className="border rounded-md p-4">

              <h3 className="font-medium">{p.name}</h3>

              <p className="text-sm text-gray-500">
                ${p.price}/mo
              </p>

              <p className="text-xs text-gray-400 mt-2">
                {p.invoiceLimit ?? "Unlimited"} invoices
              </p>

              <button className="mt-4 w-full bg-black text-white text-sm py-2 rounded-md">
                Subscribe
              </button>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}