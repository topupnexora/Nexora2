import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  Zap, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Clock, 
  Package,
  Send,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { formatPrice } from '../utils/format';
import { HighlightTopUp } from './HighlightTopUp';

export interface FeaturedGameItem {
  id: string;
  gameId: string;
  name: string;
  shortName: string;
  category: string;
  headline: string;
  promoText: string;
  badge: string;
  image: string;
  startingPrice: number;
  currencyUnit: string;
  deliveryTime: string;
  route: string;
  accentColor: string;
  themeGradient: string;
}

export const FEATURED_GAMES: FeaturedGameItem[] = [
  {
    id: 'trending-free-fire',
    gameId: 'free-fire',
    name: 'Free Fire',
    shortName: 'FF',
    category: 'Battle Royale',
    headline: 'Fast & Easy Game Top-Up',
    promoText: 'Instant Garena Diamonds delivery via numeric Player UID. 100% password-free.',
    badge: '🔥 Trending #1 in BD',
    image: '/images/games/free-fire.jpg',
    startingPrice: 85,
    currencyUnit: 'Diamonds',
    deliveryTime: '1-3 Mins',
    route: '/game/free-fire',
    accentColor: '#f97316',
    themeGradient: 'from-orange-500/20 via-amber-500/10 to-transparent'
  },
  {
    id: 'trending-pubg-mobile',
    gameId: 'pubg-mobile',
    name: 'PUBG Mobile',
    shortName: 'PUBG',
    category: 'Battle Royale',
    headline: 'Royale Pass & UC Top-Up',
    promoText: 'Buy Unknown Cash (UC) instantly with direct character ID recharge.',
    badge: '🔥 Most Popular',
    image: '/images/games/pubg-mobile.jpg',
    startingPrice: 95,
    currencyUnit: 'UC',
    deliveryTime: '2-5 Mins',
    route: '/game/pubg-mobile',
    accentColor: '#eab308',
    themeGradient: 'from-amber-500/20 via-yellow-500/10 to-transparent'
  },
  {
    id: 'trending-mobile-legends',
    gameId: 'mobile-legends',
    name: 'Mobile Legends',
    shortName: 'MLBB',
    category: 'MOBA',
    headline: 'Bang Bang Diamonds',
    promoText: 'Top up Mobile Legends Diamonds with User ID and Zone ID in minutes.',
    badge: '⚡ Instant Recharge',
    image: '/images/games/mobile-legends.jpg',
    startingPrice: 160,
    currencyUnit: 'Diamonds',
    deliveryTime: '1-3 Mins',
    route: '/game/mobile-legends',
    accentColor: '#3b82f6',
    themeGradient: 'from-blue-500/20 via-cyan-500/10 to-transparent'
  },
  {
    id: 'trending-cod-mobile',
    gameId: 'cod-mobile',
    name: 'COD Mobile',
    shortName: 'CODM',
    category: 'FPS',
    headline: 'Battle Pass & CP Points',
    promoText: 'Call of Duty Mobile CP points delivered straight to your Player UID.',
    badge: '🎯 Battle Ready',
    image: '/images/games/cod-mobile.jpg',
    startingPrice: 95,
    currencyUnit: 'CP',
    deliveryTime: '2-5 Mins',
    route: '/game/cod-mobile',
    accentColor: '#10b981',
    themeGradient: 'from-emerald-500/20 via-teal-500/10 to-transparent'
  },
  {
    id: 'trending-ea-fc-mobile',
    gameId: 'ea-fc-mobile',
    name: 'EA FC Mobile',
    shortName: 'FC Mobile',
    category: 'Sports',
    headline: 'Ultimate Team FC Points',
    promoText: 'Level up your squad with instant EA SPORTS FC Mobile Points.',
    badge: '⚽ Top Pick',
    image: '/images/games/ea-fc-mobile.jpg',
    startingPrice: 490,
    currencyUnit: 'FC Points',
    deliveryTime: '3-7 Mins',
    route: '/game/ea-fc-mobile',
    accentColor: '#06b6d4',
    themeGradient: 'from-cyan-500/20 via-blue-500/10 to-transparent'
  },
  {
    id: 'trending-roblox',
    gameId: 'roblox',
    name: 'Roblox',
    shortName: 'Roblox',
    category: 'Sandbox',
    headline: 'Instant Robux Recharge',
    promoText: 'Buy Robux packages for Bangladeshi players delivered in minutes.',
    badge: '💎 Community Choice',
    image: '/images/games/roblox.jpg',
    startingPrice: 490,
    currencyUnit: 'Robux',
    deliveryTime: '1-5 Mins',
    route: '/game/roblox',
    accentColor: '#a855f7',
    themeGradient: 'from-purple-500/20 via-pink-500/10 to-transparent'
  }
];

export const HeroSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  const activeGame = FEATURED_GAMES[currentIndex];

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % FEATURED_GAMES.length);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + FEATURED_GAMES.length) % FEATURED_GAMES.length);
  }, []);

  const handleSelect = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto rotation: exactly 3000ms / 3 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      handleNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused, handleNext, currentIndex]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current !== null && touchEndXRef.current !== null) {
      const diff = touchStartXRef.current - touchEndXRef.current;
      const minSwipeDistance = 40;
      if (diff > minSwipeDistance) {
        handleNext();
      } else if (diff < -minSwipeDistance) {
        handlePrev();
      }
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
    setIsPaused(false);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    }
  };

  return (
    <section 
      id="hero-two-column-section"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-4"
      aria-label="Hero Section"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
        {/* ============================================================ */}
        {/* LEFT COLUMN: COMPACT FEATURED GAME POSTER                    */}
        {/* ============================================================ */}
        <div className="lg:col-span-7 flex flex-col">
          <div
            id="featured-poster-container"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="relative group rounded-3xl overflow-hidden border border-white/10 bg-[#09090b] shadow-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 min-h-[340px] sm:min-h-[370px] lg:min-h-[380px] h-full flex flex-col justify-between"
          >
            {/* Background Artwork Layer with Cross-Fade */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeGame.id}
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.015 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="absolute inset-0 z-0"
              >
                <img
                  src={activeGame.image}
                  alt={`${activeGame.name} Poster Artwork`}
                  className="w-full h-full object-cover object-center lg:object-[center_35%] filter brightness-[0.72] contrast-110 group-hover:scale-105 transition-transform duration-700"
                  loading="eager"
                />

                {/* Dark Gradient Overlay for High Text Legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/75 to-black/30 sm:bg-gradient-to-r sm:from-[#09090b] sm:via-[#09090b]/80 sm:to-black/40" />
                <div className={`absolute inset-0 bg-gradient-to-br ${activeGame.themeGradient} opacity-50 mix-blend-overlay`} />
              </motion.div>
            </AnimatePresence>

            {/* Poster Header (Badge & Delivery speed) */}
            <div className="relative z-10 p-4 sm:p-6 flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-black/75 backdrop-blur-md text-amber-400 border border-amber-500/30 shadow-md">
                <Flame className="w-3 h-3 fill-amber-400" />
                <span>{activeGame.badge}</span>
              </span>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-cyan-400 border border-cyan-500/25">
                <Clock className="w-3 h-3" />
                <span>{activeGame.deliveryTime}</span>
              </div>
            </div>

            {/* Poster Main Body Info */}
            <div className="relative z-10 px-4 sm:px-6 py-2 mt-auto">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] font-extrabold text-cyan-400">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>
                    {activeGame.category} • <HighlightTopUp text={activeGame.headline} redClassName="text-red-500 font-extrabold" />
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white font-display drop-shadow-md leading-none">
                  {activeGame.name}
                </h3>

                <p className="text-xs sm:text-sm text-gray-300 line-clamp-1 max-w-lg font-normal drop-shadow-sm">
                  <HighlightTopUp text={activeGame.promoText} redClassName="text-red-500 font-semibold" />
                </p>
              </div>

              {/* Pricing & CTA Button */}
              <div className="mt-4 flex items-center gap-3 flex-wrap">
                <Link
                  to={activeGame.route}
                  id={`hero-poster-topup-${activeGame.gameId}`}
                  className="px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider text-black bg-cyan-400 hover:bg-cyan-300 shadow-lg shadow-cyan-400/25 transition-all duration-200 flex items-center gap-2 group/btn active:scale-95"
                >
                  <Zap className="w-3.5 h-3.5 fill-black text-black" />
                  <span><span className="text-red-600 font-black">Top Up</span> Now</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </Link>

                <div className="bg-black/65 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5">
                  <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">From:</span>
                  <span className="text-xs sm:text-sm font-black text-white">{formatPrice(activeGame.startingPrice)}</span>
                </div>
              </div>
            </div>

            {/* Poster Footer: Pagination & Controls */}
            <div className="relative z-10 px-4 sm:px-6 py-3 flex items-center justify-between border-t border-white/5 bg-black/40 backdrop-blur-sm mt-3">
              {/* Pagination Dots */}
              <div 
                className="flex items-center gap-1.5"
                role="tablist"
                aria-label="Featured game poster slide indicators"
              >
                {FEATURED_GAMES.map((item, idx) => {
                  const isActive = idx === currentIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(idx)}
                      role="tab"
                      aria-selected={isActive}
                      aria-label={`Go to ${item.name}`}
                      className={`h-2 transition-all duration-300 rounded-full focus:outline-none focus:ring-1 focus:ring-cyan-400 ${
                        isActive 
                          ? 'w-6 bg-cyan-400 shadow-sm shadow-cyan-400/50' 
                          : 'w-2 bg-white/30 hover:bg-white/60'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Subtle Prev/Next Controls */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-mono text-gray-400 mr-1.5 hidden sm:inline-block">
                  <span className="text-white font-bold">{currentIndex + 1}</span> / {FEATURED_GAMES.length}
                </span>

                <button
                  onClick={handlePrev}
                  id="hero-poster-prev"
                  aria-label="Previous poster"
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-gray-300 hover:text-white flex items-center justify-center transition-all active:scale-90"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={handleNext}
                  id="hero-poster-next"
                  aria-label="Next poster"
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-gray-300 hover:text-white flex items-center justify-center transition-all active:scale-90"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: SERVICE INFORMATION PANEL                      */}
        {/* ============================================================ */}
        <div className="lg:col-span-5 flex flex-col">
          <div 
            id="service-info-panel"
            className="relative rounded-3xl border border-white/10 bg-[#09090b]/85 backdrop-blur-md p-6 sm:p-8 lg:p-9 shadow-xl overflow-hidden min-h-[340px] sm:min-h-[370px] lg:min-h-[380px] h-full flex flex-col justify-between"
          >
            {/* Subtle Futuristic Background Ambient Glows */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-cyan-500/10 blur-3xl pointer-events-none rounded-full" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-500/10 blur-3xl pointer-events-none rounded-full" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-transparent pointer-events-none" />

            {/* Top Indicator */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>24/7 Processing</span>
              </div>
            </div>

            {/* Vertically Centered Content Area */}
            <div className="relative z-10 my-auto py-4">
              {/* Heading: Exact User Required Copy */}
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-display leading-tight">
                Instant <span className="text-red-500">Top-Up</span> Service Active
              </h2>

              {/* Subheading: Exact User Required Copy */}
              <p className="text-xs sm:text-sm text-gray-300 font-normal leading-relaxed mt-3 mb-6 sm:mb-7">
                Fast UID diamonds, UC, CP, and points delivery in Bangladesh with bKash & Nagad
              </p>

              {/* Buttons: Track Order & Support side-by-side on desktop */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  to="/track-order"
                  id="hero-btn-track-order"
                  className="px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/40 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm active:scale-95 text-center flex-1"
                >
                  <Package className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Track Order</span>
                </Link>

                <a
                  href="https://t.me/callmeriyadh"
                  target="_blank"
                  rel="noreferrer"
                  id="hero-btn-support"
                  className="px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-cyan-400 hover:bg-cyan-300 transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-cyan-400/20 active:scale-95 text-center flex-1"
                >
                  <Send className="w-4 h-4 shrink-0" />
                  <span>Support</span>
                </a>
              </div>
            </div>

            {/* Bottom Service Guarantees Micro-Grid */}
            <div className="relative z-10 pt-4 border-t border-white/5 grid grid-cols-3 gap-2">
              <div className="text-left">
                <div className="text-[11px] font-bold text-gray-200">1-5 Mins</div>
                <div className="text-[10px] text-gray-400">Fast Delivery</div>
              </div>
              <div className="text-left">
                <div className="text-[11px] font-bold text-gray-200">UID Only</div>
                <div className="text-[10px] text-gray-400">100% Safe</div>
              </div>
              <div className="text-left">
                <div className="text-[11px] font-bold text-gray-200">bKash / Nagad</div>
                <div className="text-[10px] text-gray-400">Personal Send</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
