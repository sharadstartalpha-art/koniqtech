"use client";

import { useEffect, useState } from "react";

export default function ProjectSwitcher() {
  const [projects, setProjects] = useState<any[]>([]);
  const [active, setActive] = useState<string>("");

  const fetchProjects = async () => {
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data);

    const saved = localStorage.getItem("projectId");
    if (saved) setActive(saved);
    else if (data[0]) {
      setActive(data[0].id);
      localStorage.setItem("projectId", data[0].id);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const switchProject = (id: string) => {
    setActive(id);
    localStorage.setItem("projectId", id);
  };

  // 🔥 CREATE NEW PROJECT (NO RELOAD)
  const createProject = async () => {
    const name = prompt("Enter project name");

    if (!name) return;

    const res = await fetch("/api/projects/create", {
      method: "POST",
      body: JSON.stringify({ name }),
    });

    const newProject = await res.json();

    await fetchProjects();

    setActive(newProject.id);
    localStorage.setItem("projectId", newProject.id);
  };

  return (
    <div className="flex items-center gap-2">

      <select
        value={active}
        onChange={(e) => switchProject(e.target.value)}
        className="border px-3 py-2 rounded"
      >
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      {/* ➕ CREATE BUTTON */}
      <button
        onClick={createProject}
        className="bg-blue-600 text-white px-2 py-1 rounded"
      >
        +
      </button>

    </div>
  );
}