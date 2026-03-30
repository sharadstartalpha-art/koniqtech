"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [credits, setCredits] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
<<<<<<< HEAD
    fetch("/api/credits").then(res => res.json()).then(setCredits);
    fetch("/api/projects").then(res => res.json()).then(setProjects);
=======
    fetch("/api/credits")
      .then((res) => res.json())
      .then(setCredits);

    fetch("/api/projects")
      .then((res) => res.json())
      .then(setProjects);
>>>>>>> 80ecb59 (fix tailwind + layout)
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>

<<<<<<< HEAD
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
=======
      {/* Credits */}
      <p className="mt-2 text-gray-600">
        Credits: {credits?.credits ?? "Loading..."}
      </p>
>>>>>>> 80ecb59 (fix tailwind + layout)

      {/* CTA */}
      <a
        href="/product/lead-finder"
<<<<<<< HEAD
        className="inline-block bg-black text-white px-6 py-3 rounded mb-6"
=======
        className="mt-6 inline-block bg-black text-white px-6 py-3 rounded"
>>>>>>> 80ecb59 (fix tailwind + layout)
      >
        🚀 Start Lead Finder
      </a>

      {/* Projects */}
<<<<<<< HEAD
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
=======
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
>>>>>>> 80ecb59 (fix tailwind + layout)
    </div>
  );
}