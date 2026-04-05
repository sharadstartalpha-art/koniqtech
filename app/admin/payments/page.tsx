"use client";

import { useEffect, useState } from "react";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/payments")
      .then(res => res.json())
      .then(setPayments);
  }, []);
fetch("/api/admin/payments")
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Payments</h1>

      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="border-b">
            <th className="p-2">User</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Credits</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>

        <tbody>
          {payments.map((p) => (
            <tr key={p.id} className="border-b">
              <td className="p-2">{p.user.email}</td>
              <td className="p-2">${p.amount}</td>
              <td className="p-2">{p.credits}</td>
              <td className="p-2">{p.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}