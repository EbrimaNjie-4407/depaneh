import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Heart,
  ArrowRight,
  Car,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { InventoryItem } from '../../types';
import { getPartPhoto } from '../../data/partsCatalog';

interface BrowseAllPartsPageProps {
  onSelectPart: (item: InventoryItem) => void;
  onNavigateToDealer: (dealerId: string) => void;
}

export function BrowseAllPartsPage({
  onSelectPart,
  onNavigateToDealer: _onNavigateToDealer,
}: BrowseAllPartsPageProps) {
  const store = useStore();
  const [searchTerm, setSearchTerm] = useState(store.searchQuery.part);
  const [savedIds, setSavedIds] = useState<string[]>(['P-014']);
  const [conditionFilter, setConditionFilter] = useState<'All' | 'OEM · New' | 'Aftermarket · New' | 'Used · Tested'>('All');
  const [sortBy, setSortBy] = useState<'best_fit' | 'price_low' | 'price_high'>('best_fit');
  const [showRefineModal, setShowRefineModal] = useState(false);

  useEffect(() => {
    setSearchTerm(store.searchQuery.part);
  }, [store.searchQuery.part]);

  const toggleHeart = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const filteredParts = store.inventory
    .filter((item) => {
      if (item.status === 'unlisted') return false;

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matches =
          item.partName.toLowerCase().includes(q) ||
          item.partNumber.toLowerCase().includes(q) ||
          item.compatibleMake.toLowerCase().includes(q) ||
          item.compatibleModel.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q);
        if (!matches) return false;
      }

      if (conditionFilter !== 'All') {
        if (conditionFilter === 'OEM · New' && !item.condition.toLowerCase().includes('oem')) return false;
        if (conditionFilter === 'Aftermarket · New' && !item.condition.toLowerCase().includes('new') && !item.condition.toLowerCase().includes('aftermarket')) return false;
        if (conditionFilter === 'Used · Tested' && !item.condition.toLowerCase().includes('used') && !item.condition.toLowerCase().includes('tested')) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price_low') return a.priceGMD - b.priceGMD;
      if (sortBy === 'price_high') return b.priceGMD - a.priceGMD;
      return 0;
    });

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Breadcrumb from Figma Page 11 */}
        <div className="space-y-1">
          <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
            Home / Product listings
          </div>
          <h1 className="text-3xl font-black text-neutral-900 tracking-tight">
            Results
          </h1>
        </div>

        {/* Search Echo Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search part name or number"
            className="w-full bg-neutral-100/80 border border-neutral-200 rounded-2xl pl-11 pr-4 py-2.5 text-xs font-medium text-neutral-900 focus:outline-hidden focus:ring-1 focus:ring-neutral-900 focus:bg-white"
          />
        </div>

        {/* Garage Vehicle Pill */}
        <div className="p-3 bg-neutral-100 rounded-2xl border border-neutral-200/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-neutral-600" />
            <span className="font-extrabold text-neutral-900">Toyota Corolla 2010</span>
            <span className="text-neutral-500">1.6 petrol · My garage ⌄</span>
          </div>
          <span className="text-[11px] text-neutral-400">Filters applied</span>
        </div>

        {/* Results Bar: 12 results · Filters · 4 · Sort: Best fit */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-2">
          <div className="flex items-center gap-3">
            <span className="font-bold text-neutral-900">
              {filteredParts.length} results
            </span>
            <button
              onClick={() => setShowRefineModal(true)}
              className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-full font-semibold text-neutral-700 flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-3 h-3 text-neutral-500" />
              <span>Filters · 4</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-neutral-500">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-neutral-50 border border-neutral-200 rounded-xl px-2.5 py-1 text-xs font-semibold text-neutral-800 focus:outline-hidden"
            >
              <option value="best_fit">Best fit</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Two Column Grid matching Figma Page 11 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main 8 Cols: Product Cards Grid */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredParts.map((item) => {
                const photo = getPartPhoto(item.partName, item.image);
                const isSaved = savedIds.includes(item.id);

                return (
                  <div
                    key={item.id}
                    onClick={() => onSelectPart(item)}
                    className="bg-white rounded-3xl border border-neutral-200/90 shadow-2xs hover:shadow-md transition-all p-5 flex flex-col justify-between cursor-pointer group space-y-4"
                  >
                    <div>
                      {/* Photo Container with Heart */}
                      <div className="aspect-4/3 rounded-2xl bg-neutral-100 flex items-center justify-center p-4 border border-neutral-200/60 overflow-hidden relative">
                        <img
                          src={photo}
                          alt={item.partName}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                        <button
                          type="button"
                          onClick={(e) => toggleHeart(item.id, e)}
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
                          {item.condition}
                        </p>
                        <div className="pt-1">
                          <span className="font-mono font-black text-base text-neutral-900">
                            GMD {item.priceGMD.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400">
                          {item.dealerName}
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

            {/* Load more button */}
            <button
              onClick={() => {}}
              className="w-full py-3.5 bg-neutral-100 hover:bg-neutral-200/80 text-neutral-900 font-bold text-xs rounded-full transition-colors border border-neutral-200/70"
            >
              Load more parts
            </button>
          </div>

          {/* Right 4 Cols: Filters Sidebar (Figma Page 11) */}
          <div className="lg:col-span-4 sticky top-24 bg-neutral-50 rounded-3xl p-6 border border-neutral-200/80 space-y-6 text-xs">
            <h3 className="font-black text-base text-neutral-900">
              Filters · 4
            </h3>

            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider block">Vehicle</span>
                <p className="font-bold text-neutral-900">Toyota Corolla 2010 · 1.6 petrol</p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider block">Location</span>
                <p className="font-bold text-neutral-900">Serekunda + 10 km</p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider block">Brand</span>
                <p className="font-bold text-neutral-900">All brands</p>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider block">Condition</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['All', 'OEM · New', 'Aftermarket · New', 'Used · Tested'] as const).map((cond) => (
                    <button
                      key={cond}
                      onClick={() => setConditionFilter(cond)}
                      className={`px-2.5 py-1.5 rounded-xl text-center font-semibold text-[11px] transition-colors border ${
                        conditionFilter === cond
                          ? 'bg-neutral-900 text-white border-neutral-900'
                          : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setShowRefineModal(true)}
                  className="w-full py-2.5 bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-900 font-bold text-xs rounded-full transition-colors shadow-2xs"
                >
                  Refine filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note from Figma */}
        <div className="pt-4 text-center text-xs text-neutral-400">
          Prices are per set. Confirm your vehicle before buying.
        </div>
      </div>

      {/* --- Refine Search Modal (Figma Page 9) --- */}
      {showRefineModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-neutral-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
                  Home / Filters
                </span>
                <h2 className="text-2xl font-black text-neutral-900 mt-1">Refine your search</h2>
              </div>
              <button onClick={() => setShowRefineModal(false)} className="text-neutral-400 hover:text-neutral-900 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Left Column: Your Vehicle & Part Condition */}
              <div className="space-y-4">
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-3">
                  <h4 className="font-extrabold text-neutral-900">Your vehicle</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-neutral-400 text-[10px] block">Make</span>
                      <input defaultValue="Toyota" className="w-full px-2.5 py-1.5 bg-white border border-neutral-200 rounded-lg font-bold text-neutral-900" />
                    </div>
                    <div>
                      <span className="text-neutral-400 text-[10px] block">Model</span>
                      <input defaultValue="Corolla" className="w-full px-2.5 py-1.5 bg-white border border-neutral-200 rounded-lg font-bold text-neutral-900" />
                    </div>
                    <div>
                      <span className="text-neutral-400 text-[10px] block">Year</span>
                      <input defaultValue="2010" className="w-full px-2.5 py-1.5 bg-white border border-neutral-200 rounded-lg font-bold text-neutral-900" />
                    </div>
                    <div>
                      <span className="text-neutral-400 text-[10px] block">Engine</span>
                      <input defaultValue="1.6 petrol" className="w-full px-2.5 py-1.5 bg-white border border-neutral-200 rounded-lg font-bold text-neutral-900" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="font-bold text-neutral-700 block">Part condition</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(['All', 'OEM · New', 'Aftermarket · New', 'Used · Tested'] as const).map((cond) => (
                      <button
                        key={cond}
                        onClick={() => setConditionFilter(cond)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs ${
                          conditionFilter === cond
                            ? 'bg-neutral-900 text-white'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                      >
                        {cond}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Search Preferences */}
              <div className="space-y-4">
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-3">
                  <h4 className="font-extrabold text-neutral-900">Search preferences</h4>
                  <label className="flex items-center gap-2 font-medium text-neutral-800 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded accent-neutral-900" />
                    <span>Verified dealers only ✓</span>
                  </label>
                  <label className="flex items-center gap-2 font-medium text-neutral-800 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded accent-neutral-900" />
                    <span>In-stock parts only ✓</span>
                  </label>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => setShowRefineModal(false)}
                    className="w-full py-3.5 bg-neutral-900 hover:bg-black text-white font-bold text-xs rounded-full transition-colors shadow-xs"
                  >
                    Show {filteredParts.length} parts
                  </button>
                  <button
                    onClick={() => {
                      setConditionFilter('All');
                      setSearchTerm('');
                    }}
                    className="w-full py-2.5 text-center text-xs text-neutral-500 hover:text-neutral-900 font-medium"
                  >
                    Clear filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
