import React, { useState, useEffect } from 'react';
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
  Smartphone
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import { SITE_CONFIG } from '../config/site';
import { PAYMENT_CONFIG, SupportedPaymentMethod } from '../config/payment';
import { formatPrice, isValidBDPhone } from '../utils/format';

export const CheckoutPage: React.FC = () => {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const { createOrder } = useOrder();
  const navigate = useNavigate();

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  // Customer Information
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');

  // Payment Selection: bKash, Nagad, Binance Pay, Bank Transfer
  const [paymentMethod, setPaymentMethod] = useState<SupportedPaymentMethod>('bKash');
  const [senderIdentifier, setSenderIdentifier] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Copy states
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};

    // 1. Customer Information
    if (!customerName.trim()) {
      errs.customerName = 'Please enter your full name.';
    }

    if (!phone.trim()) {
      errs.phone = 'Your contact mobile number is required.';
    } else if (!isValidBDPhone(phone)) {
      errs.phone = 'Please enter a valid 11-digit Bangladeshi phone number (01XXXXXXXXX).';
    }

    // 2. Validate Cart Items: Player ID & Server/Zone ID & Quantity
    if (cart.length === 0) {
      errs.general = 'Your cart is empty. Please select a package.';
    }

    cart.forEach((item, index) => {
      if (!item.playerId || !item.playerId.trim()) {
        errs[`item_${index}_playerId`] = `${item.gameName} requires a valid Player ID / UID.`;
      }
      // MLBB or games requiring Server/Zone ID
      if (item.gameId === 'mobile-legends' && (!item.serverId || !item.serverId.trim())) {
        errs[`item_${index}_serverId`] = `${item.gameName} requires a Zone ID / Server ID.`;
      }
      if (!item.quantity || item.quantity < 1) {
        errs[`item_${index}_quantity`] = 'Quantity must be at least 1.';
      }
    });

    // 3. Validate Total Amount
    if (total <= 0) {
      errs.general = 'Total amount is invalid. Please select valid game packages.';
    }

    // 4. Validate Payment Details based on selected payment method
    if (!paymentMethod) {
      errs.paymentMethod = 'Please select a payment method.';
    }

    if (!senderIdentifier.trim()) {
      if (paymentMethod === 'bKash') {
        errs.senderIdentifier = 'Please enter the bKash sender number you transferred from.';
      } else if (paymentMethod === 'Nagad') {
        errs.senderIdentifier = 'Please enter the Nagad sender number you transferred from.';
      } else if (paymentMethod === 'Binance Pay') {
        errs.senderIdentifier = 'Please enter your Binance Pay ID, UID, or sender email.';
      } else if (paymentMethod === 'Bank Transfer') {
        errs.senderIdentifier = 'Please enter your sender Bank Account Name or Number.';
      }
    } else if ((paymentMethod === 'bKash' || paymentMethod === 'Nagad') && !isValidBDPhone(senderIdentifier)) {
      errs.senderIdentifier = 'Please enter a valid 11-digit Bangladeshi mobile number (01XXXXXXXXX).';
    }

    if (!transactionId.trim()) {
      errs.transactionId = `Transaction / Reference ID is required after making payment.`;
    } else if (transactionId.trim().length < 4) {
      errs.transactionId = 'Transaction ID is too short. Please copy the complete TrxID from your receipt.';
    }

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
      // Determine what number/address the payment was sent to
      let paymentNumberSentTo = PAYMENT_CONFIG.BKASH_NUMBER;
      if (paymentMethod === 'Nagad') {
        paymentNumberSentTo = PAYMENT_CONFIG.NAGAD_NUMBER;
      } else if (paymentMethod === 'Binance Pay') {
        paymentNumberSentTo = PAYMENT_CONFIG.BINANCE_PAY_ID_OR_ADDRESS;
      } else if (paymentMethod === 'Bank Transfer') {
        paymentNumberSentTo = `${PAYMENT_CONFIG.BANK_NAME} - A/C: ${PAYMENT_CONFIG.BANK_ACCOUNT_NUMBER}`;
      }

      const result = await createOrder({
        customerName,
        phone,
        email: email || undefined,
        items: cart,
        totalAmount: total,
        paymentMethod,
        paymentNumberSentTo,
        senderPhone: senderIdentifier.trim(),
        transactionId: transactionId.trim().toUpperCase()
      });

      if (result.success && result.order) {
        // Do not clear the cart until the order has been successfully submitted
        clearCart();
        // Navigate to confirmation page with created order
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
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
                  Contact Mobile Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  id="checkout-phone"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (formErrors.phone) setFormErrors({ ...formErrors, phone: '' });
                  }}
                  placeholder="01XXXXXXXXX"
                  className={`w-full bg-[#050505] border ${
                    formErrors.phone ? 'border-red-500 ring-1 ring-red-500' : 'border-white/10'
                  } rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400 font-mono`}
                />
                {formErrors.phone && (
                  <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{formErrors.phone}</span>
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
                  Choose between Mobile Wallets, Binance Pay, or Bank Transfer.
                </p>
              </div>
            </div>

            {/* Payment Options Grid: bKash, Nagad, Binance Pay, Bank Transfer */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* bKash */}
              <button
                type="button"
                id="btn-select-bkash"
                onClick={() => {
                  setPaymentMethod('bKash');
                  setFormErrors((prev) => ({ ...prev, senderIdentifier: '', transactionId: '' }));
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
                  setFormErrors((prev) => ({ ...prev, senderIdentifier: '', transactionId: '' }));
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

              {/* Binance Pay */}
              <button
                type="button"
                id="btn-select-binance"
                onClick={() => {
                  setPaymentMethod('Binance Pay');
                  setFormErrors((prev) => ({ ...prev, senderIdentifier: '', transactionId: '' }));
                }}
                className={`p-4 rounded-2xl border text-left transition-all relative ${
                  paymentMethod === 'Binance Pay'
                    ? 'bg-yellow-950/25 border-yellow-500 ring-1 ring-yellow-500/40 text-white shadow-lg'
                    : 'bg-[#050505] border-white/10 text-gray-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  {paymentMethod === 'Binance Pay' && (
                    <Check className="w-4 h-4 text-yellow-400 stroke-[3]" />
                  )}
                </div>
                <div className="font-bold text-white text-sm">Binance Pay</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Pay ID / USDT</div>
              </button>

              {/* Bank Transfer */}
              <button
                type="button"
                id="btn-select-bank"
                onClick={() => {
                  setPaymentMethod('Bank Transfer');
                  setFormErrors((prev) => ({ ...prev, senderIdentifier: '', transactionId: '' }));
                }}
                className={`p-4 rounded-2xl border text-left transition-all relative ${
                  paymentMethod === 'Bank Transfer'
                    ? 'bg-emerald-950/25 border-emerald-500 ring-1 ring-emerald-500/40 text-white shadow-lg'
                    : 'bg-[#050505] border-white/10 text-gray-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  {paymentMethod === 'Bank Transfer' && (
                    <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                  )}
                </div>
                <div className="font-bold text-white text-sm">Bank Transfer</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Direct Banking</div>
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
                          NEXORA Official bKash Number ({PAYMENT_CONFIG.BKASH_TYPE})
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
                          NEXORA Official Nagad Number ({PAYMENT_CONFIG.NAGAD_TYPE})
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
                      NEXORA Official Bank Account Details
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

            {/* SENDER INPUTS (Customized to match selected payment method) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  {paymentMethod === 'bKash' && 'Sender bKash Number (Paid From)'}
                  {paymentMethod === 'Nagad' && 'Sender Nagad Number (Paid From)'}
                  {paymentMethod === 'Binance Pay' && 'Sender Binance Pay ID / Email / Nickname'}
                  {paymentMethod === 'Bank Transfer' && 'Sender Bank Account Name / Number'}
                  <span className="text-red-400"> *</span>
                </label>
                <input
                  type="text"
                  id="checkout-sender-identifier"
                  value={senderIdentifier}
                  onChange={(e) => {
                    setSenderIdentifier(e.target.value);
                    if (formErrors.senderIdentifier) setFormErrors({ ...formErrors, senderIdentifier: '' });
                  }}
                  placeholder={
                    paymentMethod === 'bKash'
                      ? 'e.g. 017XXXXXXXX'
                      : paymentMethod === 'Nagad'
                      ? 'e.g. 018XXXXXXXX'
                      : paymentMethod === 'Binance Pay'
                      ? 'Binance ID or Email'
                      : 'Account Name or Number'
                  }
                  className={`w-full bg-[#050505] border ${
                    formErrors.senderIdentifier ? 'border-red-500 ring-1 ring-red-500' : 'border-white/10'
                  } rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400 font-mono`}
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  {paymentMethod === 'bKash' || paymentMethod === 'Nagad'
                    ? 'The mobile number you used to send money'
                    : 'The account you sent the payment from'}
                </p>
                {formErrors.senderIdentifier && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{formErrors.senderIdentifier}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  {paymentMethod === 'Bank Transfer' ? 'Bank Reference / Journal / Trx ID' : 'Transaction ID (TrxID)'}
                  <span className="text-red-400"> *</span>
                </label>
                <input
                  type="text"
                  id="checkout-trx-id"
                  value={transactionId}
                  onChange={(e) => {
                    setTransactionId(e.target.value.toUpperCase());
                    if (formErrors.transactionId) setFormErrors({ ...formErrors, transactionId: '' });
                  }}
                  placeholder="e.g. 9K4M8X2A10"
                  className={`w-full bg-[#050505] border ${
                    formErrors.transactionId ? 'border-red-500 ring-1 ring-red-500' : 'border-white/10'
                  } rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400 font-mono uppercase`}
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Enter your Transaction ID after payment (from confirmation SMS)
                </p>
                {formErrors.transactionId && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{formErrors.transactionId}</span>
                  </p>
                )}
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
                      <p className="text-cyan-400 font-medium">{item.quantity}x {item.packageName}</p>
                    </div>
                    <div className="font-black text-white shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>

                  <div className="text-[11px] text-gray-400 font-mono flex items-center justify-between border-t border-white/5 pt-1">
                    <span>UID: <strong className="text-gray-200">{item.playerId || 'Missing'}</strong></span>
                    {item.serverId && <span>Zone: <strong className="text-gray-200">{item.serverId}</strong></span>}
                  </div>

                  {formErrors[`item_${idx}_playerId`] && (
                    <p className="text-[10px] text-red-400">
                      {formErrors[`item_${idx}_playerId`]}
                    </p>
                  )}
                  {formErrors[`item_${idx}_serverId`] && (
                    <p className="text-[10px] text-red-400">
                      {formErrors[`item_${idx}_serverId`]}
                    </p>
                  )}
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
