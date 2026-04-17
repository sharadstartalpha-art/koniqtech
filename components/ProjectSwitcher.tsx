"use client";

import { useEffect, useState } from "react";

export default function ProjectSwitcher({
  onChange,
}: {
  onChange: (id: string) => void;
}) {
  const [projects, setProjects] = useState<any[]>([]);
  const [active, setActive] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 LOAD PROJECTS
  const loadProjects = async () => {
    const res = await fetch("/api/projects");
    const data = await res.json();

    setProjects(data);

    if (data.length > 0) {
      setActive(data[0].id);
      onChange(data[0].id);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // 🔥 CREATE PROJECT (FIXED)
  const createProject = async () => {
    const name = prompt("Project name");
    if (!name) return;

    setLoading(true);

    const res = await fetch("/api/projects/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error);
    } else {
      // ✅ reload projects without page refresh
      await loadProjects();

      // ✅ auto select new project
      setActive(data.id);
      onChange(data.id);
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center gap-2">

      {/* SELECT */}
      <select
        value={active}
        onChange={(e) => {
          setActive(e.target.value);
          onChange(e.target.value);
        }}
        className="border px-3 py-2 rounded"
      >
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      {/* CREATE BUTTON */}
      <button
        onClick={createProject}
        className="text-blue-600 text-sm"
      >
        {loading ? "Creating..." : "+ New"}
      </button>

    </div>
  );
}