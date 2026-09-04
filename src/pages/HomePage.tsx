import React from 'react';
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
  CheckCircle2, 
  Star, 
  HelpCircle,
  Gamepad2,
  ChevronRight,
  Send
} from 'lucide-react';
import { GAMES_DATA, REVIEWS, FAQS_DATA } from '../data/games';
import { GameCard } from '../components/GameCard';
import { SITE_CONFIG } from '../config/site';

export const HomePage: React.FC = () => {
  const featuredGames = GAMES_DATA.filter((g) => g.featured);
  const popularGames = GAMES_DATA.filter((g) => g.popular);

  return (
    <div className="space-y-20 sm:space-y-28 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[560px] lg:min-h-[640px] flex items-center justify-center pt-8 pb-16">
        {/* Background Gaming Artwork & Gradients */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=2000&q=80"
            alt="NEXORA Gaming Top-Up"
            className="w-full h-full object-cover object-center opacity-15 filter brightness-50 contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/60 via-[#050505]/95 to-[#050505]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-purple-600/10 blur-[140px] rounded-full pointer-events-none" />
          <div className="absolute top-1/2 left-1/4 w-[350px] h-[250px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Top Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>Bangladesh's #1 Gaming Top-Up Store</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-none font-display">
            POWER UP <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400">YOUR GAME</span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-sm sm:text-base lg:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed font-normal">
            Direct diamonds, UC, CP, and points top-up for Free Fire, PUBG, MLBB, EA FC & Roblox. Safe UID delivery in under 5 minutes with bKash & Nagad.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/games"
              id="hero-btn-explore"
              className="w-full sm:w-auto px-7 py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider text-black bg-white hover:bg-cyan-400 shadow-xl transition-all duration-300 flex items-center justify-center gap-2.5 group active:scale-95"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Explore Games</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/track-order"
              id="hero-btn-track"
              className="w-full sm:w-auto px-7 py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider text-white bg-white/5 hover:bg-white/10 border border-white/10 shadow-lg backdrop-blur-md transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
            >
              <Package className="w-4 h-4 text-cyan-400" />
              <span>Track Order</span>
            </Link>
          </div>

          {/* Trust badges row */}
          <div className="mt-14 pt-8 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left sm:text-center">
            <div className="p-3 rounded-xl bg-[#0d0d0f]/60 border border-white/5">
              <div className="text-lg sm:text-xl font-extrabold text-cyan-400 font-display">1-5 MINS</div>
              <div className="text-[11px] text-gray-500 uppercase tracking-wider mt-0.5">Average Delivery Time</div>
            </div>
            <div className="p-3 rounded-xl bg-[#0d0d0f]/60 border border-white/5">
              <div className="text-lg sm:text-xl font-extrabold text-purple-400 font-display">100% SECURE</div>
              <div className="text-[11px] text-gray-500 uppercase tracking-wider mt-0.5">UID Only (No Password)</div>
            </div>
            <div className="p-3 rounded-xl bg-[#0d0d0f]/60 border border-white/5">
              <div className="text-lg sm:text-xl font-extrabold text-emerald-400 font-display">50,000+</div>
              <div className="text-[11px] text-gray-500 uppercase tracking-wider mt-0.5">Bangladeshi Gamers</div>
            </div>
            <div className="p-3 rounded-xl bg-[#0d0d0f]/60 border border-white/5">
              <div className="text-lg sm:text-xl font-extrabold text-pink-400 font-display">bKash & Nagad</div>
              <div className="text-[11px] text-gray-500 uppercase tracking-wider mt-0.5">Personal Send Money</div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Games Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400 mb-1">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span>Trending in Bangladesh</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Popular Games
            </h2>
          </div>
          <Link
            to="/games"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>View All Games</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularGames.slice(0, 3).map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* Featured Games Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1">
              <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400" />
              <span>Handpicked Catalog</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Featured Top-Up Titles
            </h2>
          </div>
          <Link
            to="/games"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>Browse All {GAMES_DATA.length} Games</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* Why Choose NEXORA */}
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
              Direct Send Money to verified bKash and Nagad numbers. Zero risk of gateway data leaks or password requirements.
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

      {/* How It Works */}
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
                  Send Money to our merchant number & submit your TrxID.
                </p>
              </div>
            </div>

            <div className="bg-[#08080a] border border-cyan-500/30 rounded-2xl p-5 flex flex-col justify-between bg-cyan-950/20">
              <div>
                <span className="text-2xl font-black text-cyan-400 font-display block mb-2">05</span>
                <h4 className="text-sm font-bold uppercase tracking-tight text-cyan-300">Receive Top-Up</h4>
                <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">
                  In 1-5 minutes, open your game and enjoy your new diamonds!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews & Testimonials */}
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
                  "{review.comment}"
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

      {/* FAQ Preview */}
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
                {faq.question}
              </h4>
              <p className="text-xs text-gray-400 mt-2 pl-6 leading-relaxed">
                {faq.answer}
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

      {/* Call To Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-14 bg-gradient-to-r from-purple-950/30 via-[#0d0d0f] to-cyan-950/30 border border-white/10 text-center shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black text-white font-display uppercase tracking-tight">
              Ready To Level Up?
            </h2>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
              Don't wait in line or pay overpriced third-party fees. Jump straight into the action with instant {SITE_CONFIG.name} top-ups.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/games"
                id="cta-btn-topup"
                className="w-full sm:w-auto px-8 py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider text-black bg-white hover:bg-cyan-400 shadow-xl transition-all active:scale-95"
              >
                Top Up Now
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
