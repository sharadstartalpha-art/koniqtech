"use client";

import { useEffect, useState } from "react";

export default function ProjectSwitcher() {
  const [projects, setProjects] = useState<any[]>([]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);

        const saved = localStorage.getItem("projectId");
        if (saved) {
          setActive(saved);
        } else if (data.length > 0) {
          setActive(data[0].id);
          localStorage.setItem("projectId", data[0].id);
        }
      });
  }, []);

  const switchProject = (id: string) => {
    setActive(id);
    localStorage.setItem("projectId", id);

    // 🔥 reload to apply everywhere
    window.location.reload();
  };

  return (
    <select
      value={active || ""}
      onChange={(e) => switchProject(e.target.value)}
      className="border px-3 py-2 rounded bg-white"
    >
      {projects.map((p) => (
        <option key={p.id} value={p.id}>
          {p.name}
        </option>
      ))}
    </select>
  );
}