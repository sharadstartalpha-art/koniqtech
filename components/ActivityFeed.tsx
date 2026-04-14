"use client";

import { useEffect, useState } from "react";
import { useTeamStore } from "@/lib/teamStore";
import { pusherClient } from "@/lib/pusherClient";

export default function ActivityFeed() {
  const { activeTeamId } = useTeamStore();
  const [data, setData] = useState<any[]>([]);

  // 🔥 1. LOAD INITIAL DATA
  useEffect(() => {
    if (!activeTeamId) return;

    fetch(`/api/activity?teamId=${activeTeamId}`)
      .then((res) => res.json())
      .then((initialData) => setData(initialData))
      .catch((err) => console.error("Fetch error:", err));
  }, [activeTeamId]);

  // ⚡ 2. REALTIME UPDATES (PUSHER)
  useEffect(() => {
    if (!activeTeamId) return;

    const channelName = `team-${activeTeamId}`;
    const channel = pusherClient.subscribe(channelName);

    channel.bind("activity", (newActivity: any) => {
      setData((prev) => [newActivity, ...prev]);
    });

    return () => {
      pusherClient.unsubscribe(channelName);
    };
  }, [activeTeamId]);

  return (
    <div className="space-y-3">
      <h2 className="font-semibold">Live Activity ⚡</h2>

      {data.length === 0 ? (
        <p className="text-sm text-gray-500">No activity yet</p>
      ) : (
        data.map((a) => (
          <div key={a.id} className="border p-3 rounded">
            <p className="text-sm font-medium">{a.user?.email}</p>
            <p className="text-sm text-gray-600">{a.message}</p>
          </div>
        ))
      )}
    </div>
  );
}