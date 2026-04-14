"use client";

import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusherClient";
import toast from "react-hot-toast";

export default function NotificationBell({ userId }: any) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  // 🔥 load existing
  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then(setNotifications);
  }, []);

  // 🔥 realtime
  useEffect(() => {
    const channel = pusherClient.subscribe(`user-${userId}`);

    channel.bind("notification", (data: any) => {
      setNotifications((prev) => [data, ...prev]);

      // 🔥 TOAST
      toast.success(data.message);
    });

    return () => {
      pusherClient.unsubscribe(`user-${userId}`);
    };
  }, [userId]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = async () => {
    await fetch("/api/notifications/read", {
      method: "POST",
    });

    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  return (
    <div className="relative">
      {/* 🔔 ICON */}
      <button
        onClick={() => setOpen(!open)}
        className="relative"
      >
        🔔

        {/* 🔴 BADGE */}
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded-xl shadow-lg p-3 z-50">

          <div className="flex justify-between items-center mb-2">
            <p className="font-semibold">Notifications</p>

            <button
              onClick={markAllRead}
              className="text-sm text-blue-600"
            >
              Mark all read
            </button>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-2 rounded ${
                  n.read ? "bg-gray-50" : "bg-blue-50"
                }`}
              >
                {n.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}