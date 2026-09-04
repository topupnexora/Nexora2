import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag, 
  ShieldCheck, 
  CreditCard,
  Gamepad2,
  ChevronLeft,
  AlertCircle,
  X
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';
import { HighlightTopUp } from '../components/HighlightTopUp';

export const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, subtotal, discount, total, updatePlayerId } = useCart();
  const navigate = useNavigate();

  const [playerErrorToast, setPlayerErrorToast] = useState(false);
  const [missingItemIds, setMissingItemIds] = useState<string[]>([]);
  const errorToastTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (errorToastTimerRef.current) {
        clearTimeout(errorToastTimerRef.current);
      }
    };
  }, []);

  const handleProceedToCheckout = () => {
    const invalidItems = cart.filter((item) => !item.playerId || !item.playerId.trim());
    if (invalidItems.length > 0) {
      const ids = invalidItems.map((i) => i.id);
      setMissingItemIds(ids);
      setPlayerErrorToast(true);

      if (errorToastTimerRef.current) {
        clearTimeout(errorToastTimerRef.current);
      }
      errorToastTimerRef.current = setTimeout(() => {
        setPlayerErrorToast(false);
      }, 5000);

      // Focus first missing input
      setTimeout(() => {
        const firstId = ids[0];
        const el = document.getElementById(`cart-item-player-id-${firstId}`) as HTMLInputElement | null;
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.focus();
        }
      }, 60);
      return;
    }

    setPlayerErrorToast(false);
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-2xl bg-[#0d0d0f] border border-white/5 flex items-center justify-center text-gray-500 mx-auto mb-6 shadow-xl">
          <ShoppingBag className="w-8 h-8 text-cyan-400" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-display">
          Your Cart is Empty
        </h2>
        <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto">
          Looks like you haven't added any game packages yet. Browse our selection of diamonds, UC, and gaming credits.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/games"
            id="btn-cart-browse-games"
            className="w-full sm:w-auto px-8 py-3 rounded-lg font-bold text-xs uppercase tracking-wider text-black bg-white hover:bg-cyan-400 shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Explore Games</span>
          </Link>
          <Link
            to="/track-order"
            className="w-full sm:w-auto px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-wider text-gray-300 hover:text-white bg-white/5 border border-white/10 hover:border-white/20 transition-all"
          >
            Track Existing Order
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8 relative">
      {/* Floating Red Error Toast / Popup for missing Player ID */}
      {playerErrorToast && (
        <div
          role="alert"
          id="cart-player-id-error-toast"
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[92%] sm:w-auto min-w-[300px] max-w-md bg-red-950/95 border-2 border-red-500 text-white px-4 sm:px-5 py-3.5 rounded-2xl shadow-[0_10px_40px_rgba(239,68,68,0.45)] backdrop-blur-xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-red-900/80 border border-red-500/60 flex items-center justify-center text-red-300 shrink-0">
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-red-100 tracking-wide">
              Please enter your Player ID First
            </span>
          </div>
          <button
            type="button"
            id="btn-close-cart-error-toast"
            onClick={() => {
              if (errorToastTimerRef.current) {
                clearTimeout(errorToastTimerRef.current);
              }
              setPlayerErrorToast(false);
            }}
            aria-label="Close error notice"
            className="p-1 rounded-lg text-red-300 hover:text-white hover:bg-red-900/60 transition-colors shrink-0 ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-[0.2em] mb-1">
            <ShoppingBag className="w-4 h-4" />
            <span>Review Your Selection</span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white font-display">
            Shopping Cart ({cart.length} item{cart.length > 1 ? 's' : ''})
          </h1>
        </div>

        <button
          type="button"
          id="btn-clear-cart"
          onClick={clearCart}
          className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-red-400 flex items-center gap-1.5 self-start sm:self-auto py-1.5 px-3 rounded-lg bg-white/5 border border-white/10 hover:border-red-500/30 transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All</span>
        </button>
      </div>

      {/* Cart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart items list */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              id={`cart-item-${item.id}`}
              className="bg-[#0d0d0f] border border-white/5 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-sm hover:border-white/15 transition-colors"
            >
              {/* Game info and thumb */}
              <div className="flex items-center gap-4">
                <img
                  src={item.gameImage}
                  alt={item.gameName}
                  className="w-16 h-16 object-cover rounded-xl border border-white/10 shrink-0"
                />
                <div>
                  <h3 className="text-base font-bold uppercase tracking-tight text-white font-display">
                    {item.gameName}
                  </h3>
                  <div className="text-sm font-semibold text-cyan-400 mt-0.5">
                    <HighlightTopUp text={item.packageName} redClassName="text-red-500 font-bold" />
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-gray-400">Player ID / Character ID:</span>
                      {item.serverId && (
                        <span className="text-[10px] text-gray-400">Zone: <strong className="text-gray-200">{item.serverId}</strong></span>
                      )}
                    </div>
                    {(!item.playerId || missingItemIds.includes(item.id)) ? (
                      <div className="space-y-1">
                        <input
                          type="text"
                          id={`cart-item-player-id-${item.id}`}
                          value={item.playerId || ''}
                          onChange={(e) => {
                            updatePlayerId(item.id, e.target.value);
                            if (e.target.value.trim()) {
                              setMissingItemIds((prev) => prev.filter((id) => id !== item.id));
                            }
                          }}
                          placeholder="Enter Player ID / UID *"
                          className={`w-full max-w-xs bg-[#050505] border ${
                            missingItemIds.includes(item.id) || !item.playerId
                              ? 'border-red-500 ring-2 ring-red-500/50 bg-red-950/20'
                              : 'border-white/10'
                          } rounded-lg px-2.5 py-1 text-xs text-white font-mono placeholder-gray-500 focus:outline-none focus:border-cyan-400`}
                        />
                        {missingItemIds.includes(item.id) && (
                          <p className="text-[10px] text-red-400 flex items-center gap-1 font-medium">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            <span>Please enter your Player ID First</span>
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="bg-[#050505] px-2 py-0.5 rounded border border-white/10 font-mono text-[11px] text-gray-200">
                          {item.playerId}
                        </span>
                        <button
                          type="button"
                          onClick={() => setMissingItemIds((prev) => [...prev, item.id])}
                          className="text-[10px] text-cyan-400 hover:underline"
                        >
                          Edit ID
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quantity and Price */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
                {/* Quantity Controls */}
                <div className="flex items-center gap-2 bg-[#050505] border border-white/10 rounded-xl p-1">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold text-white w-6 text-center">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal for line */}
                <div className="text-right min-w-[90px]">
                  <div className="text-base font-black text-white">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    {formatPrice(item.price)} each
                  </div>
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-950/30 rounded-xl transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Continue Shopping */}
          <div className="pt-2">
            <Link
              to="/games"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Add More Packages / Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Right col: Summary */}
        <div className="lg:col-span-4">
          <div className="bg-[#0d0d0f] border border-white/5 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl space-y-6">
            <h3 className="text-lg font-bold uppercase tracking-tight text-white border-b border-white/5 pb-4 font-display">
              Cart Summary
            </h3>

            <div className="space-y-2.5 text-xs text-gray-400">
              <div className="flex justify-between">
                <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="text-gray-200 font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Processing / Delivery Fee</span>
                <span className="text-emerald-400 font-bold">FREE (৳ 0)</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Discount</span>
                  <span>- {formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-extrabold text-white pt-3 border-t border-white/5">
                <span>Total Payable:</span>
                <span className="text-cyan-400 font-display text-xl">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            <button
              type="button"
              id="btn-cart-checkout"
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider text-black bg-white hover:bg-cyan-400 shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <CreditCard className="w-4 h-4" />
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 border-t border-white/5 space-y-2 text-[11px] text-gray-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Fast & verified delivery across Bangladesh</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>bKash & Nagad manual verification supported</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
