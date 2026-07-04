import { Link } from "react-router-dom";
import { Home, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="text-center space-y-5 max-w-sm">
        <div className="w-20 h-20 bg-saffron-500/10 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle size={36} className="text-saffron-500" />
        </div>
        <div>
          <h1 className="text-6xl font-bold text-white mb-2">404</h1>
          <p className="text-gray-400 text-lg">Page not found</p>
          <p className="text-gray-600 text-sm mt-2">The page you're looking for doesn't exist or has been moved.</p>
        </div>
        <Link to="/dashboard" className="btn-primary inline-flex items-center gap-2">
          <Home size={16} /> Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
