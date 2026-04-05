"use client";

import { useState } from "react";

export default function CreateProjectModal({ onClose, onCreated }: any) {
  const [name, setName] = useState("");

  const create = async () => {
    const res = await fetch("/api/projects/create", {
      method: "POST",
      body: JSON.stringify({ name }),
    });

    const project = await res.json();

    onCreated(project);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[350px] shadow-xl">

        <h2 className="text-lg font-bold mb-4">
          Create new workspace
        </h2>

        <input
          placeholder="Project name"
          className="w-full border p-2 rounded mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>

          <button
            onClick={create}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}