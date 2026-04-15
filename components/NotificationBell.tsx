"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getPusherClient } from "@/lib/pusherClient";

export default function NotificationBell({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  // load existing
  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then(setNotifications);
  }, []);

  // realtime
  useEffect(() => {
    if (!userId) return;

    let pusher: any;

    const init = async () => {
      pusher = await getPusherClient(); // ✅ dynamic import here

      const channel = pusher.subscribe(`user-${userId}`);

      channel.bind("notification", (data: any) => {
        setNotifications((prev) => [data, ...prev]);
        toast.success(data.message);
      });
    };

    init();

    return () => {
      if (pusher) {
        pusher.unsubscribe(`user-${userId}`);
      }
    };
  }, [userId]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}>🔔</button>

      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
          {unreadCount}
        </span>
      )}

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded p-3">
          {notifications.map((n) => (
            <div key={n.id}>{n.message}</div>
          ))}
        </div>
      )}
    </div>
  );
}