import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Eye, FileCheck } from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";

interface App {
  _id: string; applicationNumber: string; status: string;
  scheme: { title: string; category: string };
  citizen: { name: string; email: string; phone: string };
  createdAt: string;
}

interface Doc {
  _id: string; name: string; type: string; fileUrl: string;
  owner: { name: string; email: string };
  verificationStatus: string; createdAt: string;
}

export default function OfficerDashboard() {
  const [apps, setApps] = useState<App[]>([]);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [tab, setTab] = useState<"applications" | "documents">("applications");
  const [remarks, setRemarks] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/applications/all?status=pending").then(({ data }) => setApps(data.applications || [])),
      api.get("/documents/pending").then(({ data }) => setDocs(data)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const updateAppStatus = async (id: string, status: string) => {
    await api.put(`/applications/${id}/status`, { status, remark: remarks[id] || "" });
    setApps((prev) => prev.filter((a) => a._id !== id));
    setRemarks((prev: Record<string, string>) => { const next = { ...prev }; delete next[id]; return next; });
    toast.success(`Application ${status}`);
  };

  const verifyDoc = async (id: string, status: "verified" | "rejected", reason?: string) => {
    await api.put(`/documents/${id}/verify`, { status, rejectionReason: reason });
    setDocs((prev) => prev.filter((d) => d._id !== id));
    toast.success(`Document ${status}`);
  };

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-white">Officer Dashboard</h1>

      <div className="flex gap-2">
        {(["applications", "documents"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${tab === t ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}>
            {t} {t === "applications" ? `(${apps.length})` : `(${docs.length})`}
          </button>
        ))}
      </div>

      {loading ? <p className="text-gray-500">Loading...</p> : tab === "applications" ? (
        <div className="space-y-3">
          {apps.length === 0 ? <p className="text-gray-500 card py-8 text-center">No pending applications</p> : apps.map((app) => (
            <div key={app._id} className="card space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="badge-pending">{app.status}</span>
                  <p className="font-semibold text-white mt-1">{app.scheme?.title}</p>
                  <p className="text-sm text-gray-400">#{app.applicationNumber} · {app.citizen?.name} · {app.citizen?.phone}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{new Date(app.createdAt).toLocaleDateString("en-IN")}</p>
                </div>
              </div>
              <input className="input text-sm" placeholder="Add remark (optional)"
                value={remarks[app._id] || ""}
                onChange={(e) => setRemarks((prev) => ({ ...prev, [app._id]: e.target.value }))} />
              <div className="flex gap-2">
                <button onClick={() => updateAppStatus(app._id, "approved")}
                  className="flex items-center gap-1.5 text-sm bg-green-500/10 text-green-400 border border-green-500/30 px-3 py-1.5 rounded-lg hover:bg-green-500/20 transition-colors">
                  <CheckCircle size={14} /> Approve
                </button>
                <button onClick={() => updateAppStatus(app._id, "under_review")}
                  className="flex items-center gap-1.5 text-sm bg-blue-500/10 text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded-lg hover:bg-blue-500/20 transition-colors">
                  <Eye size={14} /> Mark Under Review
                </button>
                <button onClick={() => updateAppStatus(app._id, "rejected")}
                  className="flex items-center gap-1.5 text-sm bg-red-500/10 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg hover:bg-red-500/20 transition-colors">
                  <XCircle size={14} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {docs.length === 0 ? <p className="text-gray-500 card py-8 text-center">No pending documents</p> : docs.map((doc) => (
            <div key={doc._id} className="card flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-white">{doc.name}</p>
                <p className="text-sm text-gray-400">{doc.owner?.name} · {doc.type.replace("_", " ").toUpperCase()}</p>
                <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 text-xs mt-1 inline-block">View File →</a>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => verifyDoc(doc._id, "verified")}
                  className="flex items-center gap-1 text-xs bg-green-500/10 text-green-400 border border-green-500/30 px-2.5 py-1.5 rounded-lg hover:bg-green-500/20">
                  <FileCheck size={12} /> Verify
                </button>
                <button onClick={() => { const r = prompt("Rejection reason?"); if (r) verifyDoc(doc._id, "rejected", r); }}
                  className="flex items-center gap-1 text-xs bg-red-500/10 text-red-400 border border-red-500/30 px-2.5 py-1.5 rounded-lg hover:bg-red-500/20">
                  <XCircle size={12} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
