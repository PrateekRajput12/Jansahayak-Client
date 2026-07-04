import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard, MessageSquare, FileText, ClipboardList,
  BookOpen, LogOut, Shield, UserCog, Users, User,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", roles: ["citizen", "officer", "admin"] },
  { to: "/chat", icon: MessageSquare, label: "AI Assistant", roles: ["citizen"] },
  { to: "/schemes", icon: BookOpen, label: "Schemes", roles: ["citizen", "officer", "admin"] },
  { to: "/documents", icon: FileText, label: "Documents", roles: ["citizen"] },
  { to: "/applications", icon: ClipboardList, label: "Applications", roles: ["citizen"] },
  { to: "/officer", icon: UserCog, label: "Review Applications", roles: ["officer", "admin"] },
  { to: "/admin", icon: Shield, label: "Admin Panel", roles: ["admin"] },
  { to: "/admin/users", icon: Users, label: "Manage Users", roles: ["admin"] },
  { to: "/profile", icon: User, label: "My Profile", roles: ["citizen", "officer", "admin"] },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const visibleItems = navItems.filter((item) => user && item.roles.includes(user.role));

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield size={18} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-sm">JanSahayak AI</p>
            <p className="text-xs text-gray-500">Government Services</p>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="px-4 py-3 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-saffron-500 flex items-center justify-center text-sm font-bold text-white">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {visibleItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 w-full transition-all"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}
