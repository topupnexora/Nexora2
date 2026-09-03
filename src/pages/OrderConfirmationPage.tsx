import React from 'react';
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
  Send
} from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { SITE_CONFIG } from '../config/site';
import { formatPrice, formatDate } from '../utils/format';

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrderById, recentCreatedOrder } = useOrder();

  const [copied, setCopied] = React.useState(false);

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
        <p className="text-sm text-zinc-400 mb-6">
          Could not find recent order details for this ID.
        </p>
        <Link
          to="/"
          className="px-6 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-bold hover:bg-purple-500 transition-colors"
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
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-emerald-950/40 text-emerald-400 border border-emerald-500/30">
            Order Submitted Successfully
          </span>
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white font-display mt-3">
            Thank You, {order.customerName}!
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto mt-2">
            Your top-up request has been registered in our system and is currently pending manual payment matching.
          </p>
        </div>
      </div>

      {/* Primary Details Card */}
      <div className="bg-[#0d0d0f] border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
        {/* Order ID and Copy banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-[#050505] border border-white/10 gap-3">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block">
              Your NEXORA Order ID:
            </span>
            <span className="text-lg sm:text-xl font-black text-cyan-400 font-mono">
              {order.orderId}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyId}
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

        {/* Status Pill */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-amber-300 text-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>
              Current Status: <strong>{order.status}</strong> (Average verification: 1-5 mins)
            </span>
          </div>
          <Link
            to={`/track-order?orderId=${encodeURIComponent(order.orderId)}`}
            className="font-bold underline text-amber-300 hover:text-white"
          >
            Track Real-time →
          </Link>
        </div>

        {/* Game & Package Items list */}
        <div className="space-y-3">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
            Purchased Top-Up Items
          </h3>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 bg-[#050505] rounded-xl border border-white/5 text-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.gameImage}
                    alt={item.gameName}
                    className="w-12 h-12 object-cover rounded-lg border border-white/10"
                  />
                  <div>
                    <h4 className="font-bold text-white uppercase tracking-tight text-sm">{item.gameName}</h4>
                    <p className="text-cyan-400 font-semibold">{item.quantity}x {item.packageName}</p>
                    <p className="text-gray-400 font-mono text-[11px] mt-0.5">
                      UID: {item.playerId} {item.serverId ? `• Zone: ${item.serverId}` : ''}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-black text-white text-sm">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order breakdown summary table */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#050505] border border-white/5 text-xs">
          <div>
            <span className="text-gray-500 block">Payment Method</span>
            <span className="font-bold text-white mt-0.5 block">{order.paymentMethod}</span>
          </div>
          <div>
            <span className="text-gray-500 block">Transaction ID</span>
            <span className="font-mono font-bold text-cyan-400 mt-0.5 block truncate">
              {order.transactionId}
            </span>
          </div>
          <div>
            <span className="text-gray-500 block">Sender Phone</span>
            <span className="font-mono font-bold text-white mt-0.5 block">{order.senderPhone}</span>
          </div>
          <div>
            <span className="text-gray-500 block">Total Amount</span>
            <span className="font-black text-emerald-400 mt-0.5 block text-sm">
              {formatPrice(order.totalAmount)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
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

        {/* Support Help info */}
        <div className="text-center pt-2 text-xs text-gray-500">
          Have an urgent question regarding order <span className="text-gray-300 font-mono">{order.orderId}</span>?{' '}
          <a
            href={`${SITE_CONFIG.support.whatsappUrl}&text=Hello,%20checking%20status%20for%20order%20${order.orderId}`}
            target="_blank"
            rel="noreferrer"
            className="text-cyan-400 underline font-semibold"
          >
            Contact WhatsApp Support
          </a>
        </div>
      </div>
    </div>
  );
};
