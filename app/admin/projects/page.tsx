"use client";

import { useEffect, useState } from "react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/projects")
      .then(res => res.json())
      .then(setProjects);
  }, []);

  fetch("/api/admin/projects")
  
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Projects</h1>

      <div className="grid gap-4">
        {projects.map((p) => (
          <div key={p.id} className="bg-white p-4 rounded shadow">
            <p className="font-semibold">{p.name}</p>
            <p className="text-sm text-gray-500">
              User: {p.user.email}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}