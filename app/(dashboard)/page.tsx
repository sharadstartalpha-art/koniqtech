"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    fetch("/api/user/credits")
      .then(res => res.json())
      .then(data => setCredits(data.credits));
  }, []);

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        Welcome back 🚀
      </h1>

      {/* 💳 SHOW CREDITS */}
      <p className="mb-4 text-gray-600">
        Credits left: <span className="font-bold">{credits}</span>
      </p>

    </div>
  );
}