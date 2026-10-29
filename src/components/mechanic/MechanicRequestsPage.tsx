import React, { useState } from 'react';
import {
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock,
  Car,
  ChevronRight,
  ShieldCheck,
  ArrowLeft,
  X,
  Volume2,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { PartRequest, DealerOffer } from '../../types';
import { marketplaceStore } from '../../services/store';

interface MechanicRequestsPageProps {
  onCreateRequest: () => void;
  onViewRequestDetail: (req: PartRequest) => void;
  onTrackOrder: (orderId: string) => void;
}

export function MechanicRequestsPage({
  onCreateRequest,
  onViewRequestDetail: _onViewRequestDetail,
  onTrackOrder: _onTrackOrder,
}: MechanicRequestsPageProps) {
  const store = useStore();
  const [activeTab, setActiveTab] = useState<'all' | 'open' | 'quoted'>('all');
  const [selectedRequestForOffers, setSelectedRequestForOffers] = useState<PartRequest | null>(null);
  const [showComparisonView, setShowComparisonView] = useState(false);

  const requests = store.requests.filter((r) => {
    if (activeTab === 'open') return r.status === 'Waiting for dealers';
    if (activeTab === 'quoted') return r.status === 'Responses received';
    return true;
  });

  const handleSelectOffer = (req: PartRequest, offerId: string) => {
    marketplaceStore.selectOffer(req.id, offerId, {
      deliveryMethod: 'delivery',
      deliveryFeeGMD: 150,
      deliveryAddress: '12 Kairaba Avenue, Serekunda',
      paymentMethod: 'cash_on_handover',
      paymentStatus: 'pending',
    });
    setSelectedRequestForOffers(null);
    setShowComparisonView(false);
  };

  // --- Sub-View: Side-by-Side Comparison (Figma Page 18) ---
  if (selectedRequestForOffers && showComparisonView) {
    const offers = store.offers.filter((o) => o.requestId === selectedRequestForOffers.id);
    const displayOffers = offers.length > 0 ? offers : store.offers.slice(0, 3);

    return (
      <div className="min-h-screen bg-white text-neutral-900 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div className="space-y-1">
            <button
              onClick={() => setShowComparisonView(false)}
              className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 font-medium mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to offers</span>
            </button>
            <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
              Home / Offer comparison
            </div>
            <h1 className="text-3xl font-black text-neutral-900 tracking-tight">
              Same request. Your best choice.
            </h1>
            <p className="text-xs text-neutral-500">
              {selectedRequestForOffers.partName} · {selectedRequestForOffers.id} · {selectedRequestForOffers.vehicleMake} {selectedRequestForOffers.vehicleModel} · Quantity 1
            </p>
          </div>

          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 text-xs">
            <h3 className="font-bold text-neutral-900">Compare the full cost</h3>
            <p className="text-neutral-500 text-[11px]">
              Each total includes the dealer’s delivery fee, or free collection where shown.
            </p>
          </div>

          {/* Comparison Matrix (Figma Page 18) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {displayOffers.map((offer, idx) => {
              const tagLabel = idx === 0 ? 'Recommended' : idx === 1 ? 'Lowest price' : 'Original part';
              const deliveryFee = idx === 0 ? 150 : idx === 1 ? 100 : 0;
              const warranty = idx === 0 ? '6 months' : idx === 1 ? '30 days' : '12 months';
              const fulfilment = idx === 2 ? 'Collection tomorrow' : idx === 1 ? 'Delivery in 2 days' : 'Delivery tomorrow';
              const total = offer.priceGMD + deliveryFee;

              return (
                <div
                  key={offer.id}
                  className="bg-white rounded-3xl border border-neutral-200/90 shadow-2xs p-6 flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold bg-neutral-900 text-white">
                      {tagLabel}
                    </span>

                    <div className="space-y-1">
                      <div className="font-bold text-neutral-900 text-xs">✓ {offer.dealerName} · Verified</div>
                      <p className="text-[11px] text-neutral-500">{offer.dealerLocation}</p>
                    </div>

                    <div className="text-2xl font-mono font-black text-neutral-900">
                      GMD {offer.priceGMD.toLocaleString()}
                    </div>
                    <div className="text-xs text-neutral-500">
                      {offer.condition} · In stock
                    </div>
                    <div className="text-xs font-semibold text-neutral-900">
                      ✓ Fits your vehicle · confirmed fit
                    </div>

                    <div className="pt-4 border-t border-neutral-100 space-y-2.5 text-xs text-neutral-600">
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Warranty</span>
                        <span className="font-medium text-neutral-900">{warranty}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Availability</span>
                        <span className="font-medium text-neutral-900">In stock</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Fulfilment</span>
                        <span className="font-medium text-neutral-900">{fulfilment}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Delivery / collection</span>
                        <span className="font-medium text-neutral-900">GMD {deliveryFee}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-neutral-100 flex justify-between items-baseline text-sm">
                      <span className="font-bold text-neutral-900">Total</span>
                      <span className="font-mono font-black text-xl text-neutral-900">
                        GMD {total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectOffer(selectedRequestForOffers, offer.id)}
                    className="w-full py-3 bg-neutral-900 hover:bg-black text-white font-bold text-xs rounded-full transition-colors shadow-xs"
                  >
                    Select offer
                  </button>
                </div>
              );
            })}
          </div>

          <div className="text-center text-[11px] text-neutral-400 pt-2">
            Warranty terms are provided by each dealer. Ask about exclusions before accepting a quote.
          </div>
        </div>
      </div>
    );
  }

  // --- Sub-View: Dealer Offers for a Specific Request (Figma Page 17) ---
  if (selectedRequestForOffers) {
    const offers = store.offers.filter((o) => o.requestId === selectedRequestForOffers.id);
    const displayOffers = offers.length > 0 ? offers : store.offers.slice(0, 3);

    return (
      <div className="min-h-screen bg-white text-neutral-900 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div className="space-y-1">
            <button
              onClick={() => setSelectedRequestForOffers(null)}
              className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 font-medium mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Home / Requests overview</span>
            </button>
            <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
              Home / Dealer offers
            </div>
            <h1 className="text-3xl font-black text-neutral-900 tracking-tight">
              Offers for your request
            </h1>
            <p className="text-xs text-neutral-500">
              {selectedRequestForOffers.partName} · {selectedRequestForOffers.id} · {displayOffers.length} quotes · {selectedRequestForOffers.vehicleMake} {selectedRequestForOffers.vehicleModel} · Qty 1
            </p>
          </div>

          <button
            onClick={() => setShowComparisonView(true)}
            className="w-full py-3.5 bg-neutral-100 hover:bg-neutral-200/80 text-neutral-900 font-bold text-xs rounded-2xl transition-colors border border-neutral-200/80 flex items-center justify-center gap-2"
          >
            <span>Compare all 3 offers</span>
            <ChevronRight className="w-4 h-4 text-neutral-500" />
          </button>

          {/* 3 Offer Cards (Figma Page 17) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {displayOffers.map((offer, idx) => {
              const tagLabel = idx === 0 ? 'Recommended' : idx === 1 ? 'Lowest price' : 'Original part';
              const deliveryFee = idx === 0 ? 150 : idx === 1 ? 100 : 0;
              const total = offer.priceGMD + deliveryFee;

              return (
                <div
                  key={offer.id}
                  className="bg-white rounded-3xl border border-neutral-200/90 shadow-2xs p-6 flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-3">
                    <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold bg-neutral-900 text-white">
                      {tagLabel}
                    </span>

                    <div>
                      <div className="font-bold text-neutral-900 text-xs">✓ {offer.dealerName} · Verified</div>
                      <p className="text-[11px] text-neutral-500">{offer.dealerLocation}</p>
                    </div>

                    <div className="text-3xl font-mono font-black text-neutral-900 pt-1">
                      GMD {offer.priceGMD.toLocaleString()}
                    </div>

                    <p className="text-xs text-neutral-500">
                      {offer.condition} · In stock
                    </p>

                    <p className="text-xs font-semibold text-neutral-900">
                      ✓ {selectedRequestForOffers.vehicleMake} {selectedRequestForOffers.vehicleModel} · confirmed fit
                    </p>

                    <div className="pt-4 border-t border-neutral-100">
                      <span className="text-[11px] text-neutral-400 block font-medium">Total incl. fulfilment</span>
                      <span className="text-lg font-mono font-black text-neutral-900">
                        GMD {total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectOffer(selectedRequestForOffers, offer.id)}
                    className="w-full py-3 bg-neutral-900 hover:bg-black text-white font-bold text-xs rounded-full transition-colors shadow-xs"
                  >
                    Select offer
                  </button>
                </div>
              );
            })}
          </div>

          <div className="text-center text-[11px] text-neutral-400 pt-2">
            Quotes received today. Confirm validity before payment. All dealers have confirmed fit for your vehicle.
          </div>
        </div>
      </div>
    );
  }

  // --- Main Requests Overview (Figma Page 15) ---
  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Breadcrumb & Heading */}
        <div className="space-y-1">
          <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
            Home / Requests overview
          </div>
          <h1 className="text-3xl font-black text-neutral-900 tracking-tight">
            Let dealers find it.
          </h1>
        </div>

        {/* Filter Tabs from Figma Page 15 */}
        <div className="flex items-center gap-3 text-xs font-bold border-b border-neutral-200 pb-3">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-1 px-2 border-b-2 transition-colors ${
              activeTab === 'all'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
          >
            All · {store.requests.length}
          </button>
          <button
            onClick={() => setActiveTab('open')}
            className={`pb-1 px-2 border-b-2 transition-colors ${
              activeTab === 'open'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
          >
            Open · {store.requests.filter((r) => r.status === 'Waiting for dealers').length}
          </button>
          <button
            onClick={() => setActiveTab('quoted')}
            className={`pb-1 px-2 border-b-2 transition-colors ${
              activeTab === 'quoted'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
          >
            Quoted · {store.requests.filter((r) => r.status === 'Responses received').length || 1}
          </button>
        </div>

        {/* Requests Cards Grid (Figma Page 15) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {requests.map((req) => {
            const hasOffers = req.status === 'Responses received' || req.repliesCount > 0;
            const isOpen = req.status === 'Waiting for dealers';
            const isClosed = req.status === 'Delivered' || req.status === 'Collected';

            return (
              <div
                key={req.id}
                className="bg-neutral-50 rounded-3xl border border-neutral-200/80 p-6 flex flex-col justify-between space-y-6 shadow-2xs"
              >
                <div className="space-y-3">
                  <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                    {hasOffers ? 'Quoted · 3 offers' : isOpen ? 'Open · Awaiting quotes' : 'Closed'}
                  </span>

                  <h3 className="font-extrabold text-lg text-neutral-900">
                    {req.partName}
                  </h3>

                  <div className="space-y-1 text-xs text-neutral-500">
                    <p>{req.id} · {req.vehicleMake} {req.vehicleModel} · {req.vehicleYear}</p>
                    <p>Requested · {req.createdAt}</p>
                    {hasOffers && (
                      <p className="font-bold text-neutral-900 pt-1">
                        Offers from · GMD 3,200
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  {hasOffers ? (
                    <button
                      onClick={() => setSelectedRequestForOffers(req)}
                      className="w-full py-3 bg-neutral-900 hover:bg-black text-white font-bold text-xs rounded-full transition-colors shadow-xs"
                    >
                      View 3 dealer offers
                    </button>
                  ) : isOpen ? (
                    <button
                      onClick={() => setSelectedRequestForOffers(req)}
                      className="w-full py-3 bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-900 font-bold text-xs rounded-full transition-colors"
                    >
                      View request
                    </button>
                  ) : (
                    <div className="text-center text-xs text-neutral-400 py-2">
                      Order completed
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button at Bottom (Figma Page 15) */}
        <div className="pt-4">
          <button
            onClick={onCreateRequest}
            className="w-full py-4 bg-neutral-900 hover:bg-black text-white font-bold text-xs rounded-full transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Request another part</span>
          </button>
        </div>
      </div>
    </div>
  );
}
