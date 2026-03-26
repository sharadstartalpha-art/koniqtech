"use client";

import { useState, useEffect } from "react";

export default function Dashboard() {
  const [credits, setCredits] = useState<any>(null);

  useEffect(() => {
    fetch("/api/credits")
      .then((res) => res.json())
      .then(setCredits);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Dashboard</h1>

      <p className="text-sm text-gray-600">
        Credits left: {credits?.credits ?? "..."}
      </p>
    </div>
  );
}