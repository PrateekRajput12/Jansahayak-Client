import { useState } from "react";
import { X } from "lucide-react";
import { Scheme } from "../../types";
import api from "../../services/api";
import toast from "react-hot-toast";

interface Props { scheme: Scheme; onClose: () => void }

export default function ApplyModal({ scheme, onClose }: Props) {
  const [formData, setFormData] = useState({ fullName: "", phone: "", address: "", income: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/applications", { schemeId: scheme._id, formData });
      toast.success(`Application submitted! ID: ${data.applicationNumber}`);
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Application failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <div>
            <p className="text-xs text-saffron-500 font-medium uppercase">{scheme.category}</p>
            <h2 className="font-bold text-white mt-0.5">{scheme.title}</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 border-b border-gray-800">
          <h3 className="text-sm font-medium text-gray-300 mb-2">Required Documents</h3>
          <div className="flex flex-wrap gap-2">
            {scheme.documents?.map((d) => (
              <span key={d} className="text-xs bg-gray-800 text-gray-400 px-2.5 py-1 rounded-full">{d}</span>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Full Name</label>
            <input className="input" required placeholder="As per Aadhar card"
              value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Phone Number</label>
            <input className="input" required placeholder="+91 98765 43210"
              value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Address</label>
            <textarea className="input h-20 resize-none" required placeholder="Full address with pincode"
              value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Annual Family Income (₹)</label>
            <input className="input" type="number" placeholder="e.g. 250000"
              value={formData.income} onChange={(e) => setFormData({ ...formData, income: e.target.value })} />
          </div>
          <button type="submit" disabled={loading}
            className="btn-saffron w-full disabled:opacity-50 mt-2">
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}
