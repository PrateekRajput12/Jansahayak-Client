import { Link } from "react-router-dom";
import { Shield, MessageSquare, FileText, Globe, ArrowUpRight, ChevronRight, Lock, Zap, Activity } from "lucide-react";

function MockChatUI() {
  return (
    <div className="bg-navy-900 border border-navy-700 rounded-2xl overflow-hidden shadow-2xl w-full">
      {/* top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-navy-800">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-blue-600 rounded-md flex items-center justify-center">
            <Shield size={10} className="text-white" />
          </div>
          <span className="text-[11px] font-bold text-white">JanSahayak Status</span>
        </div>
        <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </div>
      </div>
      {/* messages */}
      <div className="p-3 space-y-2">
        {[
          { text: "Run diagnostics on regional healthcare distribution workflows.", user: true },
          { text: "Diagnostic complete. Identifying bottlenecks in Sector 4 routing.", user: false },
          { text: "Optimizing local intelligence frameworks for compliance.", user: false },
        ].map((m, i) => (
          <div key={i} className={`flex ${m.user ? "justify-end" : "justify-start"}`}>
            <div className={`text-[10px] px-3 py-2 rounded-xl max-w-[80%] leading-relaxed ${
              m.user ? "bg-blue-600/30 border border-blue-500/30 text-blue-200" : "bg-navy-800 border border-navy-700 text-gray-400"
            }`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      {/* input */}
      <div className="px-3 pb-3">
        <div className="flex items-center gap-2 bg-navy-800 border border-navy-700 rounded-xl px-3 py-2">
          <span className="text-[10px] text-gray-600 flex-1">Subscribe anywhere...</span>
          <div className="w-5 h-5 bg-blue-600 rounded-lg flex items-center justify-center">
            <ArrowUpRight size={10} className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MockMultilingualUI() {
  return (
    <div className="bg-navy-900 border border-navy-700 rounded-2xl p-4 w-full">
      <p className="text-[10px] text-gray-600 uppercase tracking-widest font-semibold mb-3">Translation Speed</p>
      <div className="space-y-3">
        {[
          { lang: "Hindi → English", pct: 92, color: "bg-blue-500" },
          { lang: "Tamil → English", pct: 78, color: "bg-purple-500" },
          { lang: "Bengali → English", pct: 85, color: "bg-emerald-500" },
        ].map(({ lang, pct, color }) => (
          <div key={lang}>
            <div className="flex justify-between text-[10px] text-gray-500 mb-1">
              <span>{lang}</span><span>{pct}%</span>
            </div>
            <div className="w-full h-1 bg-navy-800 rounded-full">
              <div className={`h-1 rounded-full ${color}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-between text-[10px] text-gray-600">
        <span>Alpha Latency</span><span className="text-white font-semibold">9ms</span>
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-navy-950 text-white overflow-x-hidden">
      <div className="fixed inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-4 border-b border-navy-800 bg-navy-950/90 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield size={13} className="text-white" />
          </div>
          <span className="font-bold text-white text-sm">JanSahayak</span>
        </div>
        <div className="hidden md:flex items-center gap-7 text-sm text-gray-500">
          {["Dashboard", "Workflows", "Engine", "Intelligence"].map(l => (
            <span key={l} className="hover:text-white cursor-pointer transition-colors">{l}</span>
          ))}
        </div>
        <Link to="/register" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all">
          Get Started
        </Link>
      </nav>

      {/* Hero — left aligned */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] px-3 py-1 rounded-full mb-6 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Sovereign AI Infrastructure
            </div>

            <h1 className="text-5xl font-extrabold tracking-tight leading-[1.08] mb-6">
              Revolutionizing<br />
              <span className="text-white">Governance with</span><br />
              <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                Sovereign AI.
              </span>
            </h1>

            <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-md">
              Deploy secure, localized intelligence frameworks engineered for public sector scale. Ensure data sovereignty while delivering unparalleled citizen services through advanced, autonomous workflows.
            </p>

            <div className="flex items-center gap-3">
              <Link to="/register" className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all">
                Deploy Infrastructure <ChevronRight size={15} />
              </Link>
              <Link to="/login" className="border border-navy-700 bg-navy-800 hover:bg-navy-700 text-gray-300 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all">
                View Recommendation
              </Link>
            </div>
          </div>

          {/* Right — mock UI */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-blue-600/10 rounded-3xl blur-3xl" />
            <div className="relative">
              <MockChatUI />
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-14 flex flex-wrap items-center gap-0 border border-navy-800 rounded-2xl overflow-hidden bg-navy-900/50">
          {[
            { value: "12,845", label: "Active Workflows" },
            { value: "42ms", label: "Avg Processing Time" },
            { value: "87%", label: "AI Inference Load" },
            { value: "40+", label: "Languages Supported" },
          ].map(({ value, label }, i) => (
            <div key={label} className={`flex-1 px-6 py-4 text-center ${i < 3 ? "border-r border-navy-800" : ""}`}>
              <p className="text-xl font-bold text-white">{value}</p>
              <p className="text-[11px] text-gray-600 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Architected for Scale */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 pb-16">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <p className="text-[11px] text-gray-600 uppercase tracking-widest font-semibold mb-3">Capabilities</p>
            <h2 className="text-3xl font-bold text-white mb-4">Architected for Scale.</h2>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
              Deep integration capabilities meeting stringent security protocols, designed specifically for national infrastructure demands.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: MessageSquare, title: "Deep AI Insights", desc: "Multilingual intelligence across 40+ regional dialects.", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
              { icon: Globe, title: "Native Multilingual", desc: "Real-time semantic translation without latency penalties.", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
              { icon: FileText, title: "Intelligence Extraction", desc: "OCR engine digitizes unstructured documents instantly.", color: "text-saffron-500", bg: "bg-saffron-500/10 border-saffron-500/20" },
              { icon: Lock, title: "Sovereign Security", desc: "Air-gapped deployment for sensitive government data.", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
            ].map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className={`card border ${bg} hover:scale-[1.02] transition-all duration-200`}>
                <div className={`w-8 h-8 ${bg} border rounded-xl flex items-center justify-center mb-3`}>
                  <Icon size={15} className={color} />
                </div>
                <h3 className="font-semibold text-white text-xs mb-1.5">{title}</h3>
                <p className="text-[11px] text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two feature showcase panels */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 pb-20">
        <div className="grid lg:grid-cols-2 gap-5">

          {/* Deep AI Insights panel */}
          <div className="card border border-navy-700 bg-navy-900 overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-600/5 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <p className="text-xs font-semibold text-white mb-1">Deep AI Insights</p>
              <p className="text-[11px] text-gray-600 mb-5 leading-relaxed max-w-xs">
                Multilingual intelligence powered by multi-modal capabilities. Data insights that drive intelligent decisions without latency penalties.
              </p>
              {/* Battery icon mockup */}
              <div className="flex items-center justify-center py-6">
                <div className="relative">
                  <div className="w-32 h-16 border-2 border-gray-600 rounded-lg flex items-center justify-center bg-navy-800">
                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-2 h-5 bg-gray-600 rounded-r-sm" />
                    <Activity size={28} className="text-gray-700" />
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-gray-700 text-center">On Battery</p>
            </div>
          </div>

          {/* Native Multilingual panel */}
          <div className="card border border-navy-700 bg-navy-900">
            <p className="text-xs font-semibold text-white mb-1">Native Multilingual</p>
            <p className="text-[11px] text-gray-600 mb-5 leading-relaxed">
              Real-time semantic translation across 40+ regional dialects without latency penalties.
            </p>
            <MockMultilingualUI />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-navy-800 py-7">
        <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-blue-600 rounded-md flex items-center justify-center">
              <Shield size={10} className="text-white" />
            </div>
            <span className="text-xs font-bold text-white">JanSahayak AI</span>
            <span className="text-[11px] text-gray-700">© 2025. Engineered for Intelligence.</span>
          </div>
          <div className="flex items-center gap-5 text-[11px] text-gray-600">
            {["Privacy", "Terms", "Changelog", "Status"].map(l => (
              <span key={l} className="hover:text-gray-400 cursor-pointer transition-colors">{l}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
