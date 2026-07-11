import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import {
  ClipboardList, FileText, CheckCircle, Clock, XCircle,
  ChevronRight, Sparkles, ArrowUpRight, Activity, TrendingUp,
} from "lucide-react";

interface Stats { total: number; pending: number; under_review: number; approved: number; rejected: number }
interface Recommendation { scheme: { _id: string; title: string; category: string; ministry?: string }; reason: string }

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/applications/stats").then(({ data }) => setStats(data)),
      api.get("/schemes/recommendations").then(({ data }) => setRecommendations(data.slice(0, 4))).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: "Total Applied", value: stats?.total ?? 0, icon: ClipboardList, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", trend: "+2 this month" },
    { label: "Pending Review", value: stats?.pending ?? 0, icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", trend: "Awaiting" },
    { label: "Approved", value: stats?.approved ?? 0, icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", trend: "Disbursed" },
    { label: "Rejected", value: stats?.rejected ?? 0, icon: XCircle, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", trend: "Can reapply" },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-600 uppercase tracking-widest font-semibold mb-1">Dashboard</p>
          <h1 className="text-2xl font-bold text-white">Namaste, {user?.name?.split(" ")[0]} 🙏</h1>
          <p className="text-gray-500 text-sm mt-1">Here's your citizen intelligence briefing</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-3 py-1.5 rounded-xl font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Services Online
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, bg, trend }) => (
          <div key={label} className={`card border ${bg}`}>
            <div className="flex items-start justify-between mb-4">
              <div className={`w-9 h-9 ${bg} border rounded-xl flex items-center justify-center`}>
                <Icon size={17} className={color} />
              </div>
              <TrendingUp size={13} className="text-gray-700" />
            </div>
            <p className="text-3xl font-bold text-white tracking-tight">{loading ? "—" : value}</p>
            <p className="text-xs text-gray-500 mt-1 font-medium">{label}</p>
            <p className="text-[11px] text-gray-700 mt-2">{trend}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Quick Actions */}
        <div className="lg:col-span-1 space-y-3">
          <p className="text-xs text-gray-600 uppercase tracking-widest font-semibold">Priority Actions</p>

          <Link to="/chat" className="card-hover flex items-center gap-3 group cursor-pointer">
            <div className="w-9 h-9 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles size={16} className="text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">Ask AI Assistant</p>
              <p className="text-xs text-gray-600 mt-0.5">Find eligible schemes</p>
            </div>
            <ArrowUpRight size={14} className="text-gray-700 group-hover:text-blue-400 transition-colors flex-shrink-0" />
          </Link>

          <Link to="/documents" className="card-hover flex items-center gap-3 group cursor-pointer">
            <div className="w-9 h-9 bg-saffron-500/10 border border-saffron-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <FileText size={16} className="text-saffron-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white group-hover:text-saffron-500 transition-colors">Upload Documents</p>
              <p className="text-xs text-gray-600 mt-0.5">Aadhaar, PAN, certificates</p>
            </div>
            <ArrowUpRight size={14} className="text-gray-700 group-hover:text-saffron-500 transition-colors flex-shrink-0" />
          </Link>

          <Link to="/applications" className="card-hover flex items-center gap-3 group cursor-pointer">
            <div className="w-9 h-9 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <ClipboardList size={16} className="text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">My Applications</p>
              <p className="text-xs text-gray-600 mt-0.5">Track all applications</p>
            </div>
            <ArrowUpRight size={14} className="text-gray-700 group-hover:text-emerald-400 transition-colors flex-shrink-0" />
          </Link>
        </div>

        {/* AI Recommendations */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-gray-600 uppercase tracking-widest font-semibold flex items-center gap-2">
              <Activity size={12} className="text-blue-500" /> AI Recommended Schemes
            </p>
            <Link to="/schemes" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
              View all <ChevronRight size={12} />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="card animate-pulse h-16" />
              ))}
            </div>
          ) : recommendations.length === 0 ? (
            <div className="card flex flex-col items-center justify-center py-10 text-center">
              <Sparkles size={28} className="text-gray-700 mb-3" />
              <p className="text-gray-500 text-sm">Complete your profile to get AI recommendations</p>
              <Link to="/profile" className="mt-3 text-xs text-blue-400 hover:text-blue-300">Update Profile →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recommendations.map(({ scheme, reason }) => (
                <div key={scheme._id} className="card-hover flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles size={13} className="text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-semibold text-saffron-500 uppercase tracking-wider">{scheme.category}</span>
                    </div>
                    <p className="text-sm font-semibold text-white truncate">{scheme.title}</p>
                    <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">{reason}</p>
                  </div>
                  <Link to="/schemes" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight size={14} className="text-blue-400 mt-1" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
