"use client";

import { useEffect, useState } from "react";

export default function ProjectSwitcher() {
  const [projects, setProjects] = useState<any[]>([]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/projects/user")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);

        // ✅ load saved project
        const saved = localStorage.getItem("projectId");
        if (saved) setActive(saved);
        else if (data[0]) {
          setActive(data[0].id);
          localStorage.setItem("projectId", data[0].id);
        }
      });
  }, []);

  const switchProject = (id: string) => {
    setActive(id);
    localStorage.setItem("projectId", id);
    window.location.reload(); // simple refresh
  };

  return (
    <select
      value={active || ""}
      onChange={(e) => switchProject(e.target.value)}
      className="border px-2 py-1 rounded"
    >
      {projects.map((p) => (
        <option key={p.id} value={p.id}>
          {p.name}
        </option>
      ))}
    </select>
  );
}