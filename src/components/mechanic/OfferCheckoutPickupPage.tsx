import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  Truck,
  Store,
  Check,
  CreditCard,
  ShieldCheck,
  ArrowRight,
  Smartphone,
  Banknote,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { marketplaceStore } from '../../services/store';
import { DeliveryMethod, Order } from '../../types';
import { getPartPhoto } from '../../data/partsCatalog';

interface OfferCheckoutPickupPageProps {
  requestId?: string;
  offerId?: string;
  onBack: () => void;
  onConfirmed: () => void;
  onTrackOrder?: (orderId: string) => void;
}

export function OfferCheckoutPickupPage({
  requestId = 'REQ-1042',
  offerId = 'off_burgi_1042',
  onBack,
  onConfirmed,
  onTrackOrder,
}: OfferCheckoutPickupPageProps) {
  const store = useStore();
  const activeRequest = store.requests.find((r) => r.id === requestId) || store.requests[0];
  const activeOffer = store.offers.find((o) => o.id === offerId) || store.offers[0];

  const [method, setMethod] = useState<'delivery' | 'collection'>('delivery');
  const [recipientName, setRecipientName] = useState('Awa Touray');
  const [recipientPhone, setRecipientPhone] = useState('+220 700 1234');
  const [deliveryAddress, setDeliveryAddress] = useState('12 Kairaba Avenue, Serekunda');
  const [directions, setDirections] = useState('Near the junction; call on arrival.');
  const [payMethod, setPayMethod] = useState<'cod' | 'wave' | 'qmoney' | 'afrimoney'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const partPrice = activeOffer?.priceGMD || 1850;
  const deliveryFee = method === 'delivery' ? 150 : 0;
  const totalAmount = partPrice + deliveryFee;

  const handlePlaceOrder = () => {
    setIsSubmitting(true);

    const isPrepaid = payMethod !== 'cod';
    const txRef = isPrepaid
      ? `ESC-${payMethod.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`
      : `COD-${Math.floor(100000 + Math.random() * 900000)}`;

    const order = marketplaceStore.selectOffer(activeRequest.id, activeOffer.id, {
      deliveryMethod: method === 'delivery' ? 'delivery' : 'pickup',
      pickupTime: method === 'collection' ? 'Today · 2:00 PM' : undefined,
      pickupLocation: method === 'collection' ? activeOffer.dealerLocation : undefined,
      deliveryAddress: method === 'delivery' ? deliveryAddress : undefined,
      deliveryFeeGMD: deliveryFee,
      noteToDealer: directions,
      paymentMethod: payMethod === 'cod' ? 'cash_on_handover' : (payMethod as any),
      paymentStatus: isPrepaid ? 'paid' : 'cash_on_delivery',
      paymentPhone: recipientPhone,
      paymentTransactionRef: txRef,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setConfirmedOrder(order);
    }, 400);
  };

  // --- Order Confirmed View (Figma Page 21) ---
  if (confirmedOrder) {
    return (
      <div className="min-h-screen bg-white text-neutral-900 font-sans">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
            Home / Order confirmed
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-black text-neutral-900 tracking-tight">
              Order confirmed
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left Column */}
            <div className="md:col-span-7 space-y-6">
              <div className="p-8 bg-neutral-50 rounded-3xl border border-neutral-200/80 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-neutral-900 text-white flex items-center justify-center mx-auto shadow-xs">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-black text-neutral-900">
                    You’re one step closer to the fix.
                  </h2>
                  <p className="text-xs text-neutral-600">
                    {activeOffer.dealerName} has received your order. We’ll let you know when it’s ready to move.
                  </p>
                </div>
              </div>

              {/* Estimated Delivery Banner */}
              <div className="p-5 bg-neutral-50 rounded-3xl border border-neutral-200/80 space-y-1 text-xs">
                <span className="font-bold text-neutral-900">
                  Estimated delivery · Tomorrow
                </span>
                <p className="text-neutral-500 text-[11px]">
                  10:00–18:00. Delivery times are estimates and will be confirmed by your dealer.
                </p>
              </div>

              {/* Escrow Protected Note */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs space-y-1 text-emerald-900">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>DEPANEH Escrow Trust Vault Active</span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  Payment is securely held until both you and the delivery courier confirm that the part matches the vehicle and is undamaged.
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => {
                    if (onTrackOrder) {
                      onTrackOrder(confirmedOrder.id);
                    } else {
                      onConfirmed();
                    }
                  }}
                  className="w-full py-3.5 bg-neutral-900 hover:bg-black text-white font-bold text-xs rounded-full transition-colors shadow-xs"
                >
                  View order & updates
                </button>
                <button
                  onClick={onConfirmed}
                  className="w-full py-3 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-900 font-bold text-xs rounded-full transition-colors"
                >
                  Keep browsing
                </button>
              </div>
            </div>

            {/* Right Column: Order PN-1048 Card (Figma Page 21) */}
            <div className="md:col-span-5 bg-neutral-50 rounded-3xl border border-neutral-200/80 p-6 space-y-4 text-xs">
              <h3 className="font-black text-base text-neutral-900">
                Order {confirmedOrder.id}
              </h3>
              <div className="space-y-3 border-t border-neutral-200/60 pt-3">
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Part</span>
                  <span className="font-bold text-neutral-900">{activeOffer.partName} · Qty 1</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Payment</span>
                  <span className="font-semibold text-neutral-800">
                    {payMethod === 'cod' ? 'Cash on delivery' : `Mobile Money (${payMethod.toUpperCase()})`}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Fulfilment</span>
                  <span className="font-semibold text-neutral-800">
                    {method === 'delivery' ? `Deliver to · ${deliveryAddress}` : `Collect at · ${activeOffer.dealerLocation}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-neutral-200 flex justify-between items-baseline">
                  <span className="font-bold text-neutral-900">Total</span>
                  <span className="font-mono font-black text-xl text-neutral-900">
                    GMD {totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Main Checkout View (Figma Pages 19 & 20) ---
  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Breadcrumb & Title */}
        <div className="space-y-1">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 font-medium mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home / Offer checkout</span>
          </button>
          <h1 className="text-3xl font-black text-neutral-900 tracking-tight">
            Checkout
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols): Delivery or collection + Payment */}
          <div className="lg:col-span-8 space-y-6">
            {/* Delivery or Collection Card */}
            <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-7 space-y-5 shadow-2xs">
              <h2 className="text-sm font-extrabold text-neutral-900">
                Delivery or collection
              </h2>

              {/* Segmented Control */}
              <div className="grid grid-cols-2 gap-2 text-xs font-bold border-b border-neutral-200 pb-3">
                <button
                  type="button"
                  onClick={() => setMethod('delivery')}
                  className={`pb-1 text-center border-b-2 transition-colors ${
                    method === 'delivery'
                      ? 'border-neutral-900 text-neutral-900'
                      : 'border-transparent text-neutral-400 hover:text-neutral-700'
                  }`}
                >
                  Delivery
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('collection')}
                  className={`pb-1 text-center border-b-2 transition-colors ${
                    method === 'collection'
                      ? 'border-neutral-900 text-neutral-900'
                      : 'border-transparent text-neutral-400 hover:text-neutral-700'
                  }`}
                >
                  Collection
                </button>
              </div>

              {method === 'delivery' ? (
                <div className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <span className="font-bold text-neutral-700 block">Recipient</span>
                    <input
                      type="text"
                      value={`${recipientName} · ${recipientPhone}`}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-neutral-700 block">Delivery address</span>
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-neutral-700 block">Directions · Optional</span>
                    <input
                      type="text"
                      value={directions}
                      onChange={(e) => setDirections(e.target.value)}
                      placeholder="Near the junction; call on arrival."
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-medium"
                    />
                  </div>

                  <p className="text-[11px] text-neutral-500 pt-1">
                    Estimated delivery: tomorrow, 25 Oct · 10:00–18:00
                  </p>
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-1">
                    <span className="font-bold text-neutral-900 block">Collection point</span>
                    <p className="text-neutral-600">{activeOffer.dealerLocation}</p>
                    <p className="text-[11px] text-neutral-400">Opening hours: Mon–Sat · 08:30–18:00</p>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    Collection fee: GMD 0 · Ready for pickup within 2 hours.
                  </p>
                </div>
              )}
            </div>

            {/* How Would You Like to Pay? (Figma Pages 19 & 20) */}
            <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-7 space-y-4 shadow-2xs">
              <h2 className="text-sm font-extrabold text-neutral-900">
                How would you like to pay?
              </h2>

              <div className="space-y-2.5 text-xs">
                {/* Option 1: Pay on delivery */}
                <div
                  onClick={() => setPayMethod('cod')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    payMethod === 'cod'
                      ? 'border-neutral-900 bg-neutral-50/80'
                      : 'border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                      <span>Pay on delivery</span>
                      {payMethod === 'cod' && <Check className="w-3.5 h-3.5 text-neutral-900" />}
                    </div>
                    <p className="text-neutral-500 text-[11px]">
                      Cash in GMD · Pay when your part arrives
                    </p>
                  </div>
                  <Banknote className="w-5 h-5 text-neutral-400" />
                </div>

                {/* Option 2: Wave Money (Escrow Protected) */}
                <div
                  onClick={() => setPayMethod('wave')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    payMethod === 'wave'
                      ? 'border-neutral-900 bg-neutral-50/80'
                      : 'border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                      <span>Wave Mobile Money</span>
                      {payMethod === 'wave' && <Check className="w-3.5 h-3.5 text-neutral-900" />}
                    </div>
                    <p className="text-neutral-500 text-[11px]">
                      Instant 0% fee · Protected in DEPANEH Escrow Vault
                    </p>
                  </div>
                  <Smartphone className="w-5 h-5 text-blue-600" />
                </div>

                {/* Option 3: QMoney */}
                <div
                  onClick={() => setPayMethod('qmoney')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    payMethod === 'qmoney'
                      ? 'border-neutral-900 bg-neutral-50/80'
                      : 'border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                      <span>QMoney (QCell)</span>
                      {payMethod === 'qmoney' && <Check className="w-3.5 h-3.5 text-neutral-900" />}
                    </div>
                    <p className="text-neutral-500 text-[11px]">
                      Direct wallet payment · Escrow protected
                    </p>
                  </div>
                  <Smartphone className="w-5 h-5 text-amber-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Order Summary & Place Order */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            {/* Part Preview Card */}
            <div className="bg-neutral-50 rounded-3xl border border-neutral-200/80 p-5 space-y-2 text-xs">
              <h3 className="font-extrabold text-neutral-900">{activeOffer.partName}</h3>
              <p className="text-neutral-500 font-medium">✓ {activeOffer.dealerName} · Verified</p>
              <p className="text-[11px] text-neutral-400">
                Quantity 1 · Fits your Corolla 2010 1.6 petrol
              </p>
            </div>

            {/* Payment Summary Box */}
            <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 space-y-4 shadow-2xs text-xs">
              <h3 className="font-extrabold text-neutral-900">Payment summary</h3>

              <div className="space-y-2 text-neutral-600">
                <div className="flex justify-between">
                  <span>Part subtotal</span>
                  <span className="font-mono font-semibold text-neutral-900">GMD {partPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery fee</span>
                  <span className="font-mono font-semibold text-neutral-900">GMD {deliveryFee.toLocaleString()}</span>
                </div>
                <div className="pt-3 border-t border-neutral-100 flex justify-between items-baseline">
                  <span className="font-bold text-neutral-900 text-sm">Total</span>
                  <span className="font-mono font-black text-2xl text-neutral-900">
                    GMD {totalAmount.toLocaleString()}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400">No extra marketplace fee.</p>
              </div>

              {/* Escrow Vault Protected Note */}
              <div className="p-3 bg-neutral-100 rounded-xl text-[11px] text-neutral-600 space-y-1">
                <div className="font-bold text-neutral-900 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-neutral-700" />
                  <span>DEPANEH Trust Vault Protection</span>
                </div>
                <p>
                  Funds are withheld until both you and the courier confirm the part is identical and in good condition.
                </p>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handlePlaceOrder}
                  className="w-full py-3.5 bg-neutral-900 hover:bg-black text-white font-bold text-xs rounded-full transition-colors shadow-xs flex items-center justify-center gap-2"
                >
                  <span>{isSubmitting ? 'Processing order...' : `Place order · GMD ${totalAmount.toLocaleString()}`}</span>
                </button>
                <p className="text-[11px] text-neutral-400 text-center leading-relaxed">
                  By ordering, you agree to the dealer’s fulfilment and return terms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
