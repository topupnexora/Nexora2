import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Package, 
  ArrowRight, 
  Home, 
  Clock, 
  HelpCircle, 
  ShieldCheck, 
  Copy, 
  Check,
  Send,
  AlertCircle
} from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { SITE_CONFIG } from '../config/site';
import { formatPrice } from '../utils/format';
import { HighlightTopUp } from '../components/HighlightTopUp';

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrderById, recentCreatedOrder } = useOrder();

  const [copied, setCopied] = useState(false);

  const order = (orderId ? getOrderById(orderId) : null) || recentCreatedOrder;

  const handleCopyId = () => {
    if (order?.orderId) {
      navigator.clipboard.writeText(order.orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Order Not Found</h2>
        <p className="text-sm text-gray-400 mb-6">
          Could not find order details for ID: <span className="font-mono text-cyan-400">{orderId}</span>.
        </p>
        <Link
          to="/"
          className="px-6 py-2.5 rounded-xl bg-white text-black text-sm font-bold hover:bg-cyan-400 transition-colors"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8">
      {/* Success Hero Badge */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white text-black flex items-center justify-center mx-auto shadow-2xl shadow-white/10 animate-in zoom-in-95 duration-300">
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.5]" />
        </div>

        <div>
          {/* Required sentence 1 */}
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white font-display mt-2">
            Your order has been received.
          </h1>

          {/* Required sentence 2 */}
          <div className="inline-flex items-center gap-2 mt-3 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Payment will be verified before processing.</span>
          </div>

          <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto mt-2">
            Thank you, <span className="text-white font-semibold">{order.customerName}</span>. Your <span className="text-red-500 font-semibold">top-up</span> request has been queued for manual verification.
          </p>
        </div>
      </div>

      {/* Primary Details Card */}
      <div className="bg-[#0d0d0f] border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
        {/* Order ID Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-[#050505] border border-white/10 gap-3">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block">
              NEXORA Order ID:
            </span>
            <span className="text-lg sm:text-xl font-black text-cyan-400 font-mono">
              {order.orderId}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyId}
            id="btn-copy-order-id"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-wider text-gray-200 transition-colors self-start sm:self-auto"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-gray-400" />
                <span>Copy Order ID</span>
              </>
            )}
          </button>
        </div>

        {/* Required Status Banner: Pending */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-amber-300 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping shrink-0" />
            <span>
              Status: <strong className="uppercase font-bold text-amber-300">Pending</strong> (Awaiting Admin Verification)
            </span>
          </div>
          <Link
            to={`/track-order?orderId=${encodeURIComponent(order.orderId)}`}
            className="font-bold underline text-amber-300 hover:text-white text-xs"
          >
            Track Status →
          </Link>
        </div>

        {/* Order Specifications Table showing all required fields */}
        <div className="space-y-3">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
            Order Specifications
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#050505] p-5 rounded-2xl border border-white/5">
            {/* Game */}
            <div className="space-y-1">
              <span className="text-gray-500 uppercase tracking-wider text-[10px] block">Game</span>
              <span className="font-bold text-white text-sm block">{order.game}</span>
            </div>

            {/* Package */}
            <div className="space-y-1">
              <span className="text-gray-500 uppercase tracking-wider text-[10px] block">Package</span>
              <span className="font-bold text-cyan-400 text-sm block">
                <HighlightTopUp text={order.package} redClassName="text-red-500 font-bold" />
              </span>
            </div>

            {/* Player ID */}
            <div className="space-y-1">
              <span className="text-gray-500 uppercase tracking-wider text-[10px] block">Player ID / UID</span>
              <span className="font-mono font-bold text-white text-sm block">
                {order.playerId}
                {order.serverId && (
                  <span className="text-gray-400 text-xs font-normal ml-1.5">(Zone: {order.serverId})</span>
                )}
              </span>
            </div>

            {/* Payment Method */}
            <div className="space-y-1">
              <span className="text-gray-500 uppercase tracking-wider text-[10px] block">Payment Method</span>
              <span className="font-bold text-white text-sm block">{order.paymentMethod}</span>
            </div>

            {/* Payment Sender Number */}
            {order.paymentSenderNumber && (
              <div className="space-y-1">
                <span className="text-gray-500 uppercase tracking-wider text-[10px] block">Payment Sender Number</span>
                <span className="font-mono font-bold text-white text-sm block">
                  {order.paymentSenderNumber}
                </span>
              </div>
            )}

            {/* Customer Contact Phone */}
            {order.customerPhone && (
              <div className="space-y-1">
                <span className="text-gray-500 uppercase tracking-wider text-[10px] block">Contact Number</span>
                <span className="font-mono font-bold text-white text-sm block">
                  {order.customerPhone}
                </span>
              </div>
            )}

            {/* Transaction ID */}
            <div className="space-y-1">
              <span className="text-gray-500 uppercase tracking-wider text-[10px] block">Transaction ID (TrxID)</span>
              <span className="font-mono font-bold text-cyan-400 text-sm block break-all">
                {order.transactionId || <span className="text-gray-500 font-normal italic">Not provided (Optional)</span>}
              </span>
            </div>

            {/* Total Amount */}
            <div className="space-y-1">
              <span className="text-gray-500 uppercase tracking-wider text-[10px] block">Total Amount</span>
              <span className="font-black text-emerald-400 text-base block font-display">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Telegram Support Button - Clearly visible as requested */}
        <div className="bg-[#050505] border border-cyan-500/20 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
              <Send className="w-4 h-4 text-cyan-400" />
              Need Fast Verification or Have an Issue?
            </h4>
            <p className="text-xs text-gray-400">
              Message our admin on Telegram with your Order ID (<span className="text-gray-200 font-mono">{order.orderId}</span>).
            </p>
          </div>

          <a
            href="https://t.me/callmeriyadh"
            target="_blank"
            rel="noreferrer"
            id="btn-telegram-support-confirmation"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all shrink-0 active:scale-95"
          >
            <Send className="w-4 h-4 fill-current" />
            <span>Chat on Telegram</span>
          </a>
        </div>

        {/* Navigation Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <Link
            to={`/track-order?orderId=${encodeURIComponent(order.orderId)}`}
            id="btn-confirm-track"
            className="w-full sm:flex-1 py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider text-black bg-white hover:bg-cyan-400 shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4" />
            <span>Track Order Status</span>
          </Link>

          <Link
            to="/"
            id="btn-confirm-home"
            className="w-full sm:w-auto px-6 py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
