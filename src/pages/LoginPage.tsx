import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Key, Mail, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SITE_CONFIG } from '../config/site';

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/profile';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter your email/phone and password.');
      return;
    }

    setIsLoading(true);
    const result = await login(email.trim(), password);
    setIsLoading(false);

    if (result.success) {
      const from = (location.state as any)?.from?.pathname || '/profile';
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Failed to log in');
    }
  };

  const handleFillDemo = () => {
    setEmail('tanvir@gamer.bd');
    setPassword('nexora123');
    setError('');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-20">
      <div className="bg-[#0d0d0f] border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-cyan-400 flex items-center justify-center mx-auto">
            <LogIn className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white font-display">
            Sign In to NEXORA
          </h1>
          <p className="text-xs text-gray-400">
            Access your order history, save your Player UIDs, and track deliveries.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Email or Mobile Number
            </label>
            <div className="relative">
              <input
                type="text"
                id="login-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com or 01XXXXXXXXX"
                className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 pl-10 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400"
              />
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Password
              </label>
              <span className="text-[11px] text-gray-500 hover:text-gray-300 cursor-pointer">
                Forgot password?
              </span>
            </div>
            <div className="relative">
              <input
                type="password"
                id="login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 pl-10 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400 font-mono"
              />
              <Key className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            id="btn-login-submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider text-black bg-white hover:bg-cyan-400 shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Quick Fill for Reviewers */}
        <div className="p-3 bg-[#050505] rounded-xl border border-white/5 text-xs text-gray-400 flex items-center justify-between">
          <span>Quick Demo Account:</span>
          <button
            type="button"
            onClick={handleFillDemo}
            className="text-cyan-400 font-bold hover:underline"
          >
            Click to Auto-fill
          </button>
        </div>

        <div className="pt-2 text-center text-xs text-gray-400 border-t border-white/5">
          Don't have a NEXORA account?{' '}
          <Link to="/register" className="text-cyan-400 font-bold hover:underline">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};
