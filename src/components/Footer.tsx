import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Send, 
  ShieldCheck, 
  Clock, 
  Headphones, 
  ExternalLink,
  Mail,
  MapPin
} from 'lucide-react';
import { SITE_CONFIG } from '../config/site';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0a0a0c] border-t border-white/5 text-gray-400">
      {/* Upper highlights banner */}
      <div className="border-b border-white/5 bg-[#08080a] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#0d0d0f] border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-100">Instant Delivery</p>
              <p className="text-xs text-gray-500">1-5 mins automatic dispatch</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#0d0d0f] border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-100">100% Safe UID</p>
              <p className="text-xs text-gray-500">No passwords ever needed</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#0d0d0f] border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-100">24/7 Live Support</p>
              <p className="text-xs text-gray-500">Telegram @callmeriyadh</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#0d0d0f] border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-100">Best BDT Price</p>
              <p className="text-xs text-gray-500">Verified bKash & Nagad</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer contents */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 p-[1.5px] shadow-lg shadow-purple-500/20">
                <div className="w-full h-full bg-[#050505] rounded-full flex items-center justify-center">
                  <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
                </div>
              </div>
              <span className="font-black text-2xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 font-display">
                {SITE_CONFIG.name}
              </span>
            </Link>
            
            <p className="text-xs font-bold tracking-[0.2em] text-cyan-400 uppercase">
              {SITE_CONFIG.tagline}
            </p>

            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              NEXORA is Bangladesh's dedicated gaming <span className="text-red-500 font-semibold">top-up</span> store. We empower gamers across the country with lightning-fast in-game credits, diamonds, UC, and passes at unbeatable rates.
            </p>

            {/* Payment Badges */}
            <div className="pt-2">
              <p className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Accepted BD Payment Wallets:</p>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400 font-bold text-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                  bKash Personal
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 font-bold text-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  Nagad Personal
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-200">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-cyan-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/games" className="hover:text-cyan-400 transition-colors">
                  Games Marketplace
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <span>Track Order</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    Live
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-cyan-400 transition-colors">
                  FAQ & Guides
                </Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-cyan-400 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-cyan-400 transition-colors">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Pages */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-200">
              Legal & Trust
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/privacy-policy" className="hover:text-cyan-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="hover:text-cyan-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-cyan-400 transition-colors">
                  Refund & Return Policy
                </Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-cyan-400 transition-colors">
                  Manual Payment Verification
                </Link>
              </li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-200">
              Support & Contact
            </h3>
            <div className="space-y-3 text-sm text-gray-400">
              {/* Telegram Support Block as requested */}
              <div className="p-3 rounded-xl bg-[#0d0d0f] border border-cyan-500/20 hover:border-cyan-500/40 transition-all">
                <a
                  href="https://t.me/callmeriyadh"
                  target="_blank"
                  rel="noreferrer"
                  id="footer-telegram-contact-link"
                  className="block group"
                >
                  <div className="flex items-center gap-2 text-white font-bold text-sm group-hover:text-cyan-400 transition-colors">
                    <Send className="w-4 h-4 text-cyan-400" />
                    <span>Telegram Support</span>
                  </div>
                  <div className="text-xs font-mono text-cyan-400 font-semibold mt-0.5 group-hover:underline">
                    @callmeriyadh
                  </div>
                </a>

                {/* Primary Action Button: Chat on Telegram */}
                <a
                  href="https://t.me/callmeriyadh"
                  target="_blank"
                  rel="noreferrer"
                  id="btn-footer-chat-telegram"
                  className="mt-2.5 w-full py-2 px-3 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 hover:border-cyan-500/50 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Chat on Telegram</span>
                </a>
              </div>

              <div className="flex items-center gap-2 pt-1 text-xs text-gray-500">
                <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                <a
                  href={`mailto:${SITE_CONFIG.support.email}`}
                  id="footer-email-link"
                  className="hover:text-cyan-400 transition-colors"
                >
                  {SITE_CONFIG.support.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                <span>{SITE_CONFIG.support.location}</span>
              </div>
            </div>

            {/* Social Icons row */}
            <div className="pt-2 flex items-center gap-2">
              <a
                href={SITE_CONFIG.social.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="NEXORA Facebook"
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-purple-500/20 hover:text-purple-400 border border-white/10 flex items-center justify-center text-gray-300 transition-all text-xs font-bold"
              >
                FB
              </a>
              <a
                href={SITE_CONFIG.social.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="NEXORA Instagram"
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-purple-500/20 hover:text-purple-400 border border-white/10 flex items-center justify-center text-gray-300 transition-all text-xs font-bold"
              >
                IG
              </a>
              <a
                href="https://t.me/callmeriyadh"
                target="_blank"
                rel="noreferrer"
                aria-label="NEXORA Telegram"
                className="w-8 h-8 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center transition-all text-xs font-bold"
              >
                TG
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright & operational status bar */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-4 uppercase tracking-[0.15em]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Systems Operational
            </span>
            <span>•</span>
            <span>Supported: bKash / Nagad</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/terms-of-service" className="hover:text-cyan-400 transition-colors">Terms of Service</Link>
            <Link to="/refund-policy" className="hover:text-cyan-400 transition-colors">Refund Policy</Link>
            <span className="text-white font-medium">© {new Date().getFullYear()} {SITE_CONFIG.name} — Power Up Your Game</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
