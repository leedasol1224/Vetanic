import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { OrderItemRow } from '../components/order/OrderItemRow';
import { OrderSuccessView } from '../components/order/OrderSuccessView';
import { DeliveryProgressBar } from '../components/order/DeliveryProgressBar';
import { 
  ContactMethod, 
  CustomerType, 
  PaymentMethod, 
  ReferralSource, 
  OrderSubmission 
} from '../types/order';
import { 
  ShoppingBag, 
  Plus, 
  User, 
  Truck, 
  CreditCard, 
  ShieldCheck, 
  Info, 
  AlertCircle, 
  Send, 
  Sparkles,
  ArrowRight,
  Tag
} from 'lucide-react';
import { getProductPricing } from '../lib/pricing';

export const OrderPage: React.FC = () => {
  const { 
    items, 
    updateQuantity, 
    removeFromOrder, 
    deliveryMethod,
    setDeliveryMethod,
    pricingSummary,
    submitOrder, 
    lastSubmittedOrder, 
    setLastSubmittedOrder 
  } = useOrder();

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [telegramHandle, setTelegramHandle] = useState('');
  const [instagramAccount, setInstagramAccount] = useState('');
  const [preferredContact, setPreferredContact] = useState<ContactMethod>('WhatsApp');
  const [customerType, setCustomerType] = useState<CustomerType>('new');

  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const [paymentPreference, setPaymentPreference] = useState<PaymentMethod>('paynow');

  // Acknowledgements
  const [ackStock, setAckStock] = useState(false);
  const [ackAllergy, setAckAllergy] = useState(false);
  const [ackWellness, setAckWellness] = useState(false);

  // Marketing Source
  const [referralSource, setReferralSource] = useState<ReferralSource>('Instagram');
  const [otherReferral, setOtherReferral] = useState('');

  // Submission Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If order was just submitted, show success view
  if (lastSubmittedOrder) {
    return (
      <main className="flex-1 bg-[#FAF8F5]">
        <OrderSuccessView
          order={lastSubmittedOrder}
          onReset={() => setLastSubmittedOrder(null)}
        />
      </main>
    );
  }

  // If no items in order
  if (items.length === 0) {
    return (
      <main className="flex-1 bg-[#FAF8F5] py-16 px-4">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-8 sm:p-10 border border-brand-100 shadow-soft text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-700 mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-2xl font-serif font-bold text-charcoal">
              Your Order is Empty
            </h1>
            <p className="text-sm text-charcoal-muted mt-2">
              Browse our Korean pet wellness catalogue and choose products for your dog or cat.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 w-full bg-brand-800 hover:bg-brand-900 text-white font-bold py-3.5 px-6 rounded-2xl shadow-sm transition-all"
          >
            <span>Explore Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!contactNumber.trim()) {
      setErrorMessage('Please enter your contact number.');
      return;
    }

    if (deliveryMethod !== 'self_collection') {
      if (!deliveryAddress.trim()) {
        setErrorMessage('Please provide your delivery address including unit number.');
        return;
      }
      if (!postalCode.trim()) {
        setErrorMessage('Please provide your Singapore postal code.');
        return;
      }
    }

    if (!ackStock || !ackAllergy || !ackWellness) {
      setErrorMessage('Please check all three acknowledgements before submitting.');
      return;
    }

    if (referralSource === 'Other' && !otherReferral.trim()) {
      setErrorMessage('Please specify how you heard about us.');
      return;
    }

    const submissionPayload: OrderSubmission = {
      customer: {
        fullName: fullName.trim(),
        email: email.trim(),
        contactNumber: contactNumber.trim(),
        telegramHandle: telegramHandle.trim() || undefined,
        instagramAccount: instagramAccount.trim() || undefined,
        preferredContact,
        customerType
      },
      delivery: {
        deliveryMethod,
        deliveryAddress: deliveryMethod !== 'self_collection' ? deliveryAddress.trim() : undefined,
        postalCode: deliveryMethod !== 'self_collection' ? postalCode.trim() : undefined
      },
      paymentPreference,
      acknowledgements: {
        stockAvailabilityConfirmed: ackStock,
        petAllergyChecked: ackAllergy,
        wellnessSupplementAcknowledged: ackWellness
      },
      referralSource,
      otherReferralSource: referralSource === 'Other' ? otherReferral.trim() : undefined,
      items: items.map((item) => {
        const pricing = getProductPricing(item.product);
        return {
          productId: item.product.id,
          productName: item.product.name,
          packageSize: item.product.packageSize,
          quantity: item.quantity,
          unitPrice: pricing.activePrice
        };
      })
    };

    try {
      setIsSubmitting(true);
      await submitOrder(submissionPayload);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Order submission error:', err);
      setErrorMessage('Failed to submit order request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="flex-1 bg-[#FAF8F5] py-10 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100/80 text-brand-900 text-xs font-bold uppercase tracking-wider mb-2 border border-brand-200">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Singapore Direct Order Request</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal tracking-tight">
            Order Request
          </h1>

          <p className="text-xs sm:text-sm text-charcoal-muted mt-2 max-w-xl mx-auto">
            Submit your product request. Our team will verify stock and contact you directly with final order amount and payment details.
          </p>
        </div>

        {/* Free Delivery & Mix-and-match progress banner */}
        <div className="mb-8">
          <DeliveryProgressBar />
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* STEP 1: Selected Products */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-100 shadow-card">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-brand-800 text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h2 className="text-lg font-bold text-charcoal">
                  Your Products
                </h2>
              </div>

              <Link
                to="/products"
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-800 hover:text-brand-950 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add More Products</span>
              </Link>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <OrderItemRow
                  key={item.product.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromOrder}
                />
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs font-medium text-charcoal-muted">
              <div>
                Total Selected: <strong className="text-charcoal font-bold">{totalQuantity} {totalQuantity === 1 ? 'unit' : 'units'}</strong>
              </div>
              {pricingSummary.savingsAmount > 0 && (
                <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
                  <Tag className="w-3.5 h-3.5 text-amber-700" />
                  <span>You save SGD {pricingSummary.savingsAmount.toFixed(2)} with launch offers!</span>
                </div>
              )}
            </div>
          </section>

          {/* STEP 2: Customer Details */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-100 shadow-card">
            <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-gray-100">
              <span className="w-7 h-7 rounded-lg bg-brand-800 text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-brand-700" />
                <h2 className="text-lg font-bold text-charcoal">
                  Customer Details
                </h2>
              </div>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rachel Tan"
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-[#FAF8F5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. rachel@example.com"
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-[#FAF8F5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                    Contact Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="e.g. +65 9123 4567"
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-[#FAF8F5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                    Telegram Handle <span className="text-xs text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={telegramHandle}
                    onChange={(e) => setTelegramHandle(e.target.value)}
                    placeholder="e.g. @racheltan"
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-[#FAF8F5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                    Instagram Account <span className="text-xs text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={instagramAccount}
                    onChange={(e) => setInstagramAccount(e.target.value)}
                    placeholder="e.g. @rachel_pets"
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-[#FAF8F5]"
                  />
                </div>
              </div>

              {/* Preferred Contact Method */}
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-2">
                  Preferred Contact Method <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(['WhatsApp', 'Telegram', 'Instagram DM', 'SMS'] as ContactMethod[]).map((method) => (
                    <label
                      key={method}
                      className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                        preferredContact === method
                          ? 'border-brand-700 bg-brand-50 text-brand-900 ring-1 ring-brand-700'
                          : 'border-gray-200 hover:bg-gray-50 text-charcoal'
                      }`}
                    >
                      <input
                        type="radio"
                        name="preferredContact"
                        value={method}
                        checked={preferredContact === method}
                        onChange={() => setPreferredContact(method)}
                        className="text-brand-800 focus:ring-brand-500"
                      />
                      <span>{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Customer Status */}
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-2">
                  Customer Status <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <label
                    className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                      customerType === 'new'
                        ? 'border-brand-700 bg-brand-50 text-brand-900 ring-1 ring-brand-700'
                        : 'border-gray-200 hover:bg-gray-50 text-charcoal'
                    }`}
                  >
                    <input
                      type="radio"
                      name="customerType"
                      value="new"
                      checked={customerType === 'new'}
                      onChange={() => setCustomerType('new')}
                      className="text-brand-800 focus:ring-brand-500"
                    />
                    <span>I am a new customer</span>
                  </label>

                  <label
                    className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                      customerType === 'existing'
                        ? 'border-brand-700 bg-brand-50 text-brand-900 ring-1 ring-brand-700'
                        : 'border-gray-200 hover:bg-gray-50 text-charcoal'
                    }`}
                  >
                    <input
                      type="radio"
                      name="customerType"
                      value="existing"
                      checked={customerType === 'existing'}
                      onChange={() => setCustomerType('existing')}
                      className="text-brand-800 focus:ring-brand-500"
                    />
                    <span>I am an existing customer</span>
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* STEP 3: Delivery Details */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-100 shadow-card">
            <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-gray-100">
              <span className="w-7 h-7 rounded-lg bg-brand-800 text-white text-xs font-bold flex items-center justify-center">
                3
              </span>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-brand-700" />
                <h2 className="text-lg font-bold text-charcoal">
                  Delivery Method
                </h2>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">
                How would you like to receive your order? <span className="text-rose-500">*</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label
                  className={`flex flex-col justify-between p-4 rounded-2xl border text-xs cursor-pointer transition-all ${
                    deliveryMethod === 'standard'
                      ? 'border-brand-700 bg-brand-50/80 text-brand-950 ring-1 ring-brand-700'
                      : 'border-gray-200 hover:bg-gray-50 text-charcoal'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="standard"
                      checked={deliveryMethod === 'standard'}
                      onChange={() => setDeliveryMethod('standard')}
                      className="text-brand-800 focus:ring-brand-500"
                    />
                    <span className="font-bold">Standard Local Delivery</span>
                  </div>
                  <span className="text-[11px] text-charcoal-muted ml-5">
                    {pricingSummary.isFreeDeliveryUnlocked ? (
                      <strong className="text-brand-700 font-bold">FREE (Orders ≥ SGD 50)</strong>
                    ) : (
                      'SGD 4.50 (Free over SGD 50)'
                    )}
                  </span>
                </label>

                <label
                  className={`flex flex-col justify-between p-4 rounded-2xl border text-xs cursor-pointer transition-all ${
                    deliveryMethod === 'self_collection'
                      ? 'border-brand-700 bg-brand-50/80 text-brand-950 ring-1 ring-brand-700'
                      : 'border-gray-200 hover:bg-gray-50 text-charcoal'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="self_collection"
                      checked={deliveryMethod === 'self_collection'}
                      onChange={() => setDeliveryMethod('self_collection')}
                      className="text-brand-800 focus:ring-brand-500"
                    />
                    <span className="font-bold">Self-collection</span>
                  </div>
                  <span className="text-[11px] text-charcoal-muted ml-5">
                    @ Novena MRT (FREE)
                  </span>
                </label>

                <label
                  className={`flex flex-col justify-between p-4 rounded-2xl border text-xs cursor-pointer transition-all ${
                    deliveryMethod === 'same_day'
                      ? 'border-brand-700 bg-brand-50/80 text-brand-950 ring-1 ring-brand-700'
                      : 'border-gray-200 hover:bg-gray-50 text-charcoal'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="same_day"
                      checked={deliveryMethod === 'same_day'}
                      onChange={() => setDeliveryMethod('same_day')}
                      className="text-brand-800 focus:ring-brand-500"
                    />
                    <span className="font-bold">Same-day Delivery</span>
                  </div>
                  <span className="text-[11px] text-charcoal-muted ml-5">
                    Express dispatch (+SGD 15.00)
                  </span>
                </label>
              </div>

              {/* Conditional Address Fields */}
              {deliveryMethod !== 'self_collection' ? (
                <div className="pt-4 space-y-4 animate-soft-in">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                        Delivery Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="Please include your block, street & unit number (e.g. #08-12)"
                        className="w-full text-sm px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-[#FAF8F5]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                        Postal Code <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="e.g. 307683"
                        className="w-full text-sm px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-[#FAF8F5]"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-brand-50 rounded-2xl border border-brand-200/80 text-xs text-brand-900 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-brand-700 flex-shrink-0 mt-0.5" />
                  <span>
                    Self-collection point: <strong>Novena MRT Station</strong>. Our team will coordinate the exact meetup schedule with you after stock confirmation.
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* STEP 4: Payment Preference */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-100 shadow-card">
            <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-gray-100">
              <span className="w-7 h-7 rounded-lg bg-brand-800 text-white text-xs font-bold flex items-center justify-center">
                4
              </span>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-brand-700" />
                <h2 className="text-lg font-bold text-charcoal">
                  Payment Preference
                </h2>
              </div>
            </div>

            {/* Prominent PRD Notice */}
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 mb-5 text-amber-950 space-y-1">
              <div className="flex items-center gap-2 font-bold text-xs text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                <span>Please do not make payment yet.</span>
              </div>
              <p className="text-xs text-amber-900/90 leading-relaxed">
                We will confirm product availability, your final total and delivery arrangements before sending official payment instructions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`flex items-center gap-3 p-4 rounded-2xl border text-xs font-semibold cursor-pointer transition-all ${
                  paymentPreference === 'paynow'
                    ? 'border-brand-700 bg-brand-50 text-brand-900 ring-1 ring-brand-700'
                    : 'border-gray-200 hover:bg-gray-50 text-charcoal'
                }`}
              >
                <input
                  type="radio"
                  name="paymentPreference"
                  value="paynow"
                  checked={paymentPreference === 'paynow'}
                  onChange={() => setPaymentPreference('paynow')}
                  className="text-brand-800 focus:ring-brand-500"
                />
                <div>
                  <div className="font-bold text-sm">PayNow (UEN / Mobile)</div>
                  <div className="text-[11px] text-charcoal-muted font-normal">
                    Instant SG bank QR or UEN transfer
                  </div>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 p-4 rounded-2xl border text-xs font-semibold cursor-pointer transition-all ${
                  paymentPreference === 'bank_transfer'
                    ? 'border-brand-700 bg-brand-50 text-brand-900 ring-1 ring-brand-700'
                    : 'border-gray-200 hover:bg-gray-50 text-charcoal'
                }`}
              >
                <input
                  type="radio"
                  name="paymentPreference"
                  value="bank_transfer"
                  checked={paymentPreference === 'bank_transfer'}
                  onChange={() => setPaymentPreference('bank_transfer')}
                  className="text-brand-800 focus:ring-brand-500"
                />
                <div>
                  <div className="font-bold text-sm">Bank Transfer</div>
                  <div className="text-[11px] text-charcoal-muted font-normal">
                    Direct local bank account transfer
                  </div>
                </div>
              </label>
            </div>
          </section>

          {/* STEP 5: Important Acknowledgements */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-100 shadow-card">
            <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-gray-100">
              <span className="w-7 h-7 rounded-lg bg-brand-800 text-white text-xs font-bold flex items-center justify-center">
                5
              </span>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-700" />
                <h2 className="text-lg font-bold text-charcoal">
                  Important Acknowledgements
                </h2>
              </div>
            </div>

            <p className="text-xs text-charcoal-muted mb-4">
              Please confirm all 3 statements below to proceed with your order request:
            </p>

            <div className="space-y-3.5">
              <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FAF8F5] border border-gray-200/80 cursor-pointer hover:border-brand-300 transition-colors">
                <input
                  type="checkbox"
                  required
                  checked={ackStock}
                  onChange={(e) => setAckStock(e.target.checked)}
                  className="mt-0.5 rounded text-brand-800 focus:ring-brand-500 w-4 h-4"
                />
                <span className="text-xs text-charcoal leading-relaxed">
                  I understand that my order is subject to stock availability and will only be confirmed after I receive a confirmation message.
                </span>
              </label>

              <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FAF8F5] border border-gray-200/80 cursor-pointer hover:border-brand-300 transition-colors">
                <input
                  type="checkbox"
                  required
                  checked={ackAllergy}
                  onChange={(e) => setAckAllergy(e.target.checked)}
                  className="mt-0.5 rounded text-brand-800 focus:ring-brand-500 w-4 h-4"
                />
                <span className="text-xs text-charcoal leading-relaxed">
                  I have checked the product information and will inform the seller of any known allergies or sensitivities my pet may have.
                </span>
              </label>

              <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FAF8F5] border border-gray-200/80 cursor-pointer hover:border-brand-300 transition-colors">
                <input
                  type="checkbox"
                  required
                  checked={ackWellness}
                  onChange={(e) => setAckWellness(e.target.checked)}
                  className="mt-0.5 rounded text-brand-800 focus:ring-brand-500 w-4 h-4"
                />
                <span className="text-xs text-charcoal leading-relaxed">
                  I understand that pet supplements are intended to support general wellness and are not a substitute for veterinary diagnosis or treatment.
                </span>
              </label>
            </div>
          </section>

          {/* STEP 6: Referral Source */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-100 shadow-card">
            <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-gray-100">
              <span className="w-7 h-7 rounded-lg bg-brand-800 text-white text-xs font-bold flex items-center justify-center">
                6
              </span>
              <h2 className="text-lg font-bold text-charcoal">
                How did you hear about us?
              </h2>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {(['Singapore Pet Festival', 'Instagram', 'Friend / Referral', 'Other'] as ReferralSource[]).map((src) => (
                  <label
                    key={src}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                      referralSource === src
                        ? 'border-brand-700 bg-brand-50 text-brand-900 ring-1 ring-brand-700'
                        : 'border-gray-200 hover:bg-gray-50 text-charcoal'
                    }`}
                  >
                    <input
                      type="radio"
                      name="referralSource"
                      value={src}
                      checked={referralSource === src}
                      onChange={() => setReferralSource(src)}
                      className="text-brand-800 focus:ring-brand-500"
                    />
                    <span>{src}</span>
                  </label>
                ))}
              </div>

              {referralSource === 'Other' && (
                <div className="pt-2 animate-soft-in">
                  <input
                    type="text"
                    required
                    value={otherReferral}
                    onChange={(e) => setOtherReferral(e.target.value)}
                    placeholder="Please specify (e.g. Vet clinic, Search engine, etc.)"
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-[#FAF8F5]"
                  />
                </div>
              )}
            </div>
          </section>

          {/* Error display */}
          {errorMessage && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-xs font-bold text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* FINAL ORDER SUMMARY & SUBMIT */}
          <div className="bg-brand-900 text-white rounded-3xl p-6 sm:p-8 shadow-soft-lg space-y-6">
            <div>
              <span className="text-xs font-bold text-brand-300 uppercase tracking-widest block mb-1">
                Order Review
              </span>
              <h3 className="text-xl font-serif font-bold text-white">
                Submit Your Request
              </h3>
            </div>

            {/* Financial Breakdown */}
            <div className="space-y-2.5 border-y border-brand-800 py-4 text-xs text-brand-100">
              <div className="flex justify-between items-center">
                <span>Product Subtotal ({totalQuantity} items):</span>
                <span className="font-semibold text-white">
                  SGD {pricingSummary.productSubtotal.toFixed(2)}
                </span>
              </div>

              {pricingSummary.bundleDiscount > 0 && (
                <div className="flex justify-between items-center text-amber-300 font-medium">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-amber-400" />
                    <span>Mix & Match Discount:</span>
                  </span>
                  <span className="font-bold">
                    - SGD {pricingSummary.bundleDiscount.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center pt-1 border-t border-brand-800/60">
                <span className="font-semibold text-white">Product Total:</span>
                <span className="font-bold text-white">
                  SGD {pricingSummary.productTotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span>Delivery ({deliveryMethod === 'self_collection' ? 'Self-collection' : deliveryMethod === 'same_day' ? 'Same-day' : 'Standard Delivery'}):</span>
                <span className="font-semibold text-white">
                  {pricingSummary.deliveryFee === 0 ? (
                    <span className="text-amber-300 font-bold">FREE</span>
                  ) : (
                    `SGD ${pricingSummary.deliveryFee.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-brand-700 text-sm">
                <span className="font-bold text-white">Estimated Total:</span>
                <span className="font-serif font-bold text-xl text-amber-300">
                  SGD {pricingSummary.estimatedTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 text-brand-950 font-black text-sm tracking-wide uppercase transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Submitting Request...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Order Request</span>
                </>
              )}
            </button>

            <div className="text-[11px] text-center text-brand-300 leading-relaxed space-y-1">
              <p>
                * Payment is not collected at this step. We will confirm product availability, your final total and delivery arrangements before sending payment instructions.
              </p>
              <p className="text-brand-400 font-medium">
                Accepted Payment: PayNow (UEN/QR) · Bank Transfer
              </p>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};
