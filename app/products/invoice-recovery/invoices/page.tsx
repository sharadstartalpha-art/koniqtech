"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function InvoiceList() {
  const [data, setData] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await axios.get("/api/invoices/list");
    setData(res.data);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Invoices</h1>

      <table className="w-full border">
        <thead>
          <tr>
            <th>Email</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {data.map((i: any) => (
            <tr key={i.id}>
              <td>{i.clientEmail}</td>
              <td>${i.amount}</td>
              <td>{i.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}