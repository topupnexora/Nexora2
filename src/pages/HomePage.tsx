import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Package, 
  ShieldCheck, 
  Clock, 
  Headphones, 
  ArrowRight, 
  Flame, 
  Sparkles, 
  Star, 
  HelpCircle,
  Gamepad2,
  ChevronRight,
  Send,
  CheckCircle2
} from 'lucide-react';
import { GAMES_DATA, REVIEWS, FAQS_DATA, CATEGORIES } from '../data/games';
import { GameCard } from '../components/GameCard';
import { HeroSection } from '../components/HeroSection';
import { HighlightTopUp } from '../components/HighlightTopUp';
import { SITE_CONFIG } from '../config/site';

export const HomePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredGames = selectedCategory === 'All'
    ? GAMES_DATA
    : GAMES_DATA.filter((g) => g.category === selectedCategory);

  return (
    <div className="space-y-12 sm:space-y-16 pb-20 overflow-hidden">
      {/* 1. TOP HERO: CLEAN COMPACT TWO-COLUMN LAYOUT */}
      <HeroSection />

      {/* 2. ALL GAMES — NORMAL STATIC GRID */}
      <section id="all-games-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-white/5 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-bold uppercase tracking-[0.2em] text-purple-400 mb-2">
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Store Catalog</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white font-display">
              All Games
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-xl">
              Choose your title below for instant <span className="text-red-500 font-semibold">top-up</span>. 100% password-free Player UID delivery with Send Money.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                id={`cat-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-white text-black shadow-lg shadow-white/10'
                    : 'bg-[#0d0d0f] text-gray-400 hover:text-white border border-white/5 hover:border-white/15'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Static Gaming Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* 3. Why Choose NEXORA */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
            Engineered For Gamers
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-display mt-2">
            Why Choose NEXORA?
          </h2>
          <p className="text-sm text-gray-400 mt-3">
            We understand the gaming hustle. That's why NEXORA is built around speed, zero hassle, and fair Bangladeshi Taka rates.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#0d0d0f] border border-white/5 hover:border-white/15 rounded-2xl p-6 transition-all hover:bg-[#121216] group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-5 group-hover:scale-105 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold uppercase tracking-tight text-gray-100 mb-2">Instant Delivery</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Diamonds, UC, and Robux delivered to your Player UID in 1 to 5 minutes after payment verification.
            </p>
          </div>

          <div className="bg-[#0d0d0f] border border-white/5 hover:border-white/15 rounded-2xl p-6 transition-all hover:bg-[#121216] group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold uppercase tracking-tight text-gray-100 mb-2">Secure Payment</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Direct Send Money to designated bKash and Nagad numbers. Zero risk of gateway data leaks or password requirements.
            </p>
          </div>

          <div className="bg-[#0d0d0f] border border-white/5 hover:border-white/15 rounded-2xl p-6 transition-all hover:bg-[#121216] group">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-5 group-hover:scale-105 transition-transform">
              <Headphones className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold uppercase tracking-tight text-gray-100 mb-2">24/7 Live Support</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Direct Telegram support (@callmeriyadh) ready to assist with order tracking, transaction verification, and queries.
            </p>
          </div>

          <div className="bg-[#0d0d0f] border border-white/5 hover:border-white/15 rounded-2xl p-6 transition-all hover:bg-[#121216] group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold uppercase tracking-tight text-gray-100 mb-2">Best Price Guarantee</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Transparent BDT pricing with no hidden checkout taxes or surprise processing fees. What you see is what you pay.
            </p>
          </div>
        </div>
      </section>

      {/* 4. How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0d0d0f] border border-white/5 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 blur-3xl pointer-events-none" />

          <div className="text-center max-w-xl mx-auto mb-12 relative z-10">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400">
              5 Simple Steps
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-display mt-1">
              How It Works
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-2">
              Getting in-game currency on NEXORA is faster than loading a match.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
            <div className="bg-[#08080a] border border-white/5 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-2xl font-black text-purple-400 font-display block mb-2">01</span>
                <h4 className="text-sm font-bold uppercase tracking-tight text-gray-100">Select Game</h4>
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                  Choose Free Fire, PUBG, MLBB, Roblox, COD, or EA FC.
                </p>
              </div>
            </div>

            <div className="bg-[#08080a] border border-white/5 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-2xl font-black text-indigo-400 font-display block mb-2">02</span>
                <h4 className="text-sm font-bold uppercase tracking-tight text-gray-100">Enter Player ID</h4>
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                  Input your numeric UID or Zone ID directly from your game profile.
                </p>
              </div>
            </div>

            <div className="bg-[#08080a] border border-white/5 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-2xl font-black text-cyan-400 font-display block mb-2">03</span>
                <h4 className="text-sm font-bold uppercase tracking-tight text-gray-100">Select Package</h4>
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                  Pick your favorite Diamond or UC bundle with special discounts.
                </p>
              </div>
            </div>

            <div className="bg-[#08080a] border border-white/5 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-2xl font-black text-pink-400 font-display block mb-2">04</span>
                <h4 className="text-sm font-bold uppercase tracking-tight text-gray-100">Pay via bKash/Nagad</h4>
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                  Send Money to our designated number & submit your TrxID.
                </p>
              </div>
            </div>

            <div className="bg-[#08080a] border border-cyan-500/30 rounded-2xl p-5 flex flex-col justify-between bg-cyan-950/20">
              <div>
                <span className="text-2xl font-black text-cyan-400 font-display block mb-2">05</span>
                <h4 className="text-sm font-bold uppercase tracking-tight text-cyan-300">Receive <span className="text-red-500">Top-Up</span></h4>
                <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">
                  In 1-5 minutes, open your game and enjoy your new credits!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Customer Reviews & Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
            Community Love
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-display mt-1">
            What Gamers Say
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-2">
            Real feedback from Bangladesh's most passionate competitive gamers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              className="bg-[#0d0d0f] border border-white/5 rounded-2xl p-5 flex flex-col justify-between hover:border-white/15 transition-colors"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-gray-300 italic leading-relaxed mb-4">
                  "<HighlightTopUp text={review.comment} redClassName="text-red-500 font-semibold" />"
                </p>
              </div>
              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-tight text-gray-100">{review.name}</h5>
                  <span className="text-[10px] text-cyan-400 font-medium uppercase tracking-wider">{review.game} Gamer</span>
                </div>
                <span className="text-[10px] text-gray-500">{review.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FAQ Preview */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-display mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS_DATA.slice(0, 4).map((faq) => (
            <div
              key={faq.id}
              className="bg-[#0d0d0f] border border-white/5 rounded-2xl p-5 text-left"
            >
              <h4 className="text-sm font-bold text-gray-100 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                <HighlightTopUp text={faq.question} redClassName="text-red-500 font-bold" />
              </h4>
              <p className="text-xs text-gray-400 mt-2 pl-6 leading-relaxed">
                <HighlightTopUp text={faq.answer} redClassName="text-red-500 font-semibold" />
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/faq"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400 hover:text-cyan-300"
          >
            <span>View All FAQs and Guides</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 7. Call To Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-14 bg-gradient-to-r from-purple-950/30 via-[#0d0d0f] to-cyan-950/30 border border-white/10 text-center shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black text-white font-display uppercase tracking-tight">
              Ready To Level Up?
            </h2>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
              Don't wait in line or pay overpriced third-party fees. Jump straight into the action with instant {SITE_CONFIG.name} <span className="text-red-500 font-semibold">top-ups</span>.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/games"
                id="cta-btn-topup"
                className="w-full sm:w-auto px-8 py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider text-black bg-white hover:bg-cyan-400 shadow-xl transition-all active:scale-95"
              >
                Explore All Games
              </Link>
              <a
                href="https://t.me/callmeriyadh"
                target="_blank"
                rel="noreferrer"
                id="cta-btn-telegram"
                className="w-full sm:w-auto px-8 py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider text-white bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 hover:border-cyan-500/50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/10 active:scale-95"
              >
                <Send className="w-4 h-4 text-cyan-400" />
                <span>Chat on Telegram</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
