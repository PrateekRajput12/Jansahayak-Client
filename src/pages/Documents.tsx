import { useEffect, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, Trash2, CheckCircle, Clock, XCircle } from "lucide-react";
import api from "../services/api";
import { Document } from "../types";
import toast from "react-hot-toast";

const DOC_TYPES = ["aadhar", "pan", "passport", "ration_card", "income_certificate", "caste_certificate", "birth_certificate", "other"];

export default function Documents() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [docName, setDocName] = useState("");
  const [docType, setDocType] = useState("aadhar");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchDocs = () => api.get("/documents/my").then(({ data }) => setDocs(data)).finally(() => setLoading(false));
  useEffect(() => { fetchDocs(); }, []);

  const onDrop = useCallback((files: File[]) => {
    if (files[0]) { setSelectedFile(files[0]); setDocName(files[0].name); }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { "image/*": [], "application/pdf": [] }, maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!selectedFile) return toast.error("Please select a file");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", selectedFile);
      fd.append("name", docName || selectedFile.name);
      fd.append("type", docType);
      await api.post("/documents/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Document uploaded!");
      setSelectedFile(null); setDocName("");
      fetchDocs();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this document?")) return;
    await api.delete(`/documents/${id}`);
    setDocs((prev) => prev.filter((d) => d._id !== id));
    toast.success("Deleted");
  };

  const statusIcon = (s: string) => {
    if (s === "verified") return <CheckCircle size={14} className="text-green-400" />;
    if (s === "rejected") return <XCircle size={14} className="text-red-400" />;
    return <Clock size={14} className="text-yellow-400" />;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">My Documents</h1>

      {/* Upload Zone */}
      <div className="card space-y-4">
        <h2 className="font-semibold text-white">Upload Document</h2>
        <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-blue-500 bg-blue-500/5" : "border-gray-700 hover:border-gray-600"
        } ${selectedFile ? "border-green-500/50 bg-green-500/5" : ""}`}>
          <input {...getInputProps()} />
          <Upload size={32} className={`mx-auto mb-3 ${selectedFile ? "text-green-400" : "text-gray-500"}`} />
          {selectedFile ? (
            <p className="text-green-400 font-medium">{selectedFile.name}</p>
          ) : (
            <>
              <p className="text-gray-300 font-medium">Drop file here or click to browse</p>
              <p className="text-gray-500 text-sm mt-1">PDF, JPG, PNG up to 10MB</p>
            </>
          )}
        </div>

        {selectedFile && (
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Document Name</label>
              <input className="input" value={docName} onChange={(e) => setDocName(e.target.value)} placeholder="e.g. Aadhar Card" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Document Type</label>
              <select className="input" value={docType} onChange={(e) => setDocType(e.target.value)}>
                {DOC_TYPES.map((t) => <option key={t} value={t}>{t.replace("_", " ").toUpperCase()}</option>)}
              </select>
            </div>
          </div>
        )}

        {selectedFile && (
          <button onClick={handleUpload} disabled={uploading}
            className="btn-saffron w-full disabled:opacity-50">
            {uploading ? "Uploading..." : "Upload Document"}
          </button>
        )}
      </div>

      {/* Document List */}
      <div>
        <h2 className="font-semibold text-white mb-3">Uploaded Documents ({docs.length})</h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : docs.length === 0 ? (
          <div className="card text-center py-10">
            <FileText size={36} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No documents uploaded yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {docs.map((doc) => (
              <div key={doc._id} className="card flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText size={18} className="text-gray-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-white truncate">{doc.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{doc.type.replace("_", " ").toUpperCase()} · {new Date(doc.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`badge-${doc.verificationStatus} flex items-center gap-1`}>
                    {statusIcon(doc.verificationStatus)} {doc.verificationStatus}
                  </span>
                  <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 text-sm">View</a>
                  <button onClick={() => handleDelete(doc._id)} className="text-gray-600 hover:text-red-400 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
