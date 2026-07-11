import { useState, useRef, useEffect } from "react";
import { Bell, X, Search, ChevronDown } from "lucide-react";
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
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleMarkAllRead = async () => {
    await api.put("/notifications/read-all");
    markAllRead();
  };

  return (
    <div className="h-14 border-b border-navy-800 bg-navy-900 flex items-center justify-between px-6 flex-shrink-0">
      {/* Search bar */}
      <div className="flex items-center gap-2 bg-navy-800 border border-navy-700 rounded-xl px-3 py-2 w-64">
        <Search size={14} className="text-gray-600 flex-shrink-0" />
        <input
          placeholder="Ask JanSahayak..."
          className="bg-transparent text-sm text-gray-400 placeholder-gray-600 outline-none w-full"
        />
        <span className="text-[10px] text-gray-700 border border-navy-600 rounded px-1 py-0.5 font-mono flex-shrink-0">⌘K</span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen(!open)}
            className="relative p-2 rounded-xl hover:bg-navy-800 border border-transparent hover:border-navy-700 transition-all"
          >
            <Bell size={17} className="text-gray-500" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-blue-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 top-12 w-80 bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-navy-800">
                <p className="font-semibold text-white text-sm">Notifications</p>
                <button onClick={handleMarkAllRead} className="text-xs text-blue-400 hover:text-blue-300">
                  Mark all read
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-navy-800">
                {notifications.length === 0 ? (
                  <p className="text-center text-gray-600 text-sm py-8">No notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      onClick={async () => { await api.put(`/notifications/${n._id}/read`); markRead(n._id); }}
                      className={`p-3 cursor-pointer hover:bg-navy-800 transition-colors ${!n.isRead ? "bg-blue-500/5" : ""}`}
                    >
                      <div className="flex items-start gap-2">
                        {!n.isRead && <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />}
                        <div>
                          <p className="text-sm font-medium text-white">{n.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                          <p className="text-xs text-gray-700 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User chip */}
        <div className="flex items-center gap-2 bg-navy-800 border border-navy-700 rounded-xl px-3 py-1.5 cursor-pointer hover:border-navy-600 transition-all">
          <div className="w-6 h-6 rounded-lg bg-blue-600/40 border border-blue-500/30 flex items-center justify-center text-[11px] font-bold text-blue-300">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <span className="text-sm text-gray-300 font-medium">{user?.name?.split(" ")[0]}</span>
          <ChevronDown size={13} className="text-gray-600" />
        </div>
      </div>
    </div>
  );
}
