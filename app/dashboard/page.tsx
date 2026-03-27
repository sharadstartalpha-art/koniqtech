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
      <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500 text-sm">Credits</p>
          <p className="text-2xl font-bold">
            {credits?.credits ?? "..."}
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500 text-sm">Projects</p>
          <p className="text-2xl font-bold">
            {projects.length}
          </p>
        </div>
      </div>

      {/* CTA */}
      <a
        href="/product/lead-finder"
        className="inline-block bg-black text-white px-6 py-3 rounded mb-6"
      >
        🚀 Start Lead Finder
      </a>

      {/* Projects */}
      <div className="space-y-4">
        {projects.map((p) => (
          <a
            key={p.id}
            href={`/project/${p.id}`}
            className="block bg-white p-4 rounded shadow hover:shadow-md"
          >
            <h3 className="font-semibold">{p.name}</h3>
          </a>
        ))}
      </div>
    </div>
  );
}