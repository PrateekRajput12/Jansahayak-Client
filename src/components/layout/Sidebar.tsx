import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard, MessageSquare, FileText, ClipboardList,
  BookOpen, LogOut, Shield, UserCog, Users, User, ChevronRight,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Overview", roles: ["citizen", "officer", "admin"] },
  { to: "/chat",      icon: MessageSquare,   label: "Intelligence", roles: ["citizen"] },
  { to: "/schemes",   icon: BookOpen,        label: "Schemes", roles: ["citizen", "officer", "admin"] },
  { to: "/documents", icon: FileText,        label: "Documents", roles: ["citizen"] },
  { to: "/applications", icon: ClipboardList, label: "Applications", roles: ["citizen"] },
  { to: "/officer",   icon: UserCog,         label: "Review", roles: ["officer", "admin"] },
  { to: "/admin",     icon: Shield,          label: "Admin Panel", roles: ["admin"] },
  { to: "/admin/users", icon: Users,         label: "Users", roles: ["admin"] },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/login"); };
  const visible = navItems.filter((item) => user && item.roles.includes(user.role));

  return (
    <div className="w-56 bg-navy-900 border-r border-navy-800 flex flex-col h-full flex-shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-navy-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield size={15} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-sm leading-tight">JanSahayak</p>
            <p className="text-[10px] text-gray-600 leading-tight">AI Platform</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest px-3 mb-2">Menu</p>
        {visible.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => isActive ? "sidebar-link-active" : "sidebar-link"}
          >
            <Icon size={16} />
            <span className="flex-1">{label}</span>
            <ChevronRight size={12} className="opacity-30" />
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-3 pb-4 border-t border-navy-800 pt-3 space-y-1">
        <NavLink to="/profile" className={({ isActive }) => isActive ? "sidebar-link-active" : "sidebar-link"}>
          <User size={16} />
          <span className="flex-1">Profile</span>
          <ChevronRight size={12} className="opacity-30" />
        </NavLink>

        <div className="flex items-center gap-2.5 px-3 py-2 mt-1">
          <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-500/30 flex items-center justify-center text-xs font-bold text-blue-300 flex-shrink-0">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">{user?.name}</p>
            <p className="text-[10px] text-gray-600 capitalize">{user?.role}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="sidebar-link w-full text-red-500/70 hover:text-red-400 hover:bg-red-500/10"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
