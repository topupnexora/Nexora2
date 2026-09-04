import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Eye, FileText, ChevronLeft } from 'lucide-react';
import { SITE_CONFIG } from '../config/site';

export const PrivacyPolicyPage: React.FC = () => {
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
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Data Privacy & Protection</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-display uppercase tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Last updated: September 2026 • NEXORA Gaming Services (Bangladesh)
        </p>
      </div>

      <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 sm:p-10 space-y-6 text-sm text-zinc-300 leading-relaxed backdrop-blur-md">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-cyan-400" />
            1. Information We Collect
          </h2>
          <p>
            When you purchase in-game credits, diamonds, UC, or battle passes on <strong>NEXORA</strong>, we collect only the necessary details to fulfill your delivery:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-zinc-400">
            <li><strong>In-Game Identifier (UID / Character ID / Zone ID):</strong> Required by game publishers to dispatch digital credits.</li>
            <li><strong>Contact Details:</strong> Customer name, mobile number, and optional email for order status notifications.</li>
            <li><strong>Payment Audit Details:</strong> Mobile wallet sender number and Transaction ID (TrxID) to confirm your bKash or Nagad manual payment.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-purple-400" />
            2. We NEVER Ask for Game Passwords
          </h2>
          <div className="p-4 bg-purple-950/30 border border-purple-800/40 rounded-2xl text-xs text-purple-200">
            <strong>Critical Security Guarantee:</strong> NEXORA operates strictly through official top-up partner APIs and authorized publisher distribution gateways. We will <strong>NEVER</strong> ask for your game password, Google account credentials, Facebook login, or OTP codes. Anyone requesting your credentials while claiming to represent NEXORA is an impostor.
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            3. How Your Information is Used
          </h2>
          <p>
            Your collected information is strictly used for:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-zinc-400">
            <li>Matching incoming mobile wallet payments against order queue records.</li>
            <li>Dispatching credits to the designated game publisher server.</li>
            <li>Responding to customer support inquiries on Telegram (@callmeriyadh) and email.</li>
            <li>Preventing fraudulent recharge attempts and duplicate transaction exploitation.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            4. Data Retention & Compliance
          </h2>
          <p>
            Order records and transaction identifiers are retained securely for transaction audit purposes in compliance with Bangladeshi e-commerce guidelines. We never sell, rent, or trade your personal information to third-party marketing companies.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-zinc-800">
          <h2 className="text-base font-bold text-white">5. Contact Our Data Officer</h2>
          <p className="text-xs text-zinc-400">
            If you have questions regarding your data privacy or wish to request deletion of your account record, reach out to our team at{' '}
            <a href={`mailto:${SITE_CONFIG.support.email}`} className="text-cyan-400 underline">
              {SITE_CONFIG.support.email}
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
};
