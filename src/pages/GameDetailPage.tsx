import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Zap, 
  ShoppingCart, 
  CreditCard, 
  Check, 
  AlertCircle, 
  ShieldCheck, 
  Clock, 
  HelpCircle, 
  ChevronLeft,
  Plus,
  Minus,
  Sparkles
} from 'lucide-react';
import { GAMES_DATA } from '../data/games';
import { useCart } from '../context/CartContext';
import { Package } from '../types';
import { formatPrice } from '../utils/format';

export const GameDetailPage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const game = GAMES_DATA.find((g) => g.id === gameId);

  // Form states
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(() => {
    return game?.packages.find((p) => p.isPopular) || game?.packages[0] || null;
  });
  const [playerId, setPlayerId] = useState('');
  const [serverId, setServerId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [errors, setErrors] = useState<{ playerId?: string; serverId?: string; package?: string }>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (game) {
      setSelectedPackage(game.packages.find((p) => p.isPopular) || game.packages[0] || null);
      setPlayerId('');
      setServerId('');
      setQuantity(1);
      setErrors({});
    }
  }, [gameId]);

  if (!game) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Game Not Found</h2>
        <p className="text-sm text-zinc-400 mb-6">
          The requested gaming title could not be located in our catalog.
        </p>
        <Link
          to="/games"
          className="px-6 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-bold hover:bg-purple-500 transition-all"
        >
          Return to Games Catalog
        </Link>
      </div>
    );
  }

  const validate = (): boolean => {
    const newErrors: { playerId?: string; serverId?: string; package?: string } = {};

    if (!selectedPackage) {
      newErrors.package = 'Please select a top-up package';
    }

    if (!playerId.trim()) {
      newErrors.playerId = `Please enter your ${game.fields[0]?.label || 'Player ID'}`;
    } else if (game.id === 'free-fire' && (!/^\d{7,12}$/.test(playerId.trim()))) {
      newErrors.playerId = 'Free Fire UID is typically 7 to 12 digits numeric.';
    } else if (game.id === 'pubg-mobile' && (!/^\d{7,12}$/.test(playerId.trim()))) {
      newErrors.playerId = 'PUBG Character ID should be 7 to 12 digits.';
    }

    // Check if game requires server/zone id (like Mobile Legends)
    const needsZone = game.fields.some((f) => f.id === 'zoneId' || f.id === 'serverId');
    if (needsZone && !serverId.trim()) {
      newErrors.serverId = 'Zone / Server ID is required for this game';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddToCart = () => {
    if (!validate() || !selectedPackage) return;

    addToCart({
      gameId: game.id,
      gameName: game.name,
      gameImage: game.image,
      packageId: selectedPackage.id,
      packageName: selectedPackage.name,
      unit: selectedPackage.unit,
      price: selectedPackage.price,
      quantity,
      playerId: playerId.trim(),
      serverId: serverId.trim() || undefined
    });

    setToastMessage(`Added ${quantity}x ${selectedPackage.name} to cart!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleBuyNow = () => {
    if (!validate() || !selectedPackage) return;

    addToCart({
      gameId: game.id,
      gameName: game.name,
      gameImage: game.image,
      packageId: selectedPackage.id,
      packageName: selectedPackage.name,
      unit: selectedPackage.unit,
      price: selectedPackage.price,
      quantity,
      playerId: playerId.trim(),
      serverId: serverId.trim() || undefined
    });

    navigate('/checkout');
  };

  const currentTotal = selectedPackage ? selectedPackage.price * quantity : 0;
  const currentSavings = selectedPackage?.originalPrice
    ? (selectedPackage.originalPrice - selectedPackage.price) * quantity
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Breadcrumb / Back button */}
      <div>
        <Link
          to="/games"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-cyan-400 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to All Games</span>
        </Link>
      </div>

      {/* Floating Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-950 border border-emerald-500/60 text-emerald-200 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs">
            <span className="font-bold">{toastMessage}</span>
            <Link to="/cart" className="ml-2 underline text-white font-bold">
              View Cart →
            </Link>
          </div>
        </div>
      )}

      {/* Game Header Banner Card */}
      <div className="relative rounded-3xl overflow-hidden border border-white/5 bg-[#0d0d0f] shadow-2xl">
        <div className="h-48 sm:h-64 lg:h-72 w-full relative">
          <img
            src={game.bannerImage}
            alt={game.name}
            className="w-full h-full object-cover object-center filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0f] via-[#0d0d0f]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0f] via-[#0d0d0f]/70 to-transparent" />

          {/* Banner Overlaid Info */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-gray-300 border border-white/10">
                  {game.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  {game.deliveryTime}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white font-display">
                {game.name}
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 max-w-2xl mt-1.5 line-clamp-2">
                {game.description}
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-2 text-xs text-emerald-400 font-semibold uppercase tracking-wider bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4" />
              <span>Official Top-Up Partner</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Top-Up Interface Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Step 1 Player Info & Step 2 Package Selection */}
        <div className="lg:col-span-8 space-y-8">
          {/* STEP 1: PLAYER ACCOUNT INFORMATION */}
          <div className="bg-[#0d0d0f] border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-cyan-400 font-black text-sm flex items-center justify-center font-display">
                1
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight text-gray-100">
                  Enter Player Information
                </h3>
                <p className="text-xs text-gray-400">
                  Enter your numeric game ID carefully. Passwords are never needed.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Primary Field (Player ID / UID) */}
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  {game.fields[0]?.label || 'Player ID'} <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="input-player-id"
                  value={playerId}
                  onChange={(e) => {
                    setPlayerId(e.target.value);
                    if (errors.playerId) setErrors({ ...errors, playerId: undefined });
                  }}
                  placeholder={game.fields[0]?.placeholder || 'Enter Player ID'}
                  className={`w-full bg-[#050505] border ${
                    errors.playerId ? 'border-red-500 ring-1 ring-red-500' : 'border-white/10'
                  } rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono`}
                />
                {errors.playerId && (
                  <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.playerId}
                  </p>
                )}
                {game.fields[0]?.helperText && (
                  <p className="text-[11px] text-gray-500 mt-1.5">
                    {game.fields[0].helperText}
                  </p>
                )}
              </div>

              {/* Secondary Field (Zone / Server ID if game requires it) */}
              {game.fields.length > 1 && (
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    {game.fields[1]?.label} <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="input-server-id"
                    value={serverId}
                    onChange={(e) => {
                      setServerId(e.target.value);
                      if (errors.serverId) setErrors({ ...errors, serverId: undefined });
                    }}
                    placeholder={game.fields[1]?.placeholder || 'Enter Zone ID'}
                    className={`w-full bg-[#050505] border ${
                      errors.serverId ? 'border-red-500 ring-1 ring-red-500' : 'border-white/10'
                    } rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono`}
                  />
                  {errors.serverId && (
                    <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.serverId}
                    </p>
                  )}
                  {game.fields[1]?.helperText && (
                    <p className="text-[11px] text-gray-500 mt-1.5">
                      {game.fields[1].helperText}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Instruction help box */}
            {game.detailedInstructions && (
              <div className="mt-4 p-3.5 bg-[#050505] rounded-xl border border-white/5 text-xs text-gray-400 flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{game.detailedInstructions}</span>
              </div>
            )}
          </div>

          {/* STEP 2: SELECT PACKAGE */}
          <div className="bg-[#0d0d0f] border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-cyan-400 font-black text-sm flex items-center justify-center font-display">
                  2
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight text-gray-100">
                    Select Top-Up Package
                  </h3>
                  <p className="text-xs text-gray-400">
                    Choose your in-game denomination. All packages priced in BDT.
                  </p>
                </div>
              </div>
            </div>

            {errors.package && (
              <p className="text-xs text-red-400 mb-4 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.package}
              </p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {game.packages.map((pkg) => {
                const isSelected = selectedPackage?.id === pkg.id;

                return (
                  <button
                    key={pkg.id}
                    type="button"
                    id={`btn-pkg-${pkg.id}`}
                    onClick={() => {
                      setSelectedPackage(pkg);
                      if (errors.package) setErrors({ ...errors, package: undefined });
                    }}
                    className={`relative text-left p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#15151c] border-cyan-400 ring-1 ring-cyan-400 shadow-xl shadow-cyan-500/10'
                        : 'bg-[#08080a] hover:bg-[#121216] border-white/5 hover:border-white/20'
                    }`}
                  >
                    {/* Badge */}
                    {pkg.badge && (
                      <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-gradient-to-r from-purple-500 to-cyan-500 text-black shadow-md">
                        {pkg.badge}
                      </span>
                    )}

                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm sm:text-base font-extrabold text-white font-display">
                          {pkg.name}
                        </span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-cyan-400 text-black flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex items-baseline justify-between">
                      <span className="text-base font-black text-white">
                        {formatPrice(pkg.price)}
                      </span>
                      {pkg.originalPrice && (
                        <span className="text-xs line-through text-gray-500">
                          {formatPrice(pkg.originalPrice)}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Order Summary & Checkout Action Box */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 bg-[#0d0d0f] border border-white/5 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl space-y-6">
            <h3 className="text-lg font-bold uppercase tracking-tight text-white border-b border-white/5 pb-4 font-display">
              Order Summary
            </h3>

            {/* Selected Game Details */}
            <div className="flex items-center gap-3.5 bg-[#050505] p-3.5 rounded-2xl border border-white/5">
              <img
                src={game.image}
                alt={game.name}
                className="w-14 h-14 object-cover rounded-xl border border-white/10"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white uppercase tracking-tight truncate">{game.name}</h4>
                <p className="text-xs text-cyan-400 font-semibold mt-0.5">
                  {selectedPackage ? selectedPackage.name : 'Select a package'}
                </p>
                <p className="text-[11px] text-gray-400 truncate">
                  Player: {playerId.trim() || 'Not entered yet'}
                </p>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Quantity:
              </span>
              <div className="flex items-center gap-3 bg-[#050505] border border-white/10 rounded-xl p-1">
                <button
                  type="button"
                  id="btn-qty-decrease"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 flex items-center justify-center transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-bold text-white w-6 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  id="btn-qty-increase"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 flex items-center justify-center transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 pt-4 border-t border-white/5 text-xs">
              <div className="flex justify-between text-gray-400">
                <span>Unit Price</span>
                <span>{selectedPackage ? formatPrice(selectedPackage.price) : '৳ 0'}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Quantity</span>
                <span>x {quantity}</span>
              </div>
              {currentSavings > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Special Discount</span>
                  <span>- {formatPrice(currentSavings)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-white/5">
                <span>Total Amount:</span>
                <span className="text-cyan-400 font-display text-lg">
                  {formatPrice(currentTotal)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                id="btn-buy-now"
                onClick={handleBuyNow}
                className="w-full py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider text-black bg-white hover:bg-cyan-400 shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <CreditCard className="w-4 h-4" />
                <span>Buy Now</span>
              </button>

              <button
                type="button"
                id="btn-add-to-cart"
                onClick={handleAddToCart}
                className="w-full py-3 rounded-lg font-bold text-xs uppercase tracking-wider text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <ShoppingCart className="w-4 h-4 text-cyan-400" />
                <span>Add to Cart</span>
              </button>
            </div>

            {/* Guarantees */}
            <div className="pt-4 border-t border-white/5 space-y-2 text-[11px] text-gray-400">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-cyan-400" />
                <span>Instant dispatch after payment verification</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-cyan-400" />
                <span>bKash & Nagad Send Money supported</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-cyan-400" />
                <span>
                  24/7 dedicated Telegram support (
                  <a
                    href="https://t.me/callmeriyadh"
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:underline font-bold"
                  >
                    @callmeriyadh
                  </a>
                  )
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
