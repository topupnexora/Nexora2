import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User, Mail, Phone, Key, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isValidBDPhone } from '../utils/format';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!phone.trim() || !isValidBDPhone(phone)) {
      setError('Please enter a valid 11-digit Bangladeshi mobile number (01XXXXXXXXX).');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    const res = await register({
      name: name.trim(),
      email: email.trim() || `${phone.trim()}@nexora.bd`,
      phone: phone.trim(),
      password
    });
    setIsLoading(false);

    if (res.success) {
      navigate('/profile');
    } else {
      setError(res.error || 'Registration failed.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-20">
      <div className="bg-[#0d0d0f] border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-cyan-400 flex items-center justify-center mx-auto">
            <UserPlus className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white font-display">
            Join NEXORA
          </h1>
          <p className="text-xs text-gray-400">
            Create an account for one-click checkout and saved gamer tags.
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
              Full Name <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="reg-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tanvir Ahmed"
                className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 pl-10 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400"
              />
              <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Mobile Number <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                id="reg-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 pl-10 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400 font-mono"
              />
              <Phone className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Email Address <span className="text-gray-500 font-normal lowercase">(optional)</span>
            </label>
            <div className="relative">
              <input
                type="email"
                id="reg-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="gamer@gmail.com"
                className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 pl-10 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400"
              />
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Password <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type="password"
                id="reg-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 pl-10 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400 font-mono"
              />
              <Key className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Confirm Password <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type="password"
                id="reg-confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 pl-10 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400 font-mono"
              />
              <Key className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            id="btn-register-submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider text-black bg-white hover:bg-cyan-400 shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            <span>{isLoading ? 'Creating Account...' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-gray-400 border-t border-white/5">
          Already registered?{' '}
          <Link to="/login" className="text-cyan-400 font-bold hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
