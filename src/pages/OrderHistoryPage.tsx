import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, Filter, ChevronRight, Search, AlertCircle, ShoppingBag } from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice, formatDate } from '../utils/format';
import { OrderStatus } from '../types';
import { HighlightTopUp } from '../components/HighlightTopUp';

export const OrderHistoryPage: React.FC = () => {
  const { orders } = useOrder();
  const { user } = useAuth();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter orders relevant to current user or all if guest
  const baseOrders = user
    ? orders.filter(
        (o) => o.customerName.toLowerCase() === user.name.toLowerCase() || o.phone === user.phone
      )
    : orders;

  const filteredOrders = baseOrders.filter((ord) => {
    const matchesStatus = statusFilter === 'All' || ord.status === statusFilter;
    const matchesSearch =
      ord.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.items.some((i) => i.gameName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-widest mb-1">
            <Package className="w-4 h-4" />
            <span>Order Records</span>
          </div>
          <h1 className="text-3xl font-black text-white font-display uppercase tracking-tight">
            Order History
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            {user ? (
              <>
                Displaying stored <span className="text-red-500 font-semibold">top-up</span> orders for {user.name}
              </>
            ) : (
              'Displaying recent browser session orders'
            )}
          </p>
        </div>

        <Link
          to="/games"
          className="px-5 py-2.5 rounded-lg bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-cyan-400 transition-colors self-start sm:self-auto shadow-xl"
        >
          New <span className="text-red-600 font-black">Top-Up</span>
        </Link>
      </div>

      {/* Filter and Search */}
      <div className="bg-[#0d0d0f] border border-white/5 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order ID or Game..."
            className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-2.5 pl-10 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-3" />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto no-scrollbar">
          {(['All', 'Pending', 'Processing', 'Completed', 'Cancelled'] as (OrderStatus | 'All')[]).map(
            (st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  statusFilter === st
                    ? 'bg-white text-black shadow-md'
                    : 'bg-[#050505] text-gray-400 hover:text-white border border-white/10'
                }`}
              >
                {st}
              </button>
            )
          )}
        </div>
      </div>

      {/* Order List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.orderId}
              className="bg-[#0d0d0f] border border-white/5 rounded-3xl p-6 backdrop-blur-sm space-y-4 hover:border-white/10 transition-colors"
            >
              {/* Order Meta Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4 gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm sm:text-base font-black text-cyan-400 font-mono">
                    {order.orderId}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      order.status === 'Completed'
                        ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30'
                        : order.status === 'Processing'
                        ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-500/30'
                        : order.status === 'Cancelled'
                        ? 'bg-red-950/40 text-red-400 border border-red-500/30'
                        : 'bg-amber-950/40 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="text-xs text-gray-400 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-gray-500" />
                  <span>Placed on {formatDate(order.createdAt)}</span>
                </div>
              </div>

              {/* Order Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 bg-[#050505] rounded-xl border border-white/5 text-xs"
                  >
                    <img
                      src={item.gameImage}
                      alt={item.gameName}
                      className="w-10 h-10 object-cover rounded-lg border border-white/10"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white uppercase tracking-tight truncate">{item.gameName}</p>
                      <p className="text-cyan-400 font-medium">
                        {item.quantity}x <HighlightTopUp text={item.packageName} redClassName="text-red-500 font-bold" />
                      </p>
                      <p className="text-[11px] text-gray-500 font-mono">
                        UID: {item.playerId} {item.serverId ? `(${item.serverId})` : ''}
                      </p>
                    </div>
                    <div className="text-right font-black text-white">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-white/5 gap-3 text-xs">
                <div className="flex items-center gap-4 text-gray-400">
                  <span>
                    Payment: <strong className="text-gray-200">{order.paymentMethod}</strong>
                  </span>
                  <span>
                    TrxID: <strong className="font-mono text-cyan-400">{order.transactionId}</strong>
                  </span>
                  <span>
                    Total: <strong className="text-emerald-400 font-bold">{formatPrice(order.totalAmount)}</strong>
                  </span>
                </div>

                <Link
                  to={`/track-order?orderId=${encodeURIComponent(order.orderId)}`}
                  className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-bold self-start sm:self-auto"
                >
                  <span>Track Full Timeline</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#0d0d0f] border border-white/5 rounded-3xl p-8 max-w-md mx-auto">
          <ShoppingBag className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <h3 className="text-base font-bold uppercase tracking-tight text-white">No Orders Found</h3>
          <p className="text-xs text-gray-400 mt-1">
            {searchTerm || statusFilter !== 'All' ? (
              'No orders match your active search or status filter.'
            ) : (
              <>
                You have not placed any <span className="text-red-500 font-semibold">top-up</span> orders yet.
              </>
            )}
          </p>
          <Link
            to="/games"
            className="inline-block mt-4 px-5 py-2.5 rounded-lg bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-cyan-400 transition-colors"
          >
            Explore Games & Packages
          </Link>
        </div>
      )}
    </div>
  );
};
