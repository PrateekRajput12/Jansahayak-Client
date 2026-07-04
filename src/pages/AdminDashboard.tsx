import { useEffect, useState } from "react";
import { BookOpen, Users, ClipboardList, Plus, Trash2 } from "lucide-react";
import api from "../services/api";
import { Scheme } from "../types";
import toast from "react-hot-toast";

const CATEGORIES = ["education", "health", "agriculture", "housing", "employment", "women", "senior", "disability", "other"];

interface Stats { total: number; pending: number; approved: number; rejected: number }

const emptyScheme = { title: "", description: "", category: "education", ministry: "", benefits: "", documents: "", tags: "" };

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [form, setForm] = useState(emptyScheme);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/applications/stats").then(({ data }) => setStats(data)).catch(() => {});
    api.get("/schemes?limit=20").then(({ data }) => setSchemes(data.schemes || [])).catch(() => {});
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        benefits: form.benefits.split("\n").filter(Boolean),
        documents: form.documents.split("\n").filter(Boolean),
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      };
      const { data } = await api.post("/schemes", payload);
      setSchemes((prev) => [data, ...prev]);
      setForm(emptyScheme);
      setShowForm(false);
      toast.success("Scheme created!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this scheme?")) return;
    await api.delete(`/schemes/${id}`);
    setSchemes((prev) => prev.filter((s) => s._id !== id));
    toast.success("Scheme deleted");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Applications", value: stats?.total, icon: ClipboardList, color: "text-blue-400" },
          { label: "Pending", value: stats?.pending, icon: ClipboardList, color: "text-yellow-400" },
          { label: "Approved", value: stats?.approved, icon: ClipboardList, color: "text-green-400" },
          { label: "Total Schemes", value: schemes.length, icon: BookOpen, color: "text-purple-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card">
            <Icon size={20} className={`${color} mb-2`} />
            <p className="text-2xl font-bold text-white">{value ?? "—"}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Schemes Management */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white">Manage Schemes</h2>
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 btn-primary text-sm">
            <Plus size={16} /> Add Scheme
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="card mb-4 space-y-3">
            <h3 className="font-medium text-white">New Scheme</h3>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Title</label>
                <input className="input" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Scheme name" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Category</label>
                <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Description</label>
              <textarea className="input h-20 resize-none" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Ministry</label>
              <input className="input" value={form.ministry} onChange={(e) => setForm({ ...form, ministry: e.target.value })} placeholder="e.g. Ministry of Agriculture" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Benefits (one per line)</label>
              <textarea className="input h-20 resize-none" value={form.benefits} onChange={(e) => setForm({ ...form, benefits: e.target.value })} placeholder="Financial assistance&#10;Free seeds" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Required Documents (one per line)</label>
              <textarea className="input h-16 resize-none" value={form.documents} onChange={(e) => setForm({ ...form, documents: e.target.value })} placeholder="Aadhar Card&#10;Income Certificate" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Tags (comma-separated)</label>
              <input className="input" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="farmer, agriculture, subsidy" />
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={loading} className="btn-saffron disabled:opacity-50">{loading ? "Creating..." : "Create Scheme"}</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-primary bg-gray-700 hover:bg-gray-600">Cancel</button>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {schemes.map((s) => (
            <div key={s._id} className="card flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-saffron-500 font-medium capitalize">{s.category}</p>
                <p className="font-medium text-white truncate">{s.title}</p>
                {s.ministry && <p className="text-xs text-gray-500">{s.ministry}</p>}
              </div>
              <button onClick={() => handleDelete(s._id)} className="text-gray-600 hover:text-red-400 transition-colors flex-shrink-0">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
