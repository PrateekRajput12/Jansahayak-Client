import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Shield, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4 bg-grid-pattern">
      <div className="absolute inset-0 bg-blue-600/5 rounded-full blur-3xl w-96 h-96 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8">
          <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-5">
            <Shield size={20} className="text-white" />
          </div>
          <p className="text-xs text-gray-600 uppercase tracking-widest font-semibold mb-2">Secure Connection Established</p>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-gray-600 mt-1 text-sm">JanSahayak AI is ready. Sign in to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block font-medium uppercase tracking-wider">Email</label>
            <input
              type="email" required className="input"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block font-medium uppercase tracking-wider">Password</label>
            <input
              type="password" required className="input"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 mt-2">
            {loading ? "Authenticating..." : <>Sign In <ArrowRight size={15} /></>}
          </button>
        </form>

        <p className="text-center text-gray-600 text-xs mt-5">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">Create one</Link>
        </p>
      </div>
    </div>
  );
}
