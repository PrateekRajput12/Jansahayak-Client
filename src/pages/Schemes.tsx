import { useEffect, useState, useRef } from "react";
import { Search, BookOpen, ChevronRight } from "lucide-react";
import api from "../services/api";
import { Scheme } from "../types";
import ApplyModal from "../components/ui/ApplyModal";

const CATEGORIES = ["all", "education", "health", "agriculture", "housing", "employment", "women", "senior", "disability", "other"];

export default function Schemes() {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Scheme | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSchemes = (q: string, cat: string, p: number) => {
    setLoading(true);
    const params: any = { page: p, limit: 9 };
    if (cat !== "all") params.category = cat;
    if (q) params.search = q;
    api.get("/schemes", { params })
      .then(({ data }) => { setSchemes(data.schemes); setTotal(data.total); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchSchemes(search, category, page); }, [category, page]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearch(q);
    setPage(1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSchemes(q, category, 1), 300);
  };

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchSchemes(search, category, 1); };

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-white">Government Schemes</h1>

      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input className="input pl-9" placeholder="Search schemes..." value={search} onChange={handleSearchChange} />
        </div>
        <button type="submit" className="btn-primary px-5">Search</button>
      </form>

      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => { setCategory(c); setPage(1); }}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all capitalize ${
              category === c ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"
            }`}>
            {c}
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-500">{total} schemes found</p>

      {loading ? (
        <div className="grid md:grid-cols-3 gap-4">{[...Array(6)].map((_, i) => (
          <div key={i} className="card animate-pulse h-36 bg-gray-800" />
        ))}</div>
      ) : schemes.length === 0 ? (
        <div className="card text-center py-12">
          <BookOpen size={36} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No schemes found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {schemes.map((s) => (
            <div key={s._id} className="card hover:border-gray-700 transition-all flex flex-col">
              <span className="text-xs font-medium text-saffron-500 uppercase tracking-wide">{s.category}</span>
              <h3 className="font-semibold text-white mt-1 mb-2 flex-1 leading-snug">{s.title}</h3>
              <p className="text-sm text-gray-400 mb-3 line-clamp-2">{s.description}</p>
              {s.ministry && <p className="text-xs text-gray-600 mb-3">{s.ministry}</p>}
              <button onClick={() => setSelected(s)}
                className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors mt-auto">
                Apply Now <ChevronRight size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {total > 9 && (
        <div className="flex justify-center gap-3">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-primary disabled:opacity-40">← Prev</button>
          <span className="text-gray-400 text-sm py-2">Page {page}</span>
          <button disabled={page * 9 >= total} onClick={() => setPage(p => p + 1)} className="btn-primary disabled:opacity-40">Next →</button>
        </div>
      )}

      {selected && <ApplyModal scheme={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
