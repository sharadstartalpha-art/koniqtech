"use client";

import { useEffect, useState } from "react";

export default function ProjectSwitcher({
  onChange,
}: {
  onChange: (id: string) => void;
}) {
  const [projects, setProjects] = useState<any[]>([]);
  const [active, setActive] = useState("");

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);

        if (data.length > 0) {
          setActive(data[0].id);
          onChange(data[0].id);
        }
      });
  }, []);

  return (
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
  );
}