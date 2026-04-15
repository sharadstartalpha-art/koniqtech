"use client";

import { useEffect, useState } from "react";
import { useTeamStore } from "@/lib/teamStore";
import { getPusherClient } from "@/lib/pusherClient";

export default function ActivityFeed() {
  const { activeTeamId } = useTeamStore();
  const [data, setData] = useState<any[]>([]);

  // 🔥 1. LOAD INITIAL DATA
 useEffect(() => {
  let pusher: any;
  let channel: any;

  const init = async () => {
    pusher = await getPusherClient();
    channel = pusher.subscribe(`team-${activeTeamId}`);

    channel.bind("activity", (data: any) => {
      console.log(data);
    });
  };

  init();

  return () => {
    if (pusher && channel) {
      pusher.unsubscribe(`team-${activeTeamId}`);
    }
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