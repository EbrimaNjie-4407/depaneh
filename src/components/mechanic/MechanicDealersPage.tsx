import React, { useState } from 'react';
import {
  MapPin,
  CheckCircle2,
  Car,
  Search,
  Package,
  Phone,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { DealerProfile, InventoryItem } from '../../types';
import { getPartPhoto } from '../../data/partsCatalog';

interface MechanicDealersPageProps {
  onSelectDealer: (dealer: DealerProfile) => void;
  onSelectPart?: (item: InventoryItem) => void;
  onNavigate: (view: string) => void;
}

export function MechanicDealersPage({
  onSelectDealer,
  onSelectPart,
  onNavigate,
}: MechanicDealersPageProps) {
  const store = useStore();
  const [selectedLocation, setSelectedLocation] = useState<string>('Jeshwang');
  const [activeTab, setActiveTab] = useState<'dealers' | 'parts'>('dealers');

  // Filter dealers based on selected location pill
  const filteredDealers = store.dealers.filter((d) => {
    if (selectedLocation === 'All') return true;
    if (selectedLocation === 'Latrikunda') {
      return (
        d.shopLocation.toLowerCase().includes('latrikunda') ||
        d.shopLocation.toLowerCase().includes('westfield')
      );
    }
    if (selectedLocation === 'Jeshwang') {
      return d.shopLocation.toLowerCase().includes('jeshwang');
    }
    if (selectedLocation === 'Bambo') {
      return (
        d.shopLocation.toLowerCase().includes('bambo') ||
        d.shopLocation.toLowerCase().includes('serrekunda')
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Breadcrumb & Title from Figma Page 5 */}
        <div className="space-y-1">
          <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
            Home / see dealers
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-3xl font-black text-neutral-900 tracking-tight">
              Dealers
            </h1>

            {/* Quick Switcher between Dealers view & Parts catalog */}
            <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-2xl self-start sm:self-auto border border-neutral-200/80 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('dealers')}
                className={`px-4 py-1.5 rounded-xl transition-all ${
                  activeTab === 'dealers'
                    ? 'bg-neutral-900 text-white shadow-2xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Verified Dealers ({store.dealers.length})
              </button>
              <button
                onClick={() => setActiveTab('parts')}
                className={`px-4 py-1.5 rounded-xl transition-all ${
                  activeTab === 'parts'
                    ? 'bg-neutral-900 text-white shadow-2xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                All Listed Parts ({store.inventory.length})
              </button>
            </div>
          </div>
        </div>

        {/* Location Filter Pills matching Figma Page 5 (Latrikunda, Jeshwang, Bambo) */}
        {activeTab === 'dealers' && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
            {['All', 'Latrikunda', 'Jeshwang', 'Bambo'].map((loc) => {
              const isSelected = selectedLocation === loc;
              return (
                <button
                  key={loc}
                  onClick={() => setSelectedLocation(loc)}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    isSelected
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200/80'
                  }`}
                >
                  {loc}
                </button>
              );
            })}
          </div>
        )}

        {/* Dealers Grid matching Figma Page 5 */}
        {activeTab === 'dealers' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredDealers.map((dealer) => {
                const partsForDealer = store.inventory.filter((i) => i.dealerId === dealer.id);

                return (
                  <div
                    key={dealer.id}
                    onClick={() => onSelectDealer(dealer)}
                    className="bg-white rounded-3xl border border-neutral-200/90 shadow-2xs hover:shadow-md hover:border-neutral-300 transition-all p-6 flex flex-col justify-between cursor-pointer group space-y-5"
                  >
                    {/* Dealer Logo Graphic Showcase */}
                    <div className="aspect-square w-full rounded-2xl bg-neutral-100 flex items-center justify-center p-6 border border-neutral-200/60 group-hover:scale-[1.02] transition-transform">
                      <div className="w-24 h-24 rounded-full bg-white shadow-xs border border-neutral-200 flex flex-col items-center justify-center text-center p-2">
                        <span className="font-black text-sm tracking-tight text-neutral-900">
                          {dealer.logoText || dealer.businessName.slice(0, 5).toUpperCase()}
                        </span>
                        <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5">
                          AUTO PARTS
                        </span>
                      </div>
                    </div>

                    {/* Dealer Details */}
                    <div className="space-y-1.5 text-xs">
                      <h3 className="font-extrabold text-base text-neutral-900 group-hover:text-black">
                        {dealer.businessName}
                      </h3>
                      <p className="text-neutral-500 font-mono text-[11px]">
                        Tel: {dealer.phone.replace('+220 ', '')}
                      </p>
                      <p className="text-neutral-600 font-medium">
                        {dealer.shopLocation.split(',')[0]}
                      </p>
                      <p className="text-neutral-500 text-[11px]">
                        {dealer.specialization || 'OEM and new parts'}
                      </p>

                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-emerald-700 font-bold text-xs flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Verified</span>
                        </span>
                        <span className="text-[11px] text-neutral-400 font-mono">
                          {partsForDealer.length} parts in stock
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load More Button */}
            <div className="text-center pt-2">
              <button
                onClick={() => onNavigate('browse_all_parts')}
                className="w-full py-3.5 bg-neutral-100 hover:bg-neutral-200/80 text-neutral-900 font-bold text-xs rounded-full transition-colors border border-neutral-200/70"
              >
                Load more parts
              </button>
            </div>
          </div>
        )}

        {/* Parts Catalog Grid View */}
        {activeTab === 'parts' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {store.inventory.map((item) => {
                const photo = getPartPhoto(item.partName, item.image);

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (onSelectPart) {
                        onSelectPart(item);
                      } else {
                        const dealer = store.dealers.find((d) => d.id === item.dealerId);
                        if (dealer) onSelectDealer(dealer);
                      }
                    }}
                    className="bg-white rounded-3xl border border-neutral-200/90 shadow-2xs hover:shadow-md transition-all p-5 flex flex-col justify-between cursor-pointer group"
                  >
                    <div>
                      {/* Part Photo */}
                      <div className="aspect-4/3 rounded-2xl bg-neutral-100 flex items-center justify-center p-4 border border-neutral-200/60 overflow-hidden mb-4">
                        <img
                          src={photo}
                          alt={item.partName}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-extrabold text-sm text-neutral-900 group-hover:text-black">
                            {item.partName}
                          </h3>
                          <span className="font-mono font-black text-sm text-neutral-900 shrink-0">
                            GMD {item.priceGMD.toLocaleString()}
                          </span>
                        </div>

                        <p className="text-xs text-neutral-500">
                          {item.condition} · {item.compatibleMake} {item.compatibleModel}
                        </p>

                        <p className="text-[11px] text-neutral-400">
                          {item.dealerName} · {item.dealerLocation.split(',')[0]}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-neutral-900">
                      <span>✓ Fits your vehicle</span>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Note from Figma Page 5 */}
        <div className="pt-4 text-center text-xs text-neutral-400">
          Prices are per set. Confirm your vehicle before buying.
        </div>
      </div>
    </div>
  );
}
