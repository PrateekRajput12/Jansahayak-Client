import { useState, useRef, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

export default function Topbar() {
  const { user } = useAuth();
  const { notifications, unreadCount, markRead, markAllRead, setNotifications } = useSocket();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get("/notifications").then(({ data }) => setNotifications(data)).catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleMarkAllRead = async () => {
    await api.put("/notifications/read-all");
    markAllRead();
  };

  return (
    <div className="h-14 border-b border-gray-800 bg-gray-900 flex items-center justify-between px-6">
      <div>
        <p className="text-sm text-gray-400">
          Welcome back, <span className="text-white font-medium">{user?.name}</span>
        </p>
      </div>

      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className="relative p-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Bell size={20} className="text-gray-400" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {open && (
          <div className="absolute right-0 top-12 w-80 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <p className="font-semibold text-white">Notifications</p>
              <button onClick={handleMarkAllRead} className="text-xs text-blue-400 hover:text-blue-300">
                Mark all read
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto divide-y divide-gray-800">
              {notifications.length === 0 ? (
                <p className="text-center text-gray-500 text-sm py-8">No notifications</p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n._id}
                    onClick={async () => { await api.put(`/notifications/${n._id}/read`); markRead(n._id); }}
                    className={`p-3 cursor-pointer hover:bg-gray-800 transition-colors ${!n.isRead ? "bg-blue-500/5" : ""}`}
                  >
                    <div className="flex items-start gap-2">
                      {!n.isRead && <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />}
                      <div>
                        <p className="text-sm font-medium text-white">{n.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{n.message}</p>
                        <p className="text-xs text-gray-600 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
