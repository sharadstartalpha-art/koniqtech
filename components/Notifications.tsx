"use client";

import { useEffect, useState } from "react";

export default function Notifications() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <div className="border rounded-xl p-4">
      <h2 className="font-semibold mb-3">Notifications 🔔</h2>

      {data.map((n) => (
        <div key={n.id} className="text-sm border-b py-2">
          {n.message}
        </div>
      ))}
    </div>
  );
}