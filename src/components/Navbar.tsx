import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Gamepad2, 
  Search, 
  ShoppingCart, 
  User as UserIcon, 
  Menu, 
  X, 
  ChevronDown, 
  Package, 
  Headphones, 
  HelpCircle, 
  LogOut,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { GAMES_DATA } from '../data/games';
import { SITE_CONFIG } from '../config/site';

export const Navbar: React.FC = () => {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  // Click outside listener for user dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = searchQuery.trim()
    ? GAMES_DATA.filter(
        (g) =>
          g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          g.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          g.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/games?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            id="nav-logo"
            className="flex items-center gap-2.5 group transition-transform active:scale-95"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 p-[1.5px] shadow-lg shadow-purple-500/20 group-hover:shadow-cyan-400/30 transition-shadow">
              <div className="w-full h-full bg-[#050505] rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-cyan-400 fill-cyan-400/20 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-2xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 font-display">
                {SITE_CONFIG.name}
              </span>
              <span className="text-[9px] font-bold tracking-[0.2em] text-cyan-400 uppercase -mt-1 hidden sm:block">
                <span className="text-red-500 font-extrabold">Top-Up</span> Bangladesh
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-3">
            <Link
              to="/"
              id="nav-link-home"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-widest transition-all ${
                isActive('/')
                  ? 'text-cyan-400 bg-white/5 border border-white/10'
                  : 'text-gray-400 hover:text-cyan-400 hover:bg-white/[0.03]'
              }`}
            >
              Home
            </Link>
            <Link
              to="/games"
              id="nav-link-games"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-widest transition-all ${
                isActive('/games')
                  ? 'text-cyan-400 bg-white/5 border border-white/10'
                  : 'text-gray-400 hover:text-cyan-400 hover:bg-white/[0.03]'
              }`}
            >
              Games
            </Link>
            <Link
              to="/track-order"
              id="nav-link-track"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-widest transition-all flex items-center gap-1.5 ${
                isActive('/track-order')
                  ? 'text-cyan-400 bg-white/5 border border-cyan-400/30'
                  : 'text-gray-400 hover:text-cyan-400 hover:bg-white/[0.03]'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Track Order</span>
            </Link>
            <Link
              to="/support"
              id="nav-link-support"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-widest transition-all flex items-center gap-1.5 ${
                isActive('/support')
                  ? 'text-cyan-400 bg-white/5 border border-white/10'
                  : 'text-gray-400 hover:text-cyan-400 hover:bg-white/[0.03]'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Support</span>
            </Link>
            <Link
              to="/faq"
              id="nav-link-faq"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-widest transition-all ${
                isActive('/faq')
                  ? 'text-cyan-400 bg-white/5 border border-white/10'
                  : 'text-gray-400 hover:text-cyan-400 hover:bg-white/[0.03]'
              }`}
            >
              FAQ
            </Link>
          </nav>

          {/* Desktop Right Actions (Search, Cart, User) */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Quick Search Button / Pill */}
            <div className="relative">
              <button
                type="button"
                id="btn-nav-search"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search games"
                className="h-9 px-3 sm:px-4 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 flex items-center gap-2 transition-colors text-xs"
              >
                <Search className="w-3.5 h-3.5 text-gray-400" />
                <span className="hidden sm:inline text-xs text-gray-400">Search games...</span>
              </button>

              {/* Search dropdown modal */}
              {searchOpen && (
                <div className="absolute right-0 top-12 w-80 sm:w-96 bg-[#0d0d0f] border border-white/10 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <form onSubmit={handleSearchSubmit} className="relative">
                    <input
                      ref={searchInputRef}
                      type="text"
                      id="nav-search-input"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search Free Fire, PUBG, Robux..."
                      autoFocus
                      className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 pl-10 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    />
                    <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-white text-xs bg-white/10 px-1.5 py-0.5 rounded"
                      >
                        Clear
                      </button>
                    )}
                  </form>

                  {/* Search Results Dropdown */}
                  {searchQuery.trim() && (
                    <div className="mt-3 divide-y divide-white/5 max-h-64 overflow-y-auto">
                      {searchResults.length > 0 ? (
                        searchResults.map((game) => (
                          <Link
                            key={game.id}
                            to={`/games/${game.id}`}
                            onClick={() => setSearchOpen(false)}
                            className="flex items-center gap-3 py-2 px-2 hover:bg-white/5 rounded-lg transition-colors group"
                          >
                            <img
                              src={game.image}
                              alt={game.name}
                              className="w-10 h-10 object-cover rounded-lg border border-white/10"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-100 group-hover:text-cyan-400 truncate">
                                {game.name}
                              </p>
                              <p className="text-xs text-gray-400">
                                {game.category} • Instant <span className="text-red-500 font-semibold">Top-Up</span>
                              </p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-cyan-400" />
                          </Link>
                        ))
                      ) : (
                        <div className="py-6 text-center text-sm text-gray-400">
                          No games found matching "{searchQuery}".
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-2 pt-2 border-t border-white/5 flex justify-between items-center text-xs text-gray-400">
                    <span>Press Enter to view all</span>
                    <button
                      type="button"
                      onClick={() => setSearchOpen(false)}
                      className="text-gray-400 hover:text-gray-200"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Button with Purple Glow Pill Style */}
            <Link
              to="/cart"
              id="btn-nav-cart"
              aria-label={`Cart with ${totalItems} items`}
              className="relative flex items-center gap-2 px-3.5 py-2 bg-purple-600/10 border border-purple-500/20 rounded-full text-purple-400 hover:bg-purple-600/20 hover:border-purple-500/40 transition-colors"
            >
              <ShoppingCart className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold tracking-tight">
                {totalItems > 0 ? `${totalItems} ${totalItems === 1 ? 'Item' : 'Items'}` : 'Cart'}
              </span>
              {totalItems > 0 && (
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              )}
            </Link>

            {/* User Dropdown or Login */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  id="btn-user-dropdown"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-white/5 border border-white/10 hover:border-purple-500/40 transition-all text-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 p-[1px] shadow-sm">
                    <div className="w-full h-full rounded-full bg-[#050505] flex items-center justify-center text-white font-bold text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <span className="hidden sm:inline font-medium text-gray-200 max-w-[100px] truncate text-xs">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-12 w-56 bg-[#0d0d0f] border border-white/10 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-white/5">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      id="nav-dropdown-profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-purple-400" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to="/order-history"
                      id="nav-dropdown-orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Package className="w-4 h-4 text-cyan-400" />
                      <span>Order History</span>
                    </Link>

                    <Link
                      to="/track-order"
                      id="nav-dropdown-track"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Track Order</span>
                    </Link>

                    <div className="my-1 border-t border-white/5" />

                    <button
                      type="button"
                      id="btn-nav-logout"
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-950/30 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  to="/login"
                  id="btn-nav-login"
                  className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-tight text-white border border-white/20 hover:bg-white/5 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  id="btn-nav-register"
                  className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-tight text-black bg-white hover:bg-cyan-400 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 md:hidden rounded-xl bg-white/5 text-gray-300 hover:text-white border border-white/10 transition-colors"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#0a0a0c]/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4">
          <div className="grid grid-cols-2 gap-2 pb-2">
            <Link
              to="/games"
              id="mobile-nav-games"
              className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-200 text-sm font-medium"
            >
              <Gamepad2 className="w-4 h-4 text-purple-400" />
              <span>All Games</span>
            </Link>
            <Link
              to="/track-order"
              id="mobile-nav-track"
              className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-cyan-400 text-sm font-medium"
            >
              <Package className="w-4 h-4" />
              <span>Track Order</span>
            </Link>
          </div>

          <div className="space-y-1">
            <Link
              to="/"
              id="mobile-nav-home"
              className={`block px-3 py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wider ${
                isActive('/') ? 'text-cyan-400 bg-white/5 border border-white/10' : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              Home
            </Link>
            <Link
              to="/games"
              className={`block px-3 py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wider ${
                isActive('/games') ? 'text-cyan-400 bg-white/5 border border-white/10' : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              Games Catalog
            </Link>
            <Link
              to="/track-order"
              id="mobile-nav-track-link"
              className={`block px-3 py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wider ${
                isActive('/track-order') ? 'text-cyan-400 bg-white/5 border border-white/10' : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              Track Order
            </Link>
            <Link
              to="/support"
              id="mobile-nav-support"
              className={`block px-3 py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wider ${
                isActive('/support') ? 'text-cyan-400 bg-white/5 border border-white/10' : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              Support & Contact
            </Link>
            <Link
              to="/faq"
              id="mobile-nav-faq"
              className={`block px-3 py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wider ${
                isActive('/faq') ? 'text-cyan-400 bg-white/5 border border-white/10' : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              Frequently Asked Questions
            </Link>
            <Link
              to="/cart"
              id="mobile-nav-cart"
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wider text-gray-300 hover:bg-white/5"
            >
              <span className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-purple-400" />
                <span>My Cart</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-purple-600/20 text-purple-300 text-xs font-bold">
                {totalItems} items
              </span>
            </Link>
          </div>

          {user ? (
            <div className="pt-3 border-t border-white/5 space-y-1">
              <div className="px-3 py-2 text-xs text-gray-400">
                Logged in as <span className="text-white font-medium">{user.name}</span>
              </div>
              <Link
                to="/profile"
                id="mobile-nav-profile"
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 rounded-lg"
              >
                <UserIcon className="w-4 h-4 text-purple-400" />
                Profile & Settings
              </Link>
              <Link
                to="/order-history"
                id="mobile-nav-orders"
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 rounded-lg"
              >
                <Package className="w-4 h-4 text-cyan-400" />
                Order History
              </Link>
              <button
                type="button"
                id="mobile-btn-logout"
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-950/20 rounded-lg text-left"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-2">
              <Link
                to="/login"
                id="mobile-btn-login"
                className="py-2.5 text-center text-xs font-bold uppercase tracking-tight rounded-lg bg-white/5 text-gray-200 border border-white/10 hover:bg-white/10"
              >
                Log In
              </Link>
              <Link
                to="/register"
                id="mobile-btn-register"
                className="py-2.5 text-center text-xs font-bold uppercase tracking-tight rounded-lg bg-white text-black hover:bg-cyan-400"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
