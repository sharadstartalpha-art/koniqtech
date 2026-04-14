"use client";

import { useEffect, useState } from "react";
import { useTeamStore } from "@/lib/teamStore";

export default function ActivityFeed() {
  const { activeTeamId } = useTeamStore();
  const [data, setData] = useState<any[]>([]);

  const load = async () => {
    if (!activeTeamId) return;

    const res = await fetch(`/api/activity?teamId=${activeTeamId}`);
    const json = await res.json();
    setData(json);
  };

  useEffect(() => {
    load();

    const interval = setInterval(load, 5000); // 🔥 real-time feel

    return () => clearInterval(interval);
  }, [activeTeamId]);

  return (
    <div className="border rounded-xl p-4 space-y-3">
      <h2 className="font-semibold">Activity 🔥</h2>

      {data.length === 0 && (
        <p className="text-gray-500 text-sm">No activity yet</p>
      )}

      {data.map((a) => (
        <div key={a.id} className="text-sm border-b pb-2">
          <p className="font-medium">{a.user.email}</p>
          <p className="text-gray-600">{a.message}</p>
          <p className="text-xs text-gray-400">
            {new Date(a.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}