import React from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, CheckCircle, XCircle, AlertTriangle, ChevronLeft } from 'lucide-react';
import { SITE_CONFIG } from '../config/site';

export const RefundPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-cyan-400 transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-purple-500/30 text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Fair Play & Protection</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-display uppercase tracking-tight">
          Refund & Cancellation Policy
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Last revised: September 2026 • Transparent guidelines for all NEXORA gamers.
        </p>
      </div>

      <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 sm:p-10 space-y-6 text-sm text-zinc-300 leading-relaxed backdrop-blur-md">
        <p>
          At <strong>NEXORA</strong>, we strive to deliver 100% genuine game <span className="text-red-500 font-semibold">top-ups</span> rapidly. Because digital goods (diamonds, UC, robux, and credits) are consumable and cannot be returned once credited to a player account, please review our refund conditions below.
        </p>

        {/* When refund is eligible */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            When You ARE Eligible for a 100% Full Refund
          </h2>
          <div className="space-y-2 text-zinc-300">
            <div className="p-3.5 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl flex items-start gap-3">
              <span className="text-emerald-400 font-bold shrink-0">✓</span>
              <span><strong>Publisher Server Error / Outage:</strong> If the game server is under emergency maintenance and we cannot deliver your credits within 12 hours, you may request an instant full refund.</span>
            </div>
            <div className="p-3.5 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl flex items-start gap-3">
              <span className="text-emerald-400 font-bold shrink-0">✓</span>
              <span><strong>Duplicate Charge / Overpayment:</strong> If you accidentally transferred money twice for the same order, the excess amount will be refunded directly to your bKash or Nagad wallet.</span>
            </div>
            <div className="p-3.5 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl flex items-start gap-3">
              <span className="text-emerald-400 font-bold shrink-0">✓</span>
              <span><strong>Package Out of Stock:</strong> If an ordered denomination or weekly pass is temporarily unavailable from the publisher.</span>
            </div>
          </div>
        </section>

        {/* When refund is NOT eligible */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" />
            When Refunds CANNOT Be Granted
          </h2>
          <div className="space-y-2 text-zinc-300">
            <div className="p-3.5 bg-red-950/20 border border-red-500/30 rounded-2xl flex items-start gap-3">
              <span className="text-red-400 font-bold shrink-0">✕</span>
              <span><strong>Incorrect Player UID Submitted:</strong> If you entered an incorrect UID and the recharge has already completed to that account, the <span className="text-red-500 font-semibold">top-up</span> cannot be undone or refunded.</span>
            </div>
            <div className="p-3.5 bg-red-950/20 border border-red-500/30 rounded-2xl flex items-start gap-3">
              <span className="text-red-400 font-bold shrink-0">✕</span>
              <span><strong>Change of Mind Post-Delivery:</strong> Once diamonds, UC, or passes appear in your in-game inventory, we cannot revoke or refund them.</span>
            </div>
            <div className="p-3.5 bg-red-950/20 border border-red-500/30 rounded-2xl flex items-start gap-3">
              <span className="text-red-400 font-bold shrink-0">✕</span>
              <span><strong>In-Game Account Bans:</strong> If a player account is suspended or banned by the game publisher for third-party cheat tools or game violations unrelated to NEXORA.</span>
            </div>
          </div>
        </section>

        {/* How to claim */}
        <section className="space-y-2 pt-4 border-t border-zinc-800">
          <h2 className="text-base font-bold text-white">How to Request a Refund</h2>
          <p className="text-xs text-zinc-400">
            If your order meets eligible criteria, message our 24/7 team on Telegram at{' '}
            <a
              href="https://t.me/callmeriyadh"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 underline font-bold"
            >
              @callmeriyadh
            </a>{' '}
            or submit a ticket on our{' '}
            <Link to="/support" className="text-cyan-400 underline font-semibold">
              Support Page
            </Link>{' '}
            stating your NEXORA Order ID and mobile number. Valid refunds are processed within 1 to 24 hours back to your original payment number.
          </p>
        </section>
      </div>
    </div>
  );
};
