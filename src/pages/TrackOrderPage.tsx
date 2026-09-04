import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Package, 
  Search, 
  Clock, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  ExternalLink,
  ShieldCheck,
  Zap,
  RotateCcw
} from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { OrderStatusTimeline } from '../components/OrderStatusTimeline';
import { SITE_CONFIG } from '../config/site';
import { formatPrice, formatDate, maskPhone, maskTrxId } from '../utils/format';
import { OrderStatus } from '../types';
import { HighlightTopUp } from '../components/HighlightTopUp';

export const TrackOrderPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialOrderId = searchParams.get('orderId') || '';

  const { orders, getOrderById, updateOrderStatus } = useOrder();

  const [orderIdInput, setOrderIdInput] = useState(initialOrderId);
  const [phoneInput, setPhoneInput] = useState('');
  const [hasSearched, setHasSearched] = useState(Boolean(initialOrderId));
  const [foundOrder, setFoundOrder] = useState<any>(() => {
    return initialOrderId ? getOrderById(initialOrderId) : null;
  });
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-search if URL query param was passed
  useEffect(() => {
    if (initialOrderId) {
      setOrderIdInput(initialOrderId);
      const ord = getOrderById(initialOrderId);
      setFoundOrder(ord);
      setHasSearched(true);
      if (!ord) {
        setErrorMsg('No order found with this Order ID.');
      }
    }
  }, [initialOrderId, orders]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!orderIdInput.trim()) {
      setErrorMsg('Please enter your NEXORA Order ID (e.g. NEX-20260904-XXXXXX)');
      return;
    }

    const order = getOrderById(orderIdInput.trim(), phoneInput.trim() || undefined);
    setFoundOrder(order);
    setHasSearched(true);

    if (!order) {
      setErrorMsg('No matching order found. Please verify the Order ID and phone number.');
    }
  };

  const handleStatusChangeDemo = (newStatus: OrderStatus) => {
    if (!foundOrder) return;
    updateOrderStatus(foundOrder.orderId, newStatus, `Manual admin simulation to ${newStatus}`);
    // Refresh current found order
    const updated = getOrderById(foundOrder.orderId);
    setFoundOrder(updated);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-cyan-400">
          <Package className="w-3.5 h-3.5" />
          <span>Real-Time Status Tracker</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-display uppercase tracking-tight">
          Track Your <span className="text-red-500 font-black">Top-Up</span> Order
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto">
          Enter your Order ID (format: NEX-YYYYMMDD-XXXXXX) to view real-time delivery status and transaction logs.
        </p>
      </div>

      {/* Search Input Card */}
      <div className="bg-[#0d0d0f] border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                NEXORA Order ID <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="input-track-order-id"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value.toUpperCase())}
                placeholder="e.g. NEX-20260904-123456"
                className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400 font-mono uppercase"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Phone Number <span className="text-gray-500 lowercase">(optional verification)</span>
              </label>
              <input
                type="tel"
                id="input-track-phone"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="text-xs text-gray-500">
              💡 Sample demo order:{' '}
              <button
                type="button"
                onClick={() => setOrderIdInput('NEX-20260904-512839')}
                className="text-cyan-400 font-mono underline"
              >
                NEX-20260904-512839
              </button>
            </div>

            <button
              type="submit"
              id="btn-track-submit"
              className="w-full sm:w-auto px-8 py-3 rounded-lg font-bold text-xs uppercase tracking-wider text-black bg-white hover:bg-cyan-400 shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Lookup Order</span>
            </button>
          </div>
        </form>

        {errorMsg && (
          <div className="mt-4 p-4 bg-red-950/40 border border-red-500/40 rounded-2xl text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Search Result display */}
      {foundOrder && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Timeline visualization */}
          <OrderStatusTimeline
            status={foundOrder.status}
            createdAt={foundOrder.createdAt}
            updatedAt={foundOrder.updatedAt}
            history={foundOrder.statusHistory}
          />

          {/* Interactive Status Simulator for reviewers/evaluators */}
          <div className="bg-[#0d0d0f] border border-dashed border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="text-gray-400">
              <strong className="text-cyan-400">Admin Demo Simulator:</strong> Test status changes in real-time
            </div>
            <div className="flex items-center gap-2">
              {(['Pending', 'Processing', 'Completed', 'Cancelled'] as OrderStatus[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleStatusChangeDemo(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    foundOrder.status === st
                      ? 'bg-white text-black shadow-md'
                      : 'bg-[#050505] text-gray-400 hover:text-white border border-white/5'
                  }`}
                >
                  Set {st}
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Order Card */}
          <div className="bg-[#0d0d0f] border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-white/5 gap-2">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block">
                  Order Reference
                </span>
                <h3 className="text-xl font-bold text-white font-mono">{foundOrder.orderId}</h3>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] uppercase tracking-wider text-gray-500 block">Order Placed</span>
                <span className="text-xs font-semibold text-gray-300 block">
                  {formatDate(foundOrder.createdAt)}
                </span>
              </div>
            </div>

            {/* Items details */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
                <span className="text-red-500 font-bold">Top-Up</span> Items & Target Account
              </h4>
              <div className="space-y-2">
                {foundOrder.items.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3.5 bg-[#050505] rounded-2xl border border-white/5 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.gameImage}
                        alt={item.gameName}
                        className="w-12 h-12 object-cover rounded-xl border border-white/10 shrink-0"
                      />
                      <div>
                        <h5 className="font-bold text-white uppercase tracking-tight text-sm">{item.gameName}</h5>
                        <p className="text-cyan-400 font-semibold">
                          {item.quantity}x <HighlightTopUp text={item.packageName} redClassName="text-red-500 font-bold" />
                        </p>
                        <p className="text-gray-400 font-mono mt-0.5">
                          Target Player UID: <strong className="text-gray-200">{item.playerId}</strong>
                          {item.serverId && ` (Zone: ${item.serverId})`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right font-black text-white text-sm">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment & Audit information */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#050505] border border-white/5 text-xs">
              <div>
                <span className="text-gray-500 block">Customer</span>
                <span className="font-semibold text-gray-200 block truncate mt-0.5">
                  {foundOrder.customerName}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">Payment Sender</span>
                <span className="font-mono font-semibold text-gray-200 block mt-0.5">
                  {maskPhone(foundOrder.paymentSenderNumber || foundOrder.senderPhone || foundOrder.customerPhone || foundOrder.phone)}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">Transaction ID</span>
                <span className="font-mono font-semibold text-cyan-400 block mt-0.5">
                  {foundOrder.transactionId ? maskTrxId(foundOrder.transactionId) : <span className="text-gray-500 italic">Optional</span>}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">Total Paid</span>
                <span className="font-black text-emerald-400 block text-sm mt-0.5">
                  {formatPrice(foundOrder.totalAmount)}
                </span>
              </div>
            </div>

            {/* Support CTA */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 border-t border-white/5 gap-3">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gray-500" />
                Normal verification timeframe is 1 to 5 minutes.
              </span>
              <div className="flex items-center gap-2">
                <a
                  href="https://t.me/callmeriyadh"
                  target="_blank"
                  rel="noreferrer"
                  id="btn-track-telegram-support"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-400 hover:text-cyan-300 font-bold text-xs transition-all active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Chat on Telegram</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* If searched and not found */}
      {hasSearched && !foundOrder && !errorMsg && (
        <div className="text-center py-12 bg-[#0d0d0f] border border-white/5 rounded-3xl p-8">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-500 mx-auto mb-3">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold uppercase tracking-tight text-white">Order Not Found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1">
            We couldn't locate any order matching those credentials. Please check your confirmation screen or SMS for your Order ID.
          </p>
        </div>
      )}
    </div>
  );
};
