"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    fetch("/api/user/balance")
      .then(res => res.json())
      .then(data => setBalance(data.balance));
  }, []);

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        Welcome back 🚀
      </h1>

      {/* 💳 SHOW balance */}
      <p className="mb-4 text-gray-600">
        Balance left: <span className="font-bold">{balance}</span>
      </p>

    </div>
  );
}