import React from 'react';
import { CheckCircle2, Clock, Loader2, XCircle, AlertCircle, Send } from 'lucide-react';
import { OrderStatus } from '../types';

interface OrderStatusTimelineProps {
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
  history?: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
}

export const OrderStatusTimeline: React.FC<OrderStatusTimelineProps> = ({
  status,
  history = []
}) => {
  if (status === 'Cancelled') {
    return (
      <div className="bg-red-950/30 border border-red-800/60 rounded-2xl p-5 text-red-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-900/50 flex items-center justify-center text-red-400 shrink-0">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-red-300">Order Cancelled</h4>
              <p className="text-xs text-red-400/90 mt-0.5">
                This order was cancelled. If you believe this is an error or already made payment, please contact our 24/7 Telegram support (@callmeriyadh) immediately.
              </p>
            </div>
          </div>
          <a
            href="https://t.me/callmeriyadh"
            target="_blank"
            rel="noreferrer"
            id="btn-cancelled-telegram-support"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 shrink-0 transition-all active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Chat on Telegram</span>
          </a>
        </div>
      </div>
    );
  }

  const steps: { key: OrderStatus; label: string; desc: string }[] = [
    {
      key: 'Pending',
      label: 'Order Submitted',
      desc: 'Payment details awaiting admin matching'
    },
    {
      key: 'Processing',
      label: 'Processing Top-Up',
      desc: 'Transaction verified, delivering items'
    },
    {
      key: 'Completed',
      label: 'Top-Up Delivered',
      desc: 'Credits pushed successfully into account'
    }
  ];

  const getStepIndex = (st: OrderStatus) => {
    switch (st) {
      case 'Pending':
        return 0;
      case 'Processing':
        return 1;
      case 'Completed':
        return 2;
      default:
        return 0;
    }
  };

  const currentIndex = getStepIndex(status);

  return (
    <div className="w-full bg-[#0d0d0f] border border-white/5 rounded-2xl p-5 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
          Order Progress
        </h4>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
            status === 'Completed'
              ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/40'
              : status === 'Processing'
              ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-500/40 animate-pulse'
              : 'bg-amber-950/40 text-amber-400 border border-amber-500/40'
          }`}
        >
          {status === 'Processing' && <Loader2 className="w-3 h-3 animate-spin" />}
          {status === 'Completed' && <CheckCircle2 className="w-3 h-3" />}
          {status === 'Pending' && <Clock className="w-3 h-3" />}
          Status: {status}
        </span>
      </div>

      {/* Progress Bars & Nodes */}
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((step, idx) => {
            const isFinished = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const isFuture = idx > currentIndex;

            return (
              <div key={step.key} className="flex md:flex-col items-start gap-4 md:gap-2">
                <div className="flex items-center">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs transition-all ${
                      isFinished
                        ? 'bg-emerald-400 text-black shadow-md'
                        : isCurrent
                        ? 'bg-white text-black ring-4 ring-white/10 shadow-lg'
                        : 'bg-[#050505] text-gray-500 border border-white/10'
                    }`}
                  >
                    {isFinished ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : isCurrent ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <span>0{idx + 1}</span>
                    )}
                  </div>
                </div>

                <div>
                  <h5
                    className={`text-sm font-bold uppercase tracking-tight ${
                      isCurrent ? 'text-cyan-400' : isFinished ? 'text-white' : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </h5>
                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Status History notes if available */}
      {history && history.length > 0 && (
        <div className="mt-6 pt-5 border-t border-white/5 space-y-2">
          <p className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-gray-400" />
            Activity Log
          </p>
          <div className="space-y-1.5">
            {history.map((h, i) => (
              <div key={i} className="text-xs flex items-baseline justify-between text-gray-400 bg-[#050505] p-2 rounded-lg border border-white/5">
                <span className="font-medium text-gray-300">{h.note || `Stage: ${h.status}`}</span>
                <span className="text-[11px] text-gray-500 shrink-0 ml-2 font-mono">
                  {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
