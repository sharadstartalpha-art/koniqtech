"use client";

import { useState } from "react";

export default function EmptyProjectState() {
  const [loading, setLoading] = useState(false);

  const createProject = async () => {
    const name = prompt("Enter project name");
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
      window.location.reload(); // 🔥 refresh projects
    }

    setLoading(false);
  };

  return (
    <div className="text-center mt-20">
      <p className="text-lg mb-2">No projects yet</p>
      <p className="text-gray-500 mb-4">
        Create your first AI project to get started
      </p>

      <button
        onClick={createProject}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {loading ? "Creating..." : "Create Project"}
      </button>
    </div>
  );
}