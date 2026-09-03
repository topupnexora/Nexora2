import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Home, Search } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-24 h-24 rounded-3xl bg-zinc-900 border border-purple-500/30 flex items-center justify-center text-purple-400 mx-auto shadow-2xl">
        <Gamepad2 className="w-12 h-12" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono">
          Error 404 • Level Not Found
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white font-display">
          Lost in the Nexus?
        </h1>
        <p className="text-sm text-zinc-400 max-w-md mx-auto">
          The page or game you are looking for has been moved, respawned elsewhere, or never existed in this dimension.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <Link
          to="/"
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-lg shadow-purple-600/25 transition-all flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
        <Link
          to="/games"
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-xs text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 transition-colors flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4" />
          <span>Browse All Games</span>
        </Link>
      </div>
    </div>
  );
};
