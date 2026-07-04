import { Link } from "react-router-dom";
import { Shield, MessageSquare, FileText, Bell, ChevronRight, Globe } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg">AI JanSahayak</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-gray-400 hover:text-white transition-colors text-sm">Login</Link>
          <Link to="/register" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto text-center pt-24 pb-16 px-6">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm px-4 py-1.5 rounded-full mb-8">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          AI-Powered Government Services
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
          Government Schemes,{" "}
          <span className="bg-gradient-to-r from-blue-400 to-saffron-500 bg-clip-text text-transparent">
            Made Simple
          </span>
        </h1>

        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
          AI JanSahayak helps Indian citizens discover relevant government schemes, upload documents securely, and track applications in one place — in their own language.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl font-semibold flex items-center gap-2 transition-all text-lg">
            Find Your Schemes <ChevronRight size={20} />
          </Link>
          <Link to="/login" className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3.5 rounded-xl font-semibold transition-all text-lg">
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: MessageSquare, title: "AI Chatbot", desc: "Get scheme recommendations in your language via our Gemini-powered assistant.", color: "text-blue-400" },
            { icon: FileText, title: "Document Upload", desc: "Securely upload and verify Aadhar, PAN, and other documents with Cloudinary.", color: "text-saffron-500" },
            { icon: Shield, title: "Track Applications", desc: "Real-time status updates for every scheme application you submit.", color: "text-green-400" },
            { icon: Globe, title: "Multi-language", desc: "Interact in Hindi, Tamil, Bengali, or English — your choice.", color: "text-purple-400" },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="card hover:border-gray-700 transition-colors">
              <Icon size={24} className={`${color} mb-4`} />
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-t border-gray-800 py-10">
        <div className="flex flex-wrap justify-center gap-10 text-center text-gray-500 text-sm px-6">
          {["2000+ Schemes Listed", "10 Languages Supported", "100% Secure & Encrypted", "RBAC Access Control"].map((b) => (
            <div key={b} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              {b}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
