import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Download, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";
import api from "../services/api";
import { Application } from "../types";

const statusIcon = (s: string) => {
  if (s === "approved") return <CheckCircle size={16} className="text-green-400" />;
  if (s === "rejected") return <XCircle size={16} className="text-red-400" />;
  if (s === "under_review") return <AlertCircle size={16} className="text-blue-400" />;
  return <Clock size={16} className="text-yellow-400" />;
};

export default function ApplicationDetail() {
  const { id } = useParams();
  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/applications/${id}`).then(({ data }) => setApp(data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-gray-400">Loading...</div>;
  if (!app) return <div className="text-gray-400">Application not found</div>;

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex items-center gap-3">
        <Link to="/applications" className="text-gray-400 hover:text-white"><ArrowLeft size={20} /></Link>
        <h1 className="text-xl font-bold text-white">Application Details</h1>
      </div>

      <div className="card">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <span className={`badge-${app.status} inline-flex items-center gap-1.5`}>
              {statusIcon(app.status)} {app.status.replace("_", " ")}
            </span>
            <h2 className="font-bold text-white text-lg mt-2">{app.scheme?.title}</h2>
            <p className="text-gray-500 text-sm">Application #{app.applicationNumber}</p>
          </div>
          {app.pdfUrl && (
            <a href={app.pdfUrl} target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 border border-blue-500/30 px-3 py-1.5 rounded-lg">
              <Download size={14} /> Download PDF
            </a>
          )}
        </div>

        <div className="text-sm text-gray-400 space-y-1">
          <p><span className="text-gray-500">Category:</span> <span className="text-gray-300 capitalize">{app.scheme?.category}</span></p>
          <p><span className="text-gray-500">Applied on:</span> <span className="text-gray-300">{new Date(app.createdAt).toLocaleDateString("en-IN")}</span></p>
        </div>
      </div>

      {/* Timeline */}
      <div className="card">
        <h3 className="font-semibold text-white mb-4">Application Timeline</h3>
        <div className="space-y-4">
          {app.timeline?.map((t, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${
                  t.status === "approved" ? "bg-green-400" : t.status === "rejected" ? "bg-red-400" : "bg-blue-400"
                }`} />
                {i < (app.timeline?.length ?? 0) - 1 && <div className="w-0.5 flex-1 bg-gray-800 mt-1" />}
              </div>
              <div className="pb-4">
                <p className="text-sm font-medium text-white capitalize">{t.status.replace("_", " ")}</p>
                <p className="text-sm text-gray-400">{t.message}</p>
                <p className="text-xs text-gray-600 mt-0.5">{new Date(t.at).toLocaleString("en-IN")}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Remarks */}
      {app.remarks?.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-white mb-3">Officer Remarks</h3>
          {app.remarks.map((r, i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-3 text-sm text-gray-300">
              {r.text}
              <p className="text-xs text-gray-600 mt-1">{new Date(r.at).toLocaleString("en-IN")}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
