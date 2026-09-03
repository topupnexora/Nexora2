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
  ChevronLeft
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import { SITE_CONFIG } from '../config/site';
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

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad'>('bKash');
  const [senderPhone, setSenderPhone] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // States
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const activePaymentConfig = paymentMethod === 'bKash' 
    ? SITE_CONFIG.paymentNumbers.bKash 
    : SITE_CONFIG.paymentNumbers.nagad;

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(activePaymentConfig.rawNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};

    if (!customerName.trim()) {
      errs.customerName = 'Your name is required';
    }

    if (!phone.trim()) {
      errs.phone = 'Your mobile number is required';
    } else if (!isValidBDPhone(phone)) {
      errs.phone = 'Please enter a valid 11-digit Bangladeshi mobile number (01XXXXXXXXX)';
    }

    if (!senderPhone.trim()) {
      errs.senderPhone = `Please enter the ${paymentMethod} number you sent money from`;
    } else if (!isValidBDPhone(senderPhone)) {
      errs.senderPhone = 'Please enter a valid 11-digit number';
    }

    if (!transactionId.trim()) {
      errs.transactionId = `Transaction ID (TrxID) is required after completing the transfer`;
    } else if (transactionId.trim().length < 6) {
      errs.transactionId = 'Transaction ID looks too short. Please verify from your SMS/app';
    }

    if (!agreeTerms) {
      errs.agreeTerms = 'You must acknowledge the manual verification terms';
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const result = await createOrder({
        customerName,
        phone,
        email: email || undefined,
        items: cart,
        totalAmount: total,
        paymentMethod,
        paymentNumberSentTo: activePaymentConfig.number,
        senderPhone,
        transactionId: transactionId.trim().toUpperCase()
      });

      if (result.success && result.order) {
        // Clear user cart
        clearCart();
        // Route to order confirmation page
        navigate(`/order-confirmation/${result.order.orderId}`);
      } else {
        setFormErrors({ general: result.error || 'Failed to submit order. Please try again.' });
      }
    } catch (err: any) {
      setFormErrors({ general: err.message || 'An unexpected error occurred.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Breadcrumbs */}
      <div>
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-cyan-400 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Return to Shopping Cart</span>
        </Link>
      </div>

      <div className="border-b border-white/5 pb-4">
        <h1 className="text-3xl font-black uppercase tracking-tight text-white font-display">
          Checkout & Manual Payment
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Complete your order using Bangladesh's trusted bKash or Nagad mobile wallets.
        </p>
      </div>

      {formErrors.general && (
        <div className="p-4 bg-red-950/40 border border-red-500/40 rounded-2xl text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{formErrors.general}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Customer Details and Payment Flow */}
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
                  Used for order notifications and customer support verification.
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
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Shakib Al Hasan"
                  className={`w-full bg-[#050505] border ${
                    formErrors.customerName ? 'border-red-500 ring-1 ring-red-500' : 'border-white/10'
                  } rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400`}
                />
                {formErrors.customerName && (
                  <p className="text-xs text-red-400 mt-1">{formErrors.customerName}</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Mobile Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  id="checkout-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className={`w-full bg-[#050505] border ${
                    formErrors.phone ? 'border-red-500 ring-1 ring-red-500' : 'border-white/10'
                  } rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400 font-mono`}
                />
                {formErrors.phone && (
                  <p className="text-xs text-red-400 mt-1">{formErrors.phone}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Email Address <span className="text-gray-500 font-normal lowercase">(optional for invoice receipt)</span>
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

          {/* STEP 2: MANUAL PAYMENT INSTRUCTIONS & TRANSACTION ID */}
          <div className="bg-[#0d0d0f] border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-md space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-cyan-400 font-black text-sm flex items-center justify-center font-display">
                2
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight text-gray-100">
                  Payment Method & Instructions
                </h3>
                <p className="text-xs text-gray-400">
                  Select your wallet and follow the exact 6-step manual transfer flow.
                </p>
              </div>
            </div>

            {/* Wallet Selection Buttons */}
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                Select Wallet:
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  id="btn-select-bkash"
                  onClick={() => setPaymentMethod('bKash')}
                  className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                    paymentMethod === 'bKash'
                      ? 'bg-pink-950/20 border-pink-500 ring-1 ring-pink-500/40 text-white'
                      : 'bg-[#050505] border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-pink-500 shrink-0" />
                    <div className="text-left">
                      <p className="text-sm font-bold text-white">bKash</p>
                      <p className="text-[11px] text-gray-400">Personal Send Money</p>
                    </div>
                  </div>
                  {paymentMethod === 'bKash' && (
                    <Check className="w-4 h-4 text-pink-400 stroke-[3]" />
                  )}
                </button>

                <button
                  type="button"
                  id="btn-select-nagad"
                  onClick={() => setPaymentMethod('Nagad')}
                  className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                    paymentMethod === 'Nagad'
                      ? 'bg-orange-950/20 border-orange-500 ring-1 ring-orange-500/40 text-white'
                      : 'bg-[#050505] border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-orange-500 shrink-0" />
                    <div className="text-left">
                      <p className="text-sm font-bold text-white">Nagad</p>
                      <p className="text-[11px] text-gray-400">Personal Send Money</p>
                    </div>
                  </div>
                  {paymentMethod === 'Nagad' && (
                    <Check className="w-4 h-4 text-orange-400 stroke-[3]" />
                  )}
                </button>
              </div>
            </div>

            {/* Central Payment Number Box */}
            <div className="bg-[#050505] border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">
                    NEXORA Official {paymentMethod} Recipient Number:
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-cyan-400 font-mono mt-0.5">
                    {activePaymentConfig.number}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyNumber}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-wider text-gray-200 transition-colors self-start sm:self-auto"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Number</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-amber-400/90 pt-1">
                <Info className="w-4 h-4 shrink-0 text-amber-400" />
                <span>
                  Please use <strong>"Send Money"</strong> (Personal). Exact transfer amount: <strong className="text-white">{formatPrice(total)}</strong>.
                </span>
              </div>
            </div>

            {/* Clarification Notice as strictly required */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-gray-300 space-y-2">
              <h4 className="font-bold flex items-center gap-1.5 text-cyan-400 uppercase tracking-wider text-[11px]">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                How Manual Verification Works (Honest & Transparent)
              </h4>
              <ol className="list-decimal pl-4 space-y-1 text-gray-400">
                <li>Select payment method (bKash or Nagad) above.</li>
                <li>Send the exact amount ({formatPrice(total)}) to the configured merchant number.</li>
                <li>Copy the Transaction ID (TrxID) provided in your bKash/Nagad app or SMS.</li>
                <li>Submit your order with your TrxID.</li>
                <li>Order status automatically becomes <strong>Pending</strong>.</li>
                <li>Our admin team manually matches the TrxID and delivers your credits within 1-5 minutes.</li>
              </ol>
            </div>

            {/* Input TrxID and Sender Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Sender {paymentMethod} Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  id="checkout-sender-phone"
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  placeholder="Number you sent from"
                  className={`w-full bg-[#050505] border ${
                    formErrors.senderPhone ? 'border-red-500 ring-1 ring-red-500' : 'border-white/10'
                  } rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400 font-mono`}
                />
                {formErrors.senderPhone && (
                  <p className="text-xs text-red-400 mt-1">{formErrors.senderPhone}</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Transaction ID (TrxID) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="checkout-trx-id"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                  placeholder="e.g. 9K4M8X2A10"
                  className={`w-full bg-[#050505] border ${
                    formErrors.transactionId ? 'border-red-500 ring-1 ring-red-500' : 'border-white/10'
                  } rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400 font-mono uppercase`}
                />
                {formErrors.transactionId && (
                  <p className="text-xs text-red-400 mt-1">{formErrors.transactionId}</p>
                )}
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  id="checkbox-agree-terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 rounded bg-[#050505] border-white/20 text-cyan-400 focus:ring-cyan-400"
                />
                <span className="text-xs text-gray-400 leading-relaxed">
                  I understand this is a manual verification process. I have double-checked my Player ID and sent the exact amount ({formatPrice(total)}) via {paymentMethod}.
                </span>
              </label>
              {formErrors.agreeTerms && (
                <p className="text-xs text-red-400 mt-1">{formErrors.agreeTerms}</p>
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
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-xs bg-[#050505] p-3 rounded-xl border border-white/5"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="font-bold text-white uppercase tracking-tight truncate">{item.gameName}</p>
                    <p className="text-cyan-400 font-medium">{item.quantity}x {item.packageName}</p>
                    <p className="text-gray-500 text-[10px] truncate font-mono">
                      UID: {item.playerId} {item.serverId ? `(${item.serverId})` : ''}
                    </p>
                  </div>
                  <div className="font-black text-white shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing details */}
            <div className="space-y-2 pt-3 border-t border-white/5 text-xs text-gray-400">
              <div className="flex justify-between">
                <span>Selected Method</span>
                <span className="text-white font-semibold">{paymentMethod} (Send Money)</span>
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

            {/* Place order button */}
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

            <div className="pt-2 text-center text-[11px] text-gray-500">
              Need help with your bKash or Nagad payment?{' '}
              <a
                href={SITE_CONFIG.support.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 underline font-medium"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
