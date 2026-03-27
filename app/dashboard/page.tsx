"use client";

import { useState, useEffect } from "react";

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
    <div className="p-6">
      <h1 className="text-xl font-bold">Dashboard</h1>

      {/* Credits */}
      <p className="mt-2 text-gray-600">
        Credits: {credits?.credits ?? "Loading..."}
      </p>

      {/* CTA */}
      <a
        href="/product/lead-finder"
        className="mt-6 inline-block bg-black text-white px-6 py-3 rounded"
      >
        🚀 Start Lead Finder
      </a>

      {/* Projects */}
      {projects.map((project) => (
        <a
          key={project.id}
          href={`/project/${project.id}`}
          className="block border p-4 rounded mt-4 hover:bg-gray-50"
        >
          <h3 className="font-semibold">{project.name}</h3>
        </a>
      ))}

      {/* Empty state */}
      {projects.length === 0 && (
        <p className="mt-6 text-gray-500">
          No projects yet. Click "Start Lead Finder".
        </p>
      )}
    </div>
  );
}