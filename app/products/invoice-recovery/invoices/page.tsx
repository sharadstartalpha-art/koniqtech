"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout"; // ✅ IMPORTANT

export default function InvoiceListPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await axios.get("/api/invoices/list");
    setData(res.data);
  };

  return (
    <Layout> {/* ✅ WRAP EVERYTHING */}
      <div className="p-6">
        <h1 className="text-xl mb-4">Invoices</h1>

        <table className="w-full border bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {data.map((i: any) => (
              <tr key={i.id} className="border-t">
                <td className="p-2">{i.clientEmail}</td>
                <td className="p-2">${i.amount}</td>
                <td className="p-2">
                  <span
                    className={
                      i.status === "paid"
                        ? "text-green-600"
                        : "text-red-500"
                    }
                  >
                    {i.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}