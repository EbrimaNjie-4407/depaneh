import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Phone,
  MapPin,
  Clock,
  Wrench,
  Navigation,
  X,
  ShieldCheck,
  Truck,
  Package,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { DealerProfile, InventoryItem } from '../../types';
import { getPartPhoto } from '../../data/partsCatalog';
import { ShopDirectionsSpatialMap } from '../common/ShopDirectionsSpatialMap';

interface DealerShopAndOfferViewProps {
  dealer?: DealerProfile;
  part?: InventoryItem;
  onBack: () => void;
  onSelectOffer: () => void;
}

export function DealerShopAndOfferView({
  dealer,
  part,
  onBack,
  onSelectOffer,
}: DealerShopAndOfferViewProps) {
  const store = useStore();
  const activeDealer = dealer || store.dealers[0];
  const activePart = part || store.inventory[0];
  const [showCallModal, setShowCallModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showCompatibilityModal, setShowCompatibilityModal] = useState(false);

  const photo = getPartPhoto(activePart.partName, activePart.image);

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Breadcrumb matching Figma Page 10 */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home / Part detail</span>
          </button>

          <span className="text-[11px] font-bold text-neutral-400 font-mono">
            ID: {activePart.id}
          </span>
        </div>

        {/* Page Title */}
        <h1 className="text-3xl font-black text-neutral-900 tracking-tight">
          {activePart.partName}
        </h1>

        {/* Two Column Grid from Figma Page 10 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols): Photo Showcase & Specifications */}
          <div className="lg:col-span-8 space-y-8">
            {/* Main Product Image Container */}
            <div className="rounded-3xl bg-neutral-100 p-8 sm:p-12 flex items-center justify-center border border-neutral-200/60 overflow-hidden relative shadow-2xs">
              <img
                src={photo}
                alt={activePart.partName}
                className="max-h-[360px] w-auto max-w-full object-contain"
              />
            </div>

            {/* Made for your next stop Section */}
            <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 space-y-6 shadow-2xs">
              <div className="space-y-2">
                <h2 className="text-lg font-extrabold text-neutral-900">
                  Made for your next stop
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {activePart.description ||
                    'A quiet, reliable replacement set for everyday driving. Built to withstand Gambian road conditions with heat-dissipating alloy compound. Professional fitting recommended.'}
                </p>
              </div>

              {/* Specifications List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t border-neutral-100">
                <div className="space-y-1">
                  <span className="text-neutral-400 font-medium">Brand</span>
                  <p className="font-bold text-neutral-900">Bosch / Genuine OEM</p>
                </div>
                <div className="space-y-1">
                  <span className="text-neutral-400 font-medium">Part number</span>
                  <p className="font-mono font-bold text-neutral-900">{activePart.partNumber || 'BP-COR-2010-F'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-neutral-400 font-medium">Position / Fitment</span>
                  <p className="font-bold text-neutral-900">Front axle · Both wheels</p>
                </div>
                <div className="space-y-1">
                  <span className="text-neutral-400 font-medium">Material</span>
                  <p className="font-bold text-neutral-900">Low-metallic compound</p>
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <span className="text-neutral-400 font-medium">Warranty</span>
                  <p className="font-bold text-neutral-900">90-day manufacturing cover from {activeDealer.businessName}</p>
                </div>
              </div>
            </div>

            {/* Delivery or Collection Options (Figma Page 10) */}
            <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 space-y-4 shadow-2xs">
              <h2 className="text-base font-extrabold text-neutral-900">
                Delivery or collection
              </h2>

              <div className="space-y-3 text-xs">
                {/* Option 1: Delivery */}
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/70 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-neutral-700" />
                      <span>Delivery to Serekunda & Greater Banjul · GMD 150 →</span>
                    </div>
                    <p className="text-neutral-500 text-[11px]">Dispatch via Depaneh courier · Same-day or tomorrow</p>
                  </div>
                  <span className="font-mono font-bold text-neutral-900 text-xs">GMD 150</span>
                </div>

                {/* Option 2: Collection */}
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/70 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-neutral-700" />
                      <span>Collect at {activeDealer.businessName} · Free →</span>
                    </div>
                    <p className="text-neutral-500 text-[11px]">{activeDealer.shopLocation} · Ready in 2 hours</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowMapModal(true)}
                    className="text-xs font-bold text-neutral-900 hover:underline"
                  >
                    View map directions
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Contiguous Purchase Module (Figma Page 10) */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-7 shadow-xs space-y-6">
              {/* Price & Stock */}
              <div className="space-y-1">
                <div className="text-3xl font-mono font-black text-neutral-900">
                  GMD {activePart.priceGMD.toLocaleString()}
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
                  <span>{activePart.condition}</span>
                  <span>·</span>
                  <span>{activePart.quantity > 0 ? `${activePart.quantity} sets in stock` : 'Available to order'}</span>
                </div>
              </div>

              {/* Verified Dealer Info */}
              <div className="pt-4 border-t border-neutral-100 space-y-1 text-xs">
                <div className="font-bold text-neutral-900 flex items-center gap-1">
                  <span>✓ {activeDealer.businessName}</span>
                  <span className="text-[11px] text-neutral-400 font-normal">· Verified</span>
                </div>
                <p className="text-neutral-500">
                  {activeDealer.shopLocation.split(',')[0]} · 4.8 (42 reviews) · Usually replies in 20 min
                </p>
              </div>

              {/* Vehicle Compatibility Banner */}
              <div className="p-4 rounded-2xl bg-neutral-100/80 border border-neutral-200/60 space-y-1 text-xs">
                <div className="font-bold text-neutral-900 flex items-center gap-1">
                  <span>✓ Fits your Toyota Corolla</span>
                </div>
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  2010 · 1.6 petrol · Front axle. Verified OEM fitment for your vehicle.
                </p>
              </div>

              {/* Primary Action Buttons from Figma Page 10 */}
              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCompatibilityModal(true)}
                  className="w-full py-3 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-900 font-bold text-xs rounded-full transition-colors"
                >
                  Check vehicle compatibility
                </button>

                <button
                  type="button"
                  onClick={onSelectOffer}
                  className="w-full py-3.5 bg-neutral-900 hover:bg-black text-white font-bold text-xs rounded-full transition-colors shadow-xs flex items-center justify-center gap-2"
                >
                  <span>Buy now · GMD {activePart.priceGMD.toLocaleString()}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowCallModal(true)}
                  className="w-full py-3 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-900 font-bold text-xs rounded-full transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-neutral-600" />
                  <span>Message dealer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Compatibility Modal (Figma Page 12) --- */}
      {showCompatibilityModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-neutral-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
                  Home / Vehicle compatibility
                </span>
                <h2 className="text-2xl font-black text-neutral-900 mt-1">Make sure it fits.</h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Choose your vehicle to check {activePart.partName} compatibility.
                </p>
              </div>
              <button onClick={() => setShowCompatibilityModal(false)} className="text-neutral-400 hover:text-neutral-900 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-3 text-xs">
              <span className="font-bold text-neutral-400 uppercase text-[10px] tracking-wider block">Your garage</span>
              <div className="grid grid-cols-2 gap-3 font-semibold text-neutral-800">
                <div>Make: <span className="font-bold text-neutral-900">Toyota</span></div>
                <div>Model: <span className="font-bold text-neutral-900">Corolla</span></div>
                <div>Year: <span className="font-bold text-neutral-900">2010</span></div>
                <div>Engine: <span className="font-bold text-neutral-900">1.6 petrol</span></div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs space-y-1">
              <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Matching part found</span>
              </div>
              <p className="text-emerald-800 text-[11px]">
                {activePart.partName} ({activePart.partNumber || 'BP-COR-2010-F'}) matches this vehicle’s front axle.
              </p>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setShowCompatibilityModal(false)}
                className="w-full py-3 bg-neutral-900 hover:bg-black text-white font-bold text-xs rounded-full transition-colors"
              >
                Save vehicle & use this fit
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCompatibilityModal(false);
                  setShowCallModal(true);
                }}
                className="w-full py-2.5 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-medium text-xs rounded-full transition-colors"
              >
                Ask dealer to confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Direct Contact & Call Modal --- */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-black text-neutral-900">Contact {activeDealer.businessName}</h4>
                <p className="text-xs text-neutral-500">{activeDealer.shopLocation}</p>
              </div>
              <button onClick={() => setShowCallModal(false)} className="text-neutral-400 hover:text-neutral-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 text-center space-y-2">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                Telephone & WhatsApp
              </span>
              <p className="text-2xl font-black text-neutral-900 font-mono tracking-tight">
                {activeDealer.phone}
              </p>
              <p className="text-xs text-neutral-600">
                Contact: <strong className="text-neutral-900">{activeDealer.contactPerson}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <a
                href={`tel:${activeDealer.phone.replace(/\s+/g, '')}`}
                className="flex-1 py-3 bg-neutral-900 hover:bg-black text-white rounded-full font-bold text-center transition-colors shadow-xs"
              >
                Call {activeDealer.phone}
              </a>
              <button
                onClick={() => setShowCallModal(false)}
                className="px-5 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-full font-bold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Spatial Map Directions Modal --- */}
      {showMapModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl border border-neutral-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-neutral-900">
                  Live Directions to {activeDealer.businessName}
                </h3>
                <p className="text-xs text-neutral-500">{activeDealer.shopLocation}</p>
              </div>
              <button
                onClick={() => setShowMapModal(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ShopDirectionsSpatialMap
              dealer={activeDealer}
              currentUser={store.currentUser}
            />
          </div>
        </div>
      )}
    </div>
  );
}
