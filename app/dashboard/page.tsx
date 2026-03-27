"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [credits, setCredits] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/credits").then(res => res.json()).then(setCredits);
    fetch("/api/projects").then(res => res.json()).then(setProjects);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <p className="mb-4">
        Credits: {credits?.credits ?? "Loading..."}
      </p>

      <a
        href="/product/lead-finder"
        className="bg-black text-white px-4 py-2 rounded"
      >
        🚀 Start Lead Finder
      </a>

      <div className="mt-6 space-y-3">
        {projects.map((p) => (
          <a
            key={p.id}
            href={`/project/${p.id}`}
            className="block border p-4 rounded hover:bg-gray-100"
          >
            {p.name}
          </a>
        ))}
      </div>
    </div>
  );
}