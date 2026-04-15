"use client";

import { useEffect, useState } from "react";
import { useTeamStore } from "@/lib/teamStore";

export default function TasksPage() {
  const { activeTeamId } = useTeamStore();
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState("");

  const load = async () => {
    const res = await fetch(`/api/tasks?teamId=${activeTeamId}`);
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    if (activeTeamId) load();
  }, [activeTeamId]);

  const create = async () => {
    await fetch("/api/tasks/create", {
      method: "POST",
      body: JSON.stringify({
        title,
        teamId: activeTeamId,
      }),
    });

    setTitle("");
    load();
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Tasks 📋</h1>

      <div className="flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title (@mention supported)"
          className="border px-3 py-2 rounded w-full"
        />
        <button onClick={create} className="bg-black text-white px-4 rounded">
          Add
        </button>
      </div>

      <div className="space-y-2">
        {tasks.map((t) => (
          <div key={t.id} className="border p-3 rounded">
            {t.title}
          </div>
        ))}
      </div>
    </div>
  );
}