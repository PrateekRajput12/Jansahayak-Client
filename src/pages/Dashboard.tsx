import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { ClipboardList, FileText, CheckCircle, Clock, XCircle, ChevronRight, Sparkles } from "lucide-react";

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
    { label: "Total Applied", value: stats?.total ?? 0, icon: ClipboardList, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Pending", value: stats?.pending ?? 0, icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/10" },
    { label: "Approved", value: stats?.approved ?? 0, icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/10" },
    { label: "Rejected", value: stats?.rejected ?? 0, icon: XCircle, color: "text-red-400", bg: "bg-red-500/10" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Namaste, {user?.name?.split(" ")[0]} 🙏</h1>
        <p className="text-gray-400 mt-1">Here's your government services overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card">
            <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center mb-3`}>
              <Icon size={20} className={color} />
            </div>
            <p className="text-2xl font-bold text-white">{loading ? "—" : value}</p>
            <p className="text-sm text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Link to="/chat" className="card hover:border-blue-500/50 transition-all group">
          <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center mb-3">
            <Sparkles size={20} className="text-blue-400" />
          </div>
          <p className="font-semibold text-white group-hover:text-blue-400 transition-colors">Ask AI Assistant</p>
          <p className="text-sm text-gray-400 mt-1">Find schemes tailored to you</p>
        </Link>
        <Link to="/documents" className="card hover:border-saffron-500/50 transition-all group">
          <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center mb-3">
            <FileText size={20} className="text-saffron-500" />
          </div>
          <p className="font-semibold text-white group-hover:text-saffron-500 transition-colors">Upload Documents</p>
          <p className="text-sm text-gray-400 mt-1">Aadhar, PAN, certificates</p>
        </Link>
        <Link to="/applications" className="card hover:border-green-500/50 transition-all group">
          <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center mb-3">
            <ClipboardList size={20} className="text-green-400" />
          </div>
          <p className="font-semibold text-white group-hover:text-green-400 transition-colors">My Applications</p>
          <p className="text-sm text-gray-400 mt-1">Track all your applications</p>
        </Link>
      </div>

      {/* AI Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <Sparkles size={16} className="text-blue-400" /> AI Recommended Schemes
            </h2>
            <Link to="/schemes" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
              View all <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {recommendations.map(({ scheme, reason }) => (
              <div key={scheme._id} className="card hover:border-gray-700 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <span className="text-xs text-saffron-500 font-medium uppercase tracking-wide">{scheme.category}</span>
                    <p className="font-medium text-white mt-1">{scheme.title}</p>
                    <p className="text-sm text-gray-400 mt-1">{reason}</p>
                  </div>
                  <Link to={`/schemes`} className="text-blue-400 hover:text-blue-300 flex-shrink-0">
                    <ChevronRight size={18} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
