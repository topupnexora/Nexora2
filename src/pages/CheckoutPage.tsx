import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  CreditCard, 
  Copy, 
  Check, 
  AlertCircle, 
  Clock, 
  HelpCircle, 
  ArrowRight,
  Info,
  ChevronLeft,
  Building2,
  Coins,
  Send,
  Smartphone,
  X
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import { SITE_CONFIG } from '../config/site';
import { PAYMENT_CONFIG, SupportedPaymentMethod } from '../config/payment';
import { formatPrice, isValidBDPhone } from '../utils/format';
import { HighlightTopUp } from '../components/HighlightTopUp';

export const CheckoutPage: React.FC = () => {
  const { cart, total, clearCart, updatePlayerId } = useCart();
  const { user } = useAuth();
  const { createOrder } = useOrder();
  const navigate = useNavigate();

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  // Customer Contact Information
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');

  // Payment Selection: bKash, Nagad (Active methods)
  const [paymentMethod, setPaymentMethod] = useState<SupportedPaymentMethod>('bKash');
  // Customer Payment Sender Number (Separate from contact phone - never autofilled)
  const [paymentSenderNumber, setPaymentSenderNumber] = useState('');
  // Transaction ID is strictly OPTIONAL
  const [transactionId, setTransactionId] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Player ID error popup / toast state
  const [playerIdErrorToast, setPlayerIdErrorToast] = useState(false);
  const toastTimeoutRef = useRef<any>(null);

  // Copy states
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};

    // 1. Validate Player ID / Character ID for all cart items
    let missingPlayerIdIndex = -1;
    for (let i = 0; i < cart.length; i++) {
      if (!cart[i].playerId || !cart[i].playerId.trim()) {
        missingPlayerIdIndex = i;
        break;
      }
    }

    if (missingPlayerIdIndex !== -1) {
      setPlayerIdErrorToast(true);
      errs[`item_${missingPlayerIdIndex}_playerId`] = 'Please enter your Player ID First';

      // Auto-focus and scroll to the missing Player ID input
      setTimeout(() => {
        const inputEl = document.getElementById(`checkout-item-player-id-${missingPlayerIdIndex}`);
        if (inputEl) {
          inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          inputEl.focus();
        }
      }, 50);

      // Auto-hide toast after 4.5 seconds
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = setTimeout(() => {
        setPlayerIdErrorToast(false);
      }, 4500);

      setFormErrors(errs);
      return false;
    }

    // 2. Customer Contact Information
    if (!customerName.trim()) {
      errs.customerName = 'Please enter your full name.';
    }

    if (!customerPhone.trim()) {
      errs.customerPhone = 'Your contact mobile number is required.';
    } else if (!isValidBDPhone(customerPhone)) {
      errs.customerPhone = 'Please enter a valid 11-digit Bangladeshi phone number (01XXXXXXXXX).';
    }

    // 3. Validate Cart Items: Server/Zone ID & Quantity
    if (cart.length === 0) {
      errs.general = 'Your cart is empty. Please select a package.';
    }

    cart.forEach((item, index) => {
      // MLBB or games requiring Server/Zone ID
      if (item.gameId === 'mobile-legends' && (!item.serverId || !item.serverId.trim())) {
        errs[`item_${index}_serverId`] = `${item.gameName} requires a Zone ID / Server ID.`;
      }
      if (!item.quantity || item.quantity < 1) {
        errs[`item_${index}_quantity`] = 'Quantity must be at least 1.';
      }
    });

    // 4. Validate Total Amount
    if (total <= 0) {
      errs.general = 'Total amount is invalid. Please select valid game packages.';
    }

    // 5. Validate Payment Sender Number (REQUIRED for bKash & Nagad)
    if (!paymentMethod) {
      errs.paymentMethod = 'Please select a payment method.';
    }

    if (!paymentSenderNumber.trim()) {
      errs.paymentSenderNumber = 'Please enter your Payment Sender Number';
      setTimeout(() => {
        const senderInput = document.getElementById('checkout-payment-sender-number');
        if (senderInput) {
          senderInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          senderInput.focus();
        }
      }, 50);
    } else if ((paymentMethod === 'bKash' || paymentMethod === 'Nagad') && !isValidBDPhone(paymentSenderNumber)) {
      errs.paymentSenderNumber = 'Please enter a valid 11-digit Bangladeshi mobile number (01XXXXXXXXX).';
    }

    // Note: Transaction ID is strictly OPTIONAL. No validation error if left empty!

    if (!agreeTerms) {
      errs.agreeTerms = 'Please confirm that you have read and agreed to the verification process.';
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // NEXORA receiving number for both bKash and Nagad
      const paymentNumberSentTo = PAYMENT_CONFIG.RECEIVING_NUMBER || '01638749806';
      // Transaction ID is optional: if empty, send "Not provided"
      const finalTrxId = transactionId.trim() ? transactionId.trim().toUpperCase() : 'Not provided';

      const result = await createOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        phone: customerPhone.trim(),
        email: email ? email.trim() : undefined,
        items: cart,
        totalAmount: total,
        paymentMethod,
        paymentNumberSentTo,
        paymentSenderNumber: paymentSenderNumber.trim(),
        senderPhone: paymentSenderNumber.trim(),
        transactionId: finalTrxId
      });

      if (result.success && result.order) {
        // Clear the cart only after successful order submission
        clearCart();
        // Navigate to confirmation page
        navigate(`/order-confirmation/${result.order.orderId}`);
      } else {
        setFormErrors({ general: result.error || 'Failed to submit order. Please try again.' });
      }
    } catch (err: any) {
      setFormErrors({ general: err.message || 'An unexpected error occurred while placing order.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8 relative">
      {/* Red Error Toast for Missing Player ID */}
      {playerIdErrorToast && (
        <div
          role="alert"
          id="checkout-player-id-error-toast"
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[92%] sm:w-auto min-w-[320px] max-w-md bg-red-950/95 border-2 border-red-500 text-white px-5 py-3.5 rounded-2xl shadow-[0_10px_40px_rgba(239,68,68,0.5)] backdrop-blur-xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4 duration-200"
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
            id="btn-close-checkout-error-toast"
            onClick={() => setPlayerIdErrorToast(false)}
            aria-label="Close error notice"
            className="p-1 rounded-lg text-red-300 hover:text-white hover:bg-red-900/60 transition-colors shrink-0 ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Breadcrumbs */}
      <div className="flex items-center justify-between">
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-cyan-400 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Return to Cart</span>
        </Link>

        {/* Telegram Contact Button as required */}
        <a
          href="https://t.me/callmeriyadh"
          target="_blank"
          rel="noreferrer"
          id="btn-telegram-support-checkout"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold transition-all"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Chat on Telegram</span>
        </a>
      </div>

      <div className="border-b border-white/5 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-display">
          Checkout & Order Verification
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Select your preferred payment method and provide transaction details for instant manual verification.
        </p>
      </div>

      {formErrors.general && (
        <div className="p-4 bg-red-950/40 border border-red-500/40 rounded-2xl text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{formErrors.general}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Details */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* STEP 1: CUSTOMER INFORMATION */}
          <div className="bg-[#0d0d0f] border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-cyan-400 font-black text-sm flex items-center justify-center font-display">
                1
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight text-gray-100">
                  Customer Contact Information
                </h3>
                <p className="text-xs text-gray-400">
                  Used for order tracking, confirmation, and support assistance.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="checkout-name"
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    if (formErrors.customerName) setFormErrors({ ...formErrors, customerName: '' });
                  }}
                  placeholder="e.g. Shakib Ahmed"
                  className={`w-full bg-[#050505] border ${
                    formErrors.customerName ? 'border-red-500 ring-1 ring-red-500' : 'border-white/10'
                  } rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400`}
                />
                {formErrors.customerName && (
                  <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{formErrors.customerName}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Customer Contact Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  id="checkout-phone"
                  value={customerPhone}
                  onChange={(e) => {
                    setCustomerPhone(e.target.value);
                    if (formErrors.customerPhone) {
                      setFormErrors((prev) => {
                        const copy = { ...prev };
                        delete copy.customerPhone;
                        return copy;
                      });
                    }
                  }}
                  placeholder="01XXXXXXXXX"
                  className={`w-full bg-[#050505] border ${
                    formErrors.customerPhone ? 'border-red-500 ring-2 ring-red-500/50 bg-red-950/20' : 'border-white/10'
                  } rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400 font-mono`}
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  NEXORA will contact you at this number for order delivery &amp; confirmation.
                </p>
                {formErrors.customerPhone && (
                  <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{formErrors.customerPhone}</span>
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Email Address <span className="text-gray-500 font-normal lowercase">(optional for email invoice)</span>
                </label>
                <input
                  type="email"
                  id="checkout-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="gamer@gmail.com"
                  className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* STEP 2: SELECT PAYMENT METHOD */}
          <div className="bg-[#0d0d0f] border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-md space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-cyan-400 font-black text-sm flex items-center justify-center font-display">
                2
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight text-gray-100">
                  Select Payment Method
                </h3>
                <p className="text-xs text-gray-400">
                  Choose between bKash or Nagad.
                </p>
              </div>
            </div>

            {/* Payment Options Grid: bKash, Nagad (Active) */}
            <div className="grid grid-cols-2 gap-3 max-w-md">
              {/* bKash */}
              <button
                type="button"
                id="btn-select-bkash"
                onClick={() => {
                  setPaymentMethod('bKash');
                  setFormErrors((prev) => {
                    const copy = { ...prev };
                    delete copy.paymentSenderNumber;
                    return copy;
                  });
                }}
                className={`p-4 rounded-2xl border text-left transition-all relative ${
                  paymentMethod === 'bKash'
                    ? 'bg-pink-950/25 border-pink-500 ring-1 ring-pink-500/40 text-white shadow-lg'
                    : 'bg-[#050505] border-white/10 text-gray-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-pink-500" />
                  {paymentMethod === 'bKash' && (
                    <Check className="w-4 h-4 text-pink-400 stroke-[3]" />
                  )}
                </div>
                <div className="font-bold text-white text-sm">bKash</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Send Money</div>
              </button>

              {/* Nagad */}
              <button
                type="button"
                id="btn-select-nagad"
                onClick={() => {
                  setPaymentMethod('Nagad');
                  setFormErrors((prev) => {
                    const copy = { ...prev };
                    delete copy.paymentSenderNumber;
                    return copy;
                  });
                }}
                className={`p-4 rounded-2xl border text-left transition-all relative ${
                  paymentMethod === 'Nagad'
                    ? 'bg-orange-950/25 border-orange-500 ring-1 ring-orange-500/40 text-white shadow-lg'
                    : 'bg-[#050505] border-white/10 text-gray-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-orange-500" />
                  {paymentMethod === 'Nagad' && (
                    <Check className="w-4 h-4 text-orange-400 stroke-[3]" />
                  )}
                </div>
                <div className="font-bold text-white text-sm">Nagad</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Send Money</div>
              </button>
            </div>

            {/* DYNAMIC PAYMENT INSTRUCTIONS & RECIPIENT DETAILS */}
            
            {/* 1. bKash Details */}
            {paymentMethod === 'bKash' && (
              <div className="space-y-4">
                <div className="bg-[#050505] border border-pink-500/30 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
                  {/* Header & Number Display */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-pink-500 shrink-0" />
                        <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-pink-400">
                          NEXORA bKash Number
                        </span>
                      </div>
                      <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-wider pt-1 select-all">
                        {PAYMENT_CONFIG.BKASH_NUMBER}
                      </div>
                    </div>

                    <button
                      type="button"
                      id="btn-copy-bkash"
                      onClick={() => handleCopyText(PAYMENT_CONFIG.BKASH_NUMBER, 'bkash')}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-pink-500/15 hover:bg-pink-500/25 active:scale-95 border border-pink-500/40 text-xs font-bold uppercase tracking-wider text-pink-300 transition-all self-start sm:self-auto min-h-[44px]"
                    >
                      {copiedKey === 'bkash' ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Number Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy 01638749806</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Required Amount & Directives Banner */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-pink-950/20 border border-pink-500/20 rounded-xl">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        Exact Payable Amount:
                      </span>
                      <span className="text-xl sm:text-2xl font-black text-white font-display">
                        {formatPrice(total)}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-pink-200/90 leading-relaxed">
                      <span>
                        Please send exact amount <strong className="text-white">{formatPrice(total)}</strong> to{' '}
                        <strong className="text-white font-mono">{PAYMENT_CONFIG.BKASH_NUMBER}</strong> using bKash <strong>Send Money</strong>.
                      </span>
                    </div>
                  </div>

                  {/* Step-by-Step Instructions */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-gray-300 space-y-2">
                    <h4 className="font-bold flex items-center gap-1.5 text-pink-400 uppercase tracking-wider text-[11px]">
                      <ShieldCheck className="w-4 h-4 text-pink-400" />
                      Payment Steps
                    </h4>
                    <ol className="list-decimal pl-4 space-y-1.5 text-gray-400 leading-relaxed">
                      <li>Open your bKash App and tap on <strong>Send Money</strong>.</li>
                      <li>Enter recipient number: <strong className="text-white font-mono">{PAYMENT_CONFIG.BKASH_NUMBER}</strong>.</li>
                      <li>Enter required payable amount: <strong className="text-white">{formatPrice(total)}</strong>.</li>
                      <li>Enter your bKash PIN to confirm transaction.</li>
                      <li>Copy the <strong>Transaction ID (TrxID)</strong> from your confirmation SMS or app statement.</li>
                      <li>Enter your sender number and <strong>Transaction ID</strong> in the fields below to complete order.</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Nagad Details */}
            {paymentMethod === 'Nagad' && (
              <div className="space-y-4">
                <div className="bg-[#050505] border border-orange-500/30 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
                  {/* Header & Number Display */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" />
                        <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-orange-400">
                          NEXORA Nagad Number
                        </span>
                      </div>
                      <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-wider pt-1 select-all">
                        {PAYMENT_CONFIG.NAGAD_NUMBER}
                      </div>
                    </div>

                    <button
                      type="button"
                      id="btn-copy-nagad"
                      onClick={() => handleCopyText(PAYMENT_CONFIG.NAGAD_NUMBER, 'nagad')}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 active:scale-95 border border-orange-500/40 text-xs font-bold uppercase tracking-wider text-orange-300 transition-all self-start sm:self-auto min-h-[44px]"
                    >
                      {copiedKey === 'nagad' ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Number Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy 01638749806</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Required Amount & Directives Banner */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-orange-950/20 border border-orange-500/20 rounded-xl">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        Exact Payable Amount:
                      </span>
                      <span className="text-xl sm:text-2xl font-black text-white font-display">
                        {formatPrice(total)}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-orange-200/90 leading-relaxed">
                      <span>
                        Please send exact amount <strong className="text-white">{formatPrice(total)}</strong> to{' '}
                        <strong className="text-white font-mono">{PAYMENT_CONFIG.NAGAD_NUMBER}</strong> using Nagad <strong>Send Money</strong>.
                      </span>
                    </div>
                  </div>

                  {/* Step-by-Step Instructions */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-gray-300 space-y-2">
                    <h4 className="font-bold flex items-center gap-1.5 text-orange-400 uppercase tracking-wider text-[11px]">
                      <ShieldCheck className="w-4 h-4 text-orange-400" />
                      Payment Steps
                    </h4>
                    <ol className="list-decimal pl-4 space-y-1.5 text-gray-400 leading-relaxed">
                      <li>Open your Nagad App and tap on <strong>Send Money</strong>.</li>
                      <li>Enter recipient number: <strong className="text-white font-mono">{PAYMENT_CONFIG.NAGAD_NUMBER}</strong>.</li>
                      <li>Enter required payable amount: <strong className="text-white">{formatPrice(total)}</strong>.</li>
                      <li>Enter your Nagad PIN to confirm transaction.</li>
                      <li>Copy the <strong>Transaction ID (TrxID)</strong> received in the SMS receipt.</li>
                      <li>Enter your sender number and <strong>Transaction ID</strong> in the fields below to complete order.</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Binance Pay Details */}
            {paymentMethod === 'Binance Pay' && (
              <div className="space-y-4">
                <div className="bg-[#050505] border border-yellow-500/20 rounded-2xl p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-yellow-400 block">
                        NEXORA Binance Pay ID / Address ({PAYMENT_CONFIG.BINANCE_PAY_TYPE})
                      </span>
                      <div className="text-xl sm:text-2xl font-black text-white font-mono mt-1 break-all">
                        {PAYMENT_CONFIG.BINANCE_PAY_ID_OR_ADDRESS}
                      </div>
                    </div>

                    <button
                      type="button"
                      id="btn-copy-binance"
                      onClick={() => handleCopyText(PAYMENT_CONFIG.BINANCE_PAY_ID_OR_ADDRESS, 'binance')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-xs font-bold uppercase tracking-wider text-yellow-300 transition-colors self-start sm:self-auto shrink-0"
                    >
                      {copiedKey === 'binance' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Binance ID / Address</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-amber-400/90 pt-1">
                    <Info className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>
                      Order BDT Value: <strong className="text-white">{formatPrice(total)}</strong>. Send the equivalent USDT value via Binance Pay.
                    </span>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-gray-300 space-y-2">
                  <h4 className="font-bold flex items-center gap-1.5 text-yellow-400 uppercase tracking-wider text-[11px]">
                    <Coins className="w-4 h-4 text-yellow-400" />
                    Binance Pay Instructions
                  </h4>
                  <ol className="list-decimal pl-4 space-y-1 text-gray-400">
                    <li>Open your Binance App and tap <strong>Pay</strong> (or Send Crypto).</li>
                    <li>Recipient Binance Pay ID / Address: <strong className="text-white font-mono">{PAYMENT_CONFIG.BINANCE_PAY_ID_OR_ADDRESS}</strong>.</li>
                    <li>Transfer the equivalent USDT / crypto amount for <strong className="text-white">{formatPrice(total)}</strong>.</li>
                    <li>Once sent, note your <strong>Binance Order ID / Internal Transfer ID / TXID</strong>.</li>
                    <li>Enter your Binance Pay ID / Nickname / Email and the Order/Transaction ID below.</li>
                  </ol>
                </div>
              </div>
            )}

            {/* 4. Bank Transfer Details */}
            {paymentMethod === 'Bank Transfer' && (
              <div className="space-y-4">
                <div className="bg-[#050505] border border-emerald-500/20 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-emerald-400">
                      NEXORA Bank Account Details
                    </span>

                    <button
                      type="button"
                      id="btn-copy-bank-acc"
                      onClick={() => handleCopyText(PAYMENT_CONFIG.BANK_ACCOUNT_NUMBER, 'bank_acc')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-[11px] font-bold uppercase tracking-wider text-emerald-300 transition-colors"
                    >
                      {copiedKey === 'bank_acc' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied A/C!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Account No</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-gray-500 block">Bank Name</span>
                      <span className="font-bold text-white text-sm">{PAYMENT_CONFIG.BANK_NAME}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Account Name</span>
                      <span className="font-bold text-white text-sm">{PAYMENT_CONFIG.BANK_ACCOUNT_NAME}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Account Number</span>
                      <span className="font-mono font-bold text-cyan-400 text-sm">{PAYMENT_CONFIG.BANK_ACCOUNT_NUMBER}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Branch & Routing</span>
                      <span className="font-bold text-white text-xs">
                        {PAYMENT_CONFIG.BANK_BRANCH} (Routing: {PAYMENT_CONFIG.BANK_ROUTING_NUMBER})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-amber-400/90 pt-2 border-t border-white/5">
                    <Info className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>
                      Supports instant NPSB, BEFTN, or App transfer. Transfer exact amount: <strong className="text-white">{formatPrice(total)}</strong>.
                    </span>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-gray-300 space-y-2">
                  <h4 className="font-bold flex items-center gap-1.5 text-emerald-400 uppercase tracking-wider text-[11px]">
                    <Building2 className="w-4 h-4 text-emerald-400" />
                    Bank Transfer Instructions
                  </h4>
                  <ol className="list-decimal pl-4 space-y-1 text-gray-400">
                    <li>Use your Bank App or Internet Banking to transfer <strong className="text-white">{formatPrice(total)}</strong> to the account above.</li>
                    <li>NPSB transfer is recommended for instant settlement.</li>
                    <li>Note the <strong>Reference / Journal / Slip / Transaction ID</strong> from your transfer confirmation.</li>
                    <li>Enter your sender Bank Account Name/Number and Reference ID below.</li>
                  </ol>
                </div>
              </div>
            )}

            {/* SENDER INPUTS & TRANSACTION ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label htmlFor="checkout-payment-sender-number" className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Payment Sender Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  id="checkout-payment-sender-number"
                  value={paymentSenderNumber}
                  onChange={(e) => {
                    setPaymentSenderNumber(e.target.value);
                    if (formErrors.paymentSenderNumber) {
                      setFormErrors((prev) => {
                        const copy = { ...prev };
                        delete copy.paymentSenderNumber;
                        return copy;
                      });
                    }
                  }}
                  placeholder={paymentMethod === 'bKash' ? 'e.g. 017XXXXXXXX' : 'e.g. 018XXXXXXXX'}
                  className={`w-full bg-[#050505] border ${
                    formErrors.paymentSenderNumber ? 'border-red-500 ring-2 ring-red-500/50 bg-red-950/20' : 'border-white/10'
                  } rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400 font-mono`}
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Enter the bKash/Nagad number you used to send the payment.
                </p>
                {formErrors.paymentSenderNumber && (
                  <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{formErrors.paymentSenderNumber}</span>
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="checkout-trx-id" className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Transaction ID (<span className="font-bold text-yellow-400">Optional</span>)
                </label>
                <input
                  type="text"
                  id="checkout-trx-id"
                  value={transactionId}
                  onChange={(e) => {
                    setTransactionId(e.target.value.toUpperCase());
                  }}
                  placeholder="e.g. 9K4M8X2A10"
                  className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400 font-mono uppercase"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Enter your Transaction ID if available. If left empty, your order will still be processed.
                </p>
              </div>
            </div>

            {/* Notice & Terms confirmation checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  id="checkbox-agree-terms"
                  checked={agreeTerms}
                  onChange={(e) => {
                    setAgreeTerms(e.target.checked);
                    if (formErrors.agreeTerms) setFormErrors({ ...formErrors, agreeTerms: '' });
                  }}
                  className="mt-1 rounded bg-[#050505] border-white/20 text-cyan-400 focus:ring-cyan-400"
                />
                <span className="text-xs text-gray-400 leading-relaxed">
                  I confirm that I have sent the exact amount ({formatPrice(total)}) via {paymentMethod} and verified my Player UID. I acknowledge payment will be verified by admin before diamond/UC credits are pushed to my game account.
                </span>
              </label>
              {formErrors.agreeTerms && (
                <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{formErrors.agreeTerms}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order Button */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-24 bg-[#0d0d0f] border border-white/5 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl space-y-6">
            <h3 className="text-lg font-bold uppercase tracking-tight text-white border-b border-white/5 pb-4 font-display">
              Order Items ({cart.length})
            </h3>

            {/* Items summary */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item, idx) => (
                <div
                  key={item.id}
                  className="bg-[#050505] p-3 rounded-xl border border-white/5 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1 pr-2">
                      <p className="font-bold text-white uppercase tracking-tight truncate">{item.gameName}</p>
                      <p className="text-cyan-400 font-medium">
                        {item.quantity}x <HighlightTopUp text={item.packageName} redClassName="text-red-500 font-bold" />
                      </p>
                    </div>
                    <div className="font-black text-white shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>

                  <div className="text-[11px] text-gray-400 font-mono flex items-center justify-between border-t border-white/5 pt-1.5">
                    <span className="text-[10px] uppercase font-bold text-gray-400">Player ID / Character ID:</span>
                    {item.serverId && <span className="text-[10px]">Zone: <strong className="text-gray-200">{item.serverId}</strong></span>}
                  </div>

                  <div className="mt-1">
                    <input
                      type="text"
                      id={`checkout-item-player-id-${idx}`}
                      value={item.playerId || ''}
                      onChange={(e) => {
                        updatePlayerId(item.id, e.target.value);
                        if (formErrors[`item_${idx}_playerId`]) {
                          setFormErrors((prev) => {
                            const copy = { ...prev };
                            delete copy[`item_${idx}_playerId`];
                            return copy;
                          });
                        }
                      }}
                      placeholder="Enter Player ID / UID *"
                      className={`w-full bg-[#0d0d0f] border ${
                        formErrors[`item_${idx}_playerId`]
                          ? 'border-red-500 ring-2 ring-red-500/50 bg-red-950/20'
                          : 'border-white/10'
                      } rounded-lg px-2.5 py-1.5 text-xs text-white font-mono placeholder-gray-500 focus:outline-none focus:border-cyan-400`}
                    />
                    {formErrors[`item_${idx}_playerId`] && (
                      <p className="text-[10px] text-red-400 mt-1 flex items-center gap-1 font-sans font-medium">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>Please enter your Player ID First</span>
                      </p>
                    )}
                    {formErrors[`item_${idx}_serverId`] && (
                      <p className="text-[10px] text-red-400 mt-1 flex items-center gap-1 font-sans">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{formErrors[`item_${idx}_serverId`]}</span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing details */}
            <div className="space-y-2 pt-3 border-t border-white/5 text-xs text-gray-400">
              <div className="flex justify-between">
                <span>Payment Method</span>
                <span className="text-white font-semibold">{paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="text-emerald-400 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-white/5">
                <span>Total Due:</span>
                <span className="text-cyan-400 font-display text-xl">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            {/* Submit Order Button */}
            <button
              type="submit"
              id="btn-submit-order"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider text-black bg-white hover:bg-cyan-400 shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span>Submitting Order...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Submit Order</span>
                </>
              )}
            </button>

            {/* Telegram Support Button */}
            <div className="pt-2 text-center text-[11px] text-gray-500 space-y-2">
              <div>
                Payment will be verified manually before delivery.
              </div>
              <div>
                Need help or have questions?{' '}
                <a
                  href="https://t.me/callmeriyadh"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 underline font-semibold inline-flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>Chat on Telegram</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
