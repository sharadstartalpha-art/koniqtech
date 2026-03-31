"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [credits, setCredits] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/credits")
      .then((res) => res.json())
      .then(setCredits);

    fetch("/api/projects")
      .then((res) => res.json())
      .then(setProjects);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>

      {/* Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <p className="text-gray-500 text-sm">Credits</p>
          <p className="text-3xl font-bold mt-2">
            {credits?.credits ?? "..."}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <p className="text-gray-500 text-sm">Projects</p>
          <p className="text-3xl font-bold mt-2">
            {projects.length}
          </p>
        </div>
      </div>

      {/* CTA */}
      <a
        href="/product/lead-finder"
        className="inline-block bg-black text-white px-6 py-3 rounded-lg mb-6 hover:opacity-90"
      >
        🚀 Start Lead Finder
      </a>

      {/* Projects */}
      {projects.length === 0 ? (
        <p className="text-gray-500">
          No projects yet. Click "Start Lead Finder".
        </p>
      ) : (
        <div className="space-y-4">
          {projects.map((p) => (
            <a
              key={p.id}
              href={`/project/${p.id}`}
              className="block bg-white p-4 rounded-xl shadow-sm border hover:shadow-md"
            >
              <h3 className="font-semibold">{p.name}</h3>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}