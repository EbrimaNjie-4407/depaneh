import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Heart,
  ArrowRight,
  Disc,
  Cog,
  Droplet,
  Layers,
  Search,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { DealerProfile, InventoryItem } from '../../types';
import { getPartPhoto } from '../../data/partsCatalog';

interface DealerInventoryBrowsePageProps {
  dealer?: DealerProfile;
  onBackToDealers: () => void;
  onSelectPart: (item: InventoryItem) => void;
}

export function DealerInventoryBrowsePage({
  dealer,
  onBackToDealers,
  onSelectPart,
}: DealerInventoryBrowsePageProps) {
  const store = useStore();
  const [savedPartIds, setSavedPartIds] = useState<string[]>(['P-014']);

  const activeDealer = dealer || store.dealers[0];

  const dealerParts = store.inventory.filter((item) => {
    return (
      item.dealerId === activeDealer.id ||
      item.dealerName.toLowerCase().includes(activeDealer.businessName.toLowerCase())
    );
  });

  const displayList = dealerParts.length > 0 ? dealerParts : store.inventory.slice(0, 4);

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedPartIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Breadcrumb & Heading from Figma Page 6 */}
        <div className="space-y-3">
          <button
            onClick={onBackToDealers}
            className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home / see dealers</span>
          </button>
          <h1 className="text-3xl font-black text-neutral-900 tracking-tight">
            Welcome to {activeDealer.businessName}
          </h1>
        </div>

        {/* Shop by Category matching Figma Page 6 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-neutral-900 tracking-tight">
              Shop by category
            </h2>
            <button
              onClick={() => onBackToDealers()}
              className="text-xs text-neutral-500 hover:text-neutral-900 font-medium"
            >
              View all categories
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-neutral-100/90 rounded-2xl p-5 border border-neutral-200/60 flex items-center gap-3 cursor-pointer hover:bg-neutral-200/70 transition-colors">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-neutral-800 shadow-2xs">
                <Disc className="w-4 h-4" />
              </div>
              <span className="font-bold text-xs text-neutral-900">Brakes</span>
            </div>

            <div className="bg-neutral-100/90 rounded-2xl p-5 border border-neutral-200/60 flex items-center gap-3 cursor-pointer hover:bg-neutral-200/70 transition-colors">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-neutral-800 shadow-2xs">
                <Cog className="w-4 h-4" />
              </div>
              <span className="font-bold text-xs text-neutral-900">Engine</span>
            </div>

            <div className="bg-neutral-100/90 rounded-2xl p-5 border border-neutral-200/60 flex items-center gap-3 cursor-pointer hover:bg-neutral-200/70 transition-colors">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-neutral-800 shadow-2xs">
                <Droplet className="w-4 h-4" />
              </div>
              <span className="font-bold text-xs text-neutral-900">Filters</span>
            </div>
          </div>
        </div>

        {/* Two Column Layout matching Figma Page 6: Picked for your Corolla + Right Side Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Picked for your Corolla */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-neutral-900 tracking-tight">
                Picked for your Corolla
              </h2>
              <button
                onClick={onBackToDealers}
                className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 flex items-center gap-1"
              >
                <span>See all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {displayList.slice(0, 4).map((item) => {
                const photo = getPartPhoto(item.partName, item.image);
                const isSaved = savedPartIds.includes(item.id);

                return (
                  <div
                    key={item.id}
                    onClick={() => onSelectPart(item)}
                    className="bg-white rounded-3xl border border-neutral-200/90 shadow-2xs hover:shadow-md transition-all p-5 flex flex-col justify-between cursor-pointer group space-y-4"
                  >
                    <div>
                      {/* Photo Container with Heart Toggle */}
                      <div className="aspect-4/3 rounded-2xl bg-neutral-100 flex items-center justify-center p-4 border border-neutral-200/60 overflow-hidden relative">
                        <img
                          src={photo}
                          alt={item.partName}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                        <button
                          type="button"
                          onClick={(e) => toggleSave(item.id, e)}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-2xs hover:bg-white text-neutral-700 transition-colors"
                        >
                          <Heart
                            className={`w-4 h-4 ${isSaved ? 'fill-neutral-900 text-neutral-900' : 'text-neutral-500'}`}
                          />
                        </button>
                      </div>

                      {/* Part Details */}
                      <div className="space-y-1">
                        <h3 className="font-extrabold text-base text-neutral-900 group-hover:text-black">
                          {item.partName}
                        </h3>
                        <p className="text-xs text-neutral-500">
                          {item.condition} · New
                        </p>
                        <div className="pt-1">
                          <span className="font-mono font-black text-base text-neutral-900">
                            GMD {item.priceGMD.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400">
                          {activeDealer.businessName}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-neutral-100 text-xs font-semibold text-neutral-900 flex items-center justify-between">
                      <span>✓ Fits your Corolla</span>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Dealers near you + Can't find it ask for it */}
          <div className="lg:col-span-4 space-y-6">
            {/* Dealers Near You Card */}
            <div className="bg-neutral-50 rounded-3xl p-6 border border-neutral-200/80 space-y-4">
              <h3 className="font-extrabold text-sm text-neutral-900">
                Dealers near you
              </h3>

              <div className="space-y-1.5 text-xs">
                <div className="font-bold text-neutral-900 flex items-center gap-1">
                  <span>✓ Kairaba Auto Parts</span>
                  <span className="text-[10px] text-neutral-400">· Verified</span>
                </div>
                <p className="text-neutral-500">Serekunda · 1.2 km away · 4.8 / 5</p>
                <p className="text-neutral-500 text-[11px]">Brakes, filters & engine parts · Open until 18:00</p>
              </div>

              <button
                onClick={onBackToDealers}
                className="w-full py-2.5 bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-900 font-bold text-xs rounded-full transition-colors shadow-2xs"
              >
                Explore dealers
              </button>
            </div>

            {/* Can't find it? Ask for it. Card (Figma Page 6) */}
            <div className="bg-neutral-950 text-white rounded-3xl p-6 shadow-xs space-y-4">
              <div className="space-y-1">
                <h3 className="font-black text-lg text-white">
                  Can’t find it? Ask for it.
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  One request. Quotes from local dealers. Compare before you buy.
                </p>
              </div>

              <button
                onClick={() => onSelectPart(displayList[0])}
                className="w-full py-3 bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-xs rounded-full transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Request a part ↗</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
