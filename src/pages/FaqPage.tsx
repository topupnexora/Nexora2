import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Headphones, 
  Package, 
  CreditCard,
  ShieldCheck
} from 'lucide-react';
import { FAQS_DATA } from '../data/games';
import { SITE_CONFIG } from '../config/site';

export const FaqPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'how-to-top-up': true,
    'delivery-time': true,
  });

  const toggleFaq = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredFaqs = FAQS_DATA.filter(
    (f) =>
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900 border border-purple-500/30 text-xs font-bold uppercase tracking-widest text-cyan-400">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Knowledge Base & Guides</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-display uppercase tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
          Everything you need to know about top-ups, UID safety, bKash & Nagad payments, and delivery timelines on {SITE_CONFIG.name}.
        </p>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <input
          type="text"
          id="faq-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search questions (e.g. refund, bKash, UID, delivery time)..."
          className="w-full bg-zinc-900/90 border border-zinc-700/80 rounded-2xl px-5 py-4 pl-12 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 shadow-xl"
        />
        <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-4" />
      </div>

      {/* FAQs List */}
      <div className="space-y-4">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => {
            const isOpen = Boolean(openIds[faq.id]);
            return (
              <div
                key={faq.id}
                id={`faq-item-${faq.id}`}
                className="bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 rounded-2xl overflow-hidden transition-all shadow-md"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4"
                >
                  <span className="text-sm sm:text-base font-bold text-white flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                    {faq.question}
                  </span>
                  <div className="p-1 rounded-lg bg-zinc-800 text-zinc-400 shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-zinc-800/80 text-xs sm:text-sm text-zinc-400 leading-relaxed animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-zinc-900/40 rounded-2xl border border-zinc-800 text-zinc-400 text-sm">
            No matching questions found for "{searchQuery}". You can contact support directly.
          </div>
        )}
      </div>

      {/* Still need help CTA */}
      <div className="bg-gradient-to-r from-purple-950/60 to-cyan-950/60 border border-purple-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-lg font-bold text-white">Still have questions?</h4>
          <p className="text-xs text-zinc-400 mt-1">
            Our support agents are available around the clock to help with any payment or top-up issue.
          </p>
        </div>
        <Link
          to="/support"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-xs shrink-0 hover:opacity-95 transition-opacity"
        >
          Contact 24/7 Support
        </Link>
      </div>
    </div>
  );
};
