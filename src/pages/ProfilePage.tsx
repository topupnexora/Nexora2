import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  LogOut, 
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Edit2,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import { formatPrice, formatDate } from '../utils/format';

export const ProfilePage: React.FC = () => {
  const { user, logout, updateProfile } = useAuth();
  const { orders } = useOrder();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Please Sign In</h2>
        <p className="text-xs text-zinc-400">
          Sign in to view your user profile, saved gamer IDs, and past top-ups.
        </p>
        <Link
          to="/login"
          className="inline-block px-6 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-500 transition-colors"
        >
          Go to Sign In
        </Link>
      </div>
    );
  }

  // Calculate order stats for user
  const userOrders = orders.filter(
    (o) => o.customerName.toLowerCase() === user.name.toLowerCase() || o.phone === user.phone
  );
  const completedOrders = userOrders.filter((o) => o.status === 'Completed');
  const totalSpent = userOrders
    .filter((o) => o.status === 'Completed')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, phone, email });
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Header Profile Hero */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-white text-2xl sm:text-3xl font-black font-display shadow-lg shadow-purple-600/30">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white font-display">
                {user.name}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                Verified Gamer
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1 flex items-center gap-3">
              <span>{user.phone}</span>
              {user.email && <span>• {user.email}</span>}
            </p>
            <div className="text-[11px] text-zinc-500 mt-1 flex items-center gap-1.5">
              <Calendar className="w-3 h-3" />
              <span>Member since {formatDate(user.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-200 transition-colors flex items-center justify-center gap-1.5"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-900/50 text-xs font-bold text-red-300 transition-colors flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Profile information updated successfully!</span>
        </div>
      )}

      {/* Edit Form (if active) */}
      {isEditing && (
        <form
          onSubmit={handleSaveProfile}
          className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4 animate-in fade-in duration-200"
        >
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Edit Account Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Mobile Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-6 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white transition-colors"
          >
            Save Changes
          </button>
        </form>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-900/70 border border-zinc-800 p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white font-display">{userOrders.length}</div>
            <div className="text-xs text-zinc-400">Total Orders Placed</div>
          </div>
        </div>

        <div className="bg-zinc-900/70 border border-zinc-800 p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white font-display">{completedOrders.length}</div>
            <div className="text-xs text-zinc-400">Completed Top-Ups</div>
          </div>
        </div>

        <div className="bg-zinc-900/70 border border-zinc-800 p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white font-display">{formatPrice(totalSpent)}</div>
            <div className="text-xs text-zinc-400">Total Lifetime Spent</div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Order History CTA */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 sm:p-8 backdrop-blur-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <h2 className="text-lg font-bold text-white font-display">
            Recent Orders ({userOrders.length})
          </h2>
          <Link
            to="/order-history"
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>View All History</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {userOrders.length > 0 ? (
          <div className="space-y-3">
            {userOrders.slice(0, 3).map((ord) => (
              <div
                key={ord.orderId}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-zinc-950/70 border border-zinc-800/80 rounded-2xl gap-4 hover:border-zinc-700 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      {ord.orderId}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ord.status === 'Completed'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                          : ord.status === 'Processing'
                          ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/30'
                          : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-300 mt-1">
                    {ord.items.map((i) => `${i.quantity}x ${i.gameName} (${i.packageName})`).join(', ')}
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">
                    {formatDate(ord.createdAt)} via {ord.paymentMethod}
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="text-sm font-black text-white">
                    {formatPrice(ord.totalAmount)}
                  </span>
                  <Link
                    to={`/track-order?orderId=${encodeURIComponent(ord.orderId)}`}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-200 transition-colors"
                  >
                    Track Status
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-zinc-500">
            No orders placed yet. Select a game to top up your first package!
          </div>
        )}
      </div>
    </div>
  );
};
