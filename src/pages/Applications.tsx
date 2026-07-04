import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardList, ChevronRight, Download } from "lucide-react";
import api from "../services/api";
import { Application } from "../types";

export default function Applications() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    api.get("/applications/my").then(({ data }) => setApps(data)).finally(() => setLoading(false));
  }, []);

  const filtered = filter ? apps.filter((a: Application) => a.status === filter) : apps;

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-white">My Applications</h1>

      {/* Status filter */}
      {apps.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {["", "pending", "under_review", "approved", "rejected"].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
                filter === s ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"
              }`}>
              {s === "" ? "All" : s.replace("_", " ")}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : apps.length === 0 ? (
        <div className="card text-center py-12">
          <ClipboardList size={36} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No applications yet</p>
          <Link to="/schemes" className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block">Browse schemes →</Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-8">
          <p className="text-gray-400">No <span className="capitalize">{filter.replace("_", " ")}</span> applications</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => (
            <div key={app._id} className="card hover:border-gray-700 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`badge-${app.status}`}>{app.status.replace("_", " ")}</span>
                    <span className="text-xs text-gray-600">#{app.applicationNumber}</span>
                  </div>
                  <h3 className="font-semibold text-white truncate">{app.scheme?.title}</h3>
                  <p className="text-xs text-gray-500 mt-1 capitalize">{app.scheme?.category} · {app.scheme?.ministry || ""}</p>
                  <p className="text-xs text-gray-600 mt-1">Applied on {new Date(app.createdAt).toLocaleDateString("en-IN")}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {app.pdfUrl && (
                    <a href={app.pdfUrl} target="_blank" rel="noreferrer"
                      className="text-gray-500 hover:text-blue-400 transition-colors" title="Download PDF">
                      <Download size={16} />
                    </a>
                  )}
                  <Link to={`/applications/${app._id}`} className="text-blue-400 hover:text-blue-300">
                    <ChevronRight size={18} />
                  </Link>
                </div>
              </div>

              {/* Mini timeline */}
              {app.timeline?.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-800">
                  <p className="text-xs text-gray-500">Latest update: {app.timeline[app.timeline.length - 1]?.message}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
