import React, { useState } from 'react';
import { 
  Headphones, 
  Send, 
  Mail, 
  Clock, 
  MapPin, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { SITE_CONFIG } from '../config/site';

export const SupportPage: React.FC = () => {
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formName.trim() || !formPhone.trim() || !formMessage.trim()) {
      setError('Please fill out Name, Phone / Telegram Handle, and your Message.');
      return;
    }

    setIsSubmitting(true);
    // Simulate support ticket dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormName('');
      setFormEmail('');
      setFormPhone('');
      setFormSubject('');
      setFormMessage('');
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900 border border-cyan-500/30 text-xs font-bold uppercase tracking-widest text-cyan-400">
          <Headphones className="w-3.5 h-3.5" />
          <span>24/7 Dedicated Assistance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-display uppercase tracking-tight">
          NEXORA Support Center
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Need help with Player UID input, bKash/Nagad payment verification, or an existing order? Our Telegram support is active 24/7.
        </p>
      </div>

      {/* Direct Contact Channels Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Telegram Card - Primary Support Channel */}
        <div className="bg-zinc-900/80 border border-cyan-500/40 hover:border-cyan-400 rounded-3xl p-6 flex flex-col justify-between transition-all backdrop-blur-sm group relative overflow-hidden shadow-xl shadow-cyan-950/20">
          <div className="absolute top-0 right-0 bg-cyan-500 text-black text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl">
            Primary Support
          </div>
          <div>
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/70 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
              <Send className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
              Fastest Response • 24/7 Live
            </span>
            <h3 className="text-lg font-bold text-white mt-1">Telegram Support</h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Instant one-on-one chat with our support team. Connect directly for instant manual payment verification and order status updates.
            </p>
            <div className="mt-4 p-2.5 rounded-xl bg-zinc-950 font-mono text-xs text-cyan-400 border border-cyan-500/30 flex items-center justify-between">
              <span>@callmeriyadh</span>
              <span className="text-[10px] text-zinc-500 font-sans">Avg. &lt; 3 mins</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-800">
            <a
              href="https://t.me/callmeriyadh"
              target="_blank"
              rel="noreferrer"
              id="btn-support-telegram"
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all active:scale-95"
            >
              <Send className="w-3.5 h-3.5 fill-current" />
              <span>Chat on Telegram</span>
            </a>
          </div>
        </div>

        {/* Verification & Manual Payment Help Desk */}
        <div className="bg-zinc-900/80 border border-zinc-800 hover:border-purple-500/50 rounded-3xl p-6 flex flex-col justify-between transition-all backdrop-blur-sm group">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-purple-950/70 border border-purple-500/40 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400">
              Order Help Desk
            </span>
            <h3 className="text-lg font-bold text-white mt-1">Order Verification</h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Sent money via bKash or Nagad? Send your Transaction ID and Order ID directly to our Telegram admin for prioritized dispatch.
            </p>
            <div className="mt-4 p-2.5 rounded-xl bg-zinc-950 font-mono text-xs text-purple-300 border border-zinc-800">
              bKash / Nagad: 01638749806
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-800">
            <a
              href="https://t.me/callmeriyadh"
              target="_blank"
              rel="noreferrer"
              id="btn-support-verify-telegram"
              className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Send className="w-3.5 h-3.5 text-cyan-400" />
              <span>Chat on Telegram</span>
            </a>
          </div>
        </div>

        {/* Email & Hours Card */}
        <div className="bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 rounded-3xl p-6 flex flex-col justify-between transition-all backdrop-blur-sm group">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 mb-4 group-hover:scale-110 transition-transform">
              <Mail className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Official Inquiries
            </span>
            <h3 className="text-lg font-bold text-white mt-1">Email & Operation</h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              For partnership inquiries, order audits, or formal corporate communication.
            </p>
            <a
              href={`mailto:${SITE_CONFIG.support.email}`}
              id="support-email-link"
              className="mt-4 p-2.5 rounded-xl bg-zinc-950 font-mono text-xs text-cyan-400 hover:text-cyan-300 border border-zinc-800 hover:border-cyan-500/40 flex items-center justify-between transition-colors group/link"
            >
              <span>{SITE_CONFIG.support.email}</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover/link:text-cyan-400 transition-colors" />
            </a>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-800 space-y-2 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Hours: {SITE_CONFIG.support.hours}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-purple-400" />
              <span>Location: {SITE_CONFIG.support.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Submission Form */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
            Send an Inquiry
          </span>
          <h2 className="text-2xl font-extrabold text-white font-display mt-1">
            Submit a Support Ticket
          </h2>
          <p className="text-xs text-zinc-400 mt-1.5">
            Fill out the form below and an agent will reply directly to your Telegram handle or phone number.
          </p>
        </div>

        {isSuccess ? (
          <div className="mt-8 p-6 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Ticket Submitted Successfully!</h4>
            <p className="text-xs text-zinc-300 max-w-md mx-auto">
              Thank you for reaching out. A NEXORA support representative has received your ticket and will contact you on Telegram or phone shortly.
            </p>
            <button
              type="button"
              onClick={() => setIsSuccess(false)}
              className="mt-2 px-4 py-2 rounded-xl bg-zinc-800 text-xs font-bold text-white hover:bg-zinc-700"
            >
              Send Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {error && (
              <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                  Your Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="ticket-name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Tanvir Ahmed"
                  className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                  Phone / Telegram Username <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="ticket-phone"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="01XXXXXXXXX or @username"
                  className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                  Email Address <span className="text-zinc-500 lowercase">(optional)</span>
                </label>
                <input
                  type="email"
                  id="ticket-email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                  Subject / Order ID <span className="text-zinc-500 lowercase">(if applicable)</span>
                </label>
                <input
                  type="text"
                  id="ticket-subject"
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  placeholder="e.g. Question regarding NEX-2026..."
                  className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                Your Message / Details <span className="text-red-400">*</span>
              </label>
              <textarea
                id="ticket-message"
                rows={4}
                value={formMessage}
                onChange={(e) => setFormMessage(e.target.value)}
                placeholder="Describe your issue or provide your Transaction ID if you need verification help..."
                className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl p-4 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              id="btn-ticket-submit"
              disabled={isSubmitting}
              className="px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-lg shadow-purple-600/25 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{isSubmitting ? 'Sending Ticket...' : 'Submit Support Ticket'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
