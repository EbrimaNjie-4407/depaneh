import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Shield,
  Wrench,
  Store,
  ChevronDown,
  Check,
  X,
  Truck,
  Heart,
  MessageSquare,
  MapPin,
  Car,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { marketplaceStore } from '../../services/store';
import { UserRole } from '../../types';
import {
  COMMON_PARTS,
  QUICK_FILTERS,
  QuickFilter,
  getAvailableModels,
  getCanonicalMakeName,
} from '../../data/vehicleData';
import { decodeVin, SAMPLE_VINS, VinDecodeResult } from '../../services/vinDecoder';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export function Header({ currentView, onNavigate }: HeaderProps) {
  const store = useStore();
  const role = store.currentRole;

  const [partQuery, setPartQuery] = useState(store.searchQuery.part);
  const [makeQuery, setMakeQuery] = useState(store.searchQuery.make);
  const [modelQuery, setModelQuery] = useState(store.searchQuery.model);
  const [yearQuery, setYearQuery] = useState(store.searchQuery.year);
  const [vinQuery, setVinQuery] = useState(store.searchQuery.vin);
  const [vinDecodeResult, setVinDecodeResult] = useState<VinDecodeResult | null>(null);

  const [isPartsDropdownOpen, setIsPartsDropdownOpen] = useState(false);
  const [isMakeDropdownOpen, setIsMakeDropdownOpen] = useState(false);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isVinSamplesOpen, setIsVinSamplesOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
  const [isGarageMenuOpen, setIsGarageMenuOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Serekunda, The Gambia');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const makeDropdownRef = useRef<HTMLDivElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const vinDropdownRef = useRef<HTMLDivElement>(null);
  const roleMenuRef = useRef<HTMLDivElement>(null);
  const locationMenuRef = useRef<HTMLDivElement>(null);
  const garageMenuRef = useRef<HTMLDivElement>(null);

  const availableModels = getAvailableModels(makeQuery);

  const handleSelectMake = (makeName: string) => {
    setMakeQuery(makeName);
    setIsMakeDropdownOpen(false);
    const models = getAvailableModels(makeName);
    if (models.length > 0) {
      setModelQuery(models[0]);
    } else {
      setModelQuery('');
    }
    setIsModelDropdownOpen(true);
  };

  const handleMakeInputChange = (val: string) => {
    setMakeQuery(val);
    const canonical = getCanonicalMakeName(val);
    if (canonical) {
      const models = getAvailableModels(canonical);
      if (models.length > 0 && !models.some((m) => m.toLowerCase() === modelQuery.toLowerCase())) {
        setModelQuery(models[0]);
      }
    }
  };

  const handleSelectModel = (modelName: string) => {
    setModelQuery(modelName);
    setIsModelDropdownOpen(false);
  };

  const handleVinInputChange = (rawVal: string) => {
    const upperVal = rawVal.toUpperCase();
    setVinQuery(upperVal);

    if (upperVal.trim().length >= 4) {
      const decoded = decodeVin(upperVal);
      if (decoded && decoded.make) {
        setVinDecodeResult(decoded);
        setMakeQuery(decoded.make);
        if (decoded.model) {
          setModelQuery(decoded.model);
        }
        if (decoded.year) {
          setYearQuery(decoded.year);
        }
      } else {
        setVinDecodeResult(null);
      }
    } else {
      setVinDecodeResult(null);
    }
  };

  const handleSelectSampleVin = (vin: string) => {
    setVinQuery(vin);
    setIsVinSamplesOpen(false);
    const decoded = decodeVin(vin);
    if (decoded && decoded.make) {
      setVinDecodeResult(decoded);
      setMakeQuery(decoded.make);
      if (decoded.model) setModelQuery(decoded.model);
      if (decoded.year) setYearQuery(decoded.year);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    marketplaceStore.setSearchQuery({
      part: partQuery,
      make: makeQuery,
      model: modelQuery,
      year: yearQuery,
      vin: vinQuery,
    });
    if (role === 'mechanic') {
      onNavigate('browse_all_parts');
    } else if (role === 'dealer') {
      onNavigate('dealer_inventory');
    } else {
      onNavigate('admin_listings');
    }
  };

  const handleRoleChange = (newRole: UserRole) => {
    marketplaceStore.setRole(newRole);
    setIsRoleMenuOpen(false);
    if (newRole === 'mechanic') onNavigate('dealers');
    if (newRole === 'dealer') onNavigate('dealer_dashboard');
    if (newRole === 'delivery_rider') onNavigate('delivery_dashboard');
    if (newRole === 'admin') onNavigate('admin_dashboard');
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsPartsDropdownOpen(false);
      }
      if (makeDropdownRef.current && !makeDropdownRef.current.contains(e.target as Node)) {
        setIsMakeDropdownOpen(false);
      }
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(e.target as Node)) {
        setIsModelDropdownOpen(false);
      }
      if (vinDropdownRef.current && !vinDropdownRef.current.contains(e.target as Node)) {
        setIsVinSamplesOpen(false);
      }
      if (roleMenuRef.current && !roleMenuRef.current.contains(e.target as Node)) {
        setIsRoleMenuOpen(false);
      }
      if (locationMenuRef.current && !locationMenuRef.current.contains(e.target as Node)) {
        setIsLocationMenuOpen(false);
      }
      if (garageMenuRef.current && !garageMenuRef.current.contains(e.target as Node)) {
        setIsGarageMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadNotifs = store.notifications.filter((n) => !n.read && n.targetRole === role).length;

  const roleLabels: Record<UserRole, string> = {
    mechanic: 'Buyer',
    owner: 'Buyer',
    dealer: 'Dealer',
    delivery_rider: 'Rider',
    admin: 'Admin',
  };

  // Primary navigation items for Buyer/Mechanic as per Figma Pages 5–13
  const buyerNavItems = [
    { id: 'landing', label: 'Home', isDot: currentView === 'landing' },
    {
      id: 'browse_all_parts',
      label: 'Search',
      isDot: currentView === 'browse_all_parts' || currentView === 'search',
    },
    { id: 'requests', label: 'Requests', isDot: currentView === 'requests' || currentView === 'create_request' },
    { id: 'deliveries', label: 'Orders', isDot: currentView === 'deliveries' || currentView === 'checkout_pickup' },
    { id: 'profile', label: 'Profile', isDot: currentView === 'profile' },
    { id: 'categories', label: 'Categories', isDot: currentView === 'categories' },
    { id: 'dealers', label: 'See dealers', isDot: currentView === 'dealers' || currentView === 'dealer_browse' },
    { id: 'garage', label: 'My garage', isDot: currentView === 'garage' },
  ];

  const isBuyerRole = role === 'mechanic' || role === 'owner';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200/90 text-neutral-900 select-none shadow-2xs">
      {/* Top Bar: DEPANEH. Logo, Location, Saved, Messages, Alerts, Role */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Wordmark + Location Dropdown */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div
            onClick={() => onNavigate(isBuyerRole ? 'dealers' : role === 'dealer' ? 'dealer_dashboard' : role === 'delivery_rider' ? 'delivery_dashboard' : 'admin_dashboard')}
            className="cursor-pointer group flex items-baseline gap-1"
          >
            <span className="font-black text-2xl lg:text-3xl tracking-tight text-neutral-900 group-hover:text-black">
              DEPANEH.
            </span>
          </div>

          {/* Location Selector */}
          <div ref={locationMenuRef} className="relative hidden sm:block">
            <button
              onClick={() => setIsLocationMenuOpen((v) => !v)}
              className="flex items-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-900 font-medium py-1 px-2 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
              <span>{selectedLocation}</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {isLocationMenuOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-52 bg-white rounded-2xl border border-neutral-200 shadow-xl py-2 z-50 text-xs">
                <div className="px-3 py-1 font-bold text-neutral-400 uppercase text-[10px] tracking-wider">
                  Select Region (The Gambia)
                </div>
                {[
                  'Serekunda, The Gambia',
                  'Jeshwang Industrial Hub',
                  'Westfield, Kanifing',
                  'Bakau & Cape Point',
                  'Brikama & West Coast',
                  'Banjul Island',
                ].map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      setSelectedLocation(loc);
                      setIsLocationMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-neutral-50 flex items-center justify-between ${
                      selectedLocation === loc ? 'font-bold text-neutral-900 bg-neutral-50' : 'text-neutral-600'
                    }`}
                  >
                    <span>{loc}</span>
                    {selectedLocation === loc && <Check className="w-3.5 h-3.5 text-neutral-900" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Saved, Messages, Alerts, User Role */}
        <div className="flex items-center gap-2 sm:gap-4 text-xs font-medium text-neutral-700">
          {/* Saved Items */}
          <button
            onClick={() => onNavigate('browse_all_parts')}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
            title="Saved Parts"
          >
            <Heart className="w-3.5 h-3.5 text-neutral-500" />
            <span>Saved</span>
          </button>

          {/* Messages */}
          <button
            onClick={() => onNavigate('deliveries')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
            title="Messages"
          >
            <MessageSquare className="w-3.5 h-3.5 text-neutral-500" />
            <span className="hidden sm:inline">Messages</span>
          </button>

          {/* Alerts */}
          <button
            onClick={() => onNavigate(role === 'dealer' ? 'dealer_notifications' : 'notifications')}
            className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
            title="Notifications & Alerts"
          >
            <Bell className="w-3.5 h-3.5 text-neutral-500" />
            <span className="hidden sm:inline">Alerts</span>
            {unreadNotifs > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500" />
            )}
          </button>

          {/* Role Dropdown */}
          <div ref={roleMenuRef} className="relative">
            <button
              onClick={() => setIsRoleMenuOpen((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200/80 text-neutral-900 rounded-full font-semibold transition-colors"
            >
              <span>{roleLabels[role]}</span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
            </button>

            {isRoleMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl border border-neutral-200 shadow-2xl py-2 z-50 text-xs">
                <div className="px-3 py-1.5 border-b border-neutral-100 font-bold text-neutral-400 uppercase text-[10px] tracking-wider">
                  Switch Workspace
                </div>

                <button
                  onClick={() => handleRoleChange('mechanic')}
                  className={`w-full text-left px-3.5 py-2.5 hover:bg-neutral-50 flex items-center gap-3 transition-colors ${
                    isBuyerRole ? 'font-bold text-neutral-900 bg-neutral-50' : 'text-neutral-700'
                  }`}
                >
                  <Wrench className="w-4 h-4 text-neutral-500" />
                  <div>
                    <div className="font-semibold">Buyer / Mechanic</div>
                    <div className="text-[10px] text-neutral-400 font-normal">Browse parts, requests & orders</div>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleChange('dealer')}
                  className={`w-full text-left px-3.5 py-2.5 hover:bg-neutral-50 flex items-center gap-3 transition-colors ${
                    role === 'dealer' ? 'font-bold text-neutral-900 bg-neutral-50' : 'text-neutral-700'
                  }`}
                >
                  <Store className="w-4 h-4 text-neutral-500" />
                  <div>
                    <div className="font-semibold">Dealer Workspace</div>
                    <div className="text-[10px] text-neutral-400 font-normal">Manage inventory & quotes</div>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleChange('delivery_rider')}
                  className={`w-full text-left px-3.5 py-2.5 hover:bg-neutral-50 flex items-center gap-3 transition-colors ${
                    role === 'delivery_rider' ? 'font-bold text-neutral-900 bg-neutral-50' : 'text-neutral-700'
                  }`}
                >
                  <Truck className="w-4 h-4 text-neutral-500" />
                  <div>
                    <div className="font-semibold">Delivery Rider</div>
                    <div className="text-[10px] text-neutral-400 font-normal">Active dispatches & wallet</div>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleChange('admin')}
                  className={`w-full text-left px-3.5 py-2.5 hover:bg-neutral-50 flex items-center gap-3 transition-colors ${
                    role === 'admin' ? 'font-bold text-neutral-900 bg-neutral-50' : 'text-neutral-700'
                  }`}
                >
                  <Shield className="w-4 h-4 text-neutral-500" />
                  <div>
                    <div className="font-semibold">Administrator</div>
                    <div className="text-[10px] text-neutral-400 font-normal">Dealer verification & moderation</div>
                  </div>
                </button>

                <div className="border-t border-neutral-100 my-1 pt-1">
                  <button
                    onClick={() => {
                      setIsRoleMenuOpen(false);
                      onNavigate('landing');
                    }}
                    className="w-full text-left px-3.5 py-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
                  >
                    Return to Landing Page
                  </button>
                  <button
                    onClick={() => {
                      setIsRoleMenuOpen(false);
                      onNavigate('choose_role');
                    }}
                    className="w-full text-left px-3.5 py-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
                  >
                    Select Role Screen
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Second Row: Nav Items + Global Search (only for buyer/mechanic role as in Figma Pages 5–13) */}
      {isBuyerRole && (
        <div className="border-t border-neutral-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Horizontal Nav Links */}
            <nav className="flex items-center gap-4 sm:gap-6 text-xs font-medium text-neutral-600 overflow-x-auto no-scrollbar py-0.5">
              {buyerNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    item.isDot
                      ? 'font-bold text-neutral-900'
                      : 'hover:text-neutral-900 text-neutral-600'
                  }`}
                >
                  {item.isDot && <span className="text-[10px] text-neutral-900">●</span>}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Garage vehicle badge */}
            <div ref={garageMenuRef} className="relative shrink-0">
              <button
                onClick={() => setIsGarageMenuOpen((v) => !v)}
                className="flex items-center gap-2 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200/80 px-3 py-1.5 rounded-full transition-colors"
              >
                <Car className="w-3.5 h-3.5 text-neutral-600" />
                <span>Toyota Corolla 2010 · 1.6 petrol · My garage</span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>

              {isGarageMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-64 bg-white rounded-2xl border border-neutral-200 shadow-xl py-2 z-50 text-xs">
                  <div className="px-3 py-1 font-bold text-neutral-400 uppercase text-[10px] tracking-wider">
                    Saved Garage Vehicles
                  </div>
                  <div className="p-3 bg-neutral-50 m-2 rounded-xl border border-neutral-200/60">
                    <div className="font-bold text-neutral-900">Toyota Corolla (2010)</div>
                    <div className="text-[11px] text-neutral-500">1.6L Petrol · Front axle</div>
                    <div className="text-[10px] text-emerald-700 font-semibold mt-1">✓ Primary vehicle</div>
                  </div>
                  <button
                    onClick={() => {
                      setIsGarageMenuOpen(false);
                      onNavigate('garage');
                    }}
                    className="w-full text-left px-3 py-2 text-neutral-700 hover:bg-neutral-50 font-medium"
                  >
                    + Add or change vehicle
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Multi-Field Search Bar (Matching Figma Page 5 & 6) */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3">
            <form
              onSubmit={handleSearchSubmit}
              className="bg-neutral-100 rounded-2xl p-1.5 border border-neutral-200/80 flex flex-col md:flex-row items-stretch md:items-center gap-1.5 text-xs"
            >
              {/* Part Name with Dropdown */}
              <div ref={dropdownRef} className="relative flex-1">
                <input
                  type="text"
                  placeholder="Part Name:"
                  value={partQuery}
                  onChange={(e) => setPartQuery(e.target.value)}
                  onFocus={() => setIsPartsDropdownOpen(true)}
                  className="w-full bg-white pl-3 pr-8 py-2 rounded-xl text-xs text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:ring-1 focus:ring-neutral-900 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setIsPartsDropdownOpen((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                >
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isPartsDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isPartsDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1.5 w-72 bg-white rounded-2xl border border-neutral-200 shadow-xl z-50 py-2 max-h-72 overflow-y-auto">
                    <div className="px-3 py-1 font-bold text-neutral-400 uppercase text-[10px] tracking-wider">
                      Popular Parts
                    </div>
                    {COMMON_PARTS.slice(0, 8).map((p) => (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => {
                          setPartQuery(p.name);
                          setIsPartsDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-neutral-50 flex items-center justify-between"
                      >
                        <span className="font-medium text-neutral-800">{p.name}</span>
                        <span className="text-[10px] text-neutral-400 font-mono">#{p.code}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Vehicle Make */}
              <div ref={makeDropdownRef} className="relative w-full md:w-36">
                <input
                  type="text"
                  placeholder="Vehicle Make:"
                  value={makeQuery}
                  onChange={(e) => handleMakeInputChange(e.target.value)}
                  onFocus={() => setIsMakeDropdownOpen(true)}
                  className="w-full bg-white pl-3 pr-7 py-2 rounded-xl text-xs text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:ring-1 focus:ring-neutral-900 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setIsMakeDropdownOpen((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                >
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMakeDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isMakeDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1.5 w-48 bg-white rounded-2xl border border-neutral-200 shadow-xl z-50 py-2 max-h-60 overflow-y-auto">
                    {['Toyota', 'Mercedes-Benz', 'Nissan', 'Honda', 'Hyundai', 'Ford', 'Mitsubishi', 'Kia'].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => handleSelectMake(m)}
                        className="w-full text-left px-3 py-1.5 hover:bg-neutral-50 font-medium text-neutral-800"
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Vehicle Model */}
              <div ref={modelDropdownRef} className="relative w-full md:w-36">
                <input
                  type="text"
                  placeholder="Vehicle Model:"
                  value={modelQuery}
                  onChange={(e) => setModelQuery(e.target.value)}
                  onFocus={() => setIsModelDropdownOpen(true)}
                  className="w-full bg-white pl-3 pr-7 py-2 rounded-xl text-xs text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:ring-1 focus:ring-neutral-900 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setIsModelDropdownOpen((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                >
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isModelDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isModelDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1.5 w-44 bg-white rounded-2xl border border-neutral-200 shadow-xl z-50 py-2 max-h-60 overflow-y-auto">
                    {(availableModels.length > 0 ? availableModels : ['Corolla', 'Camry', 'RAV4', 'Hilux', 'Yaris']).map((mod) => (
                      <button
                        key={mod}
                        type="button"
                        onClick={() => handleSelectModel(mod)}
                        className="w-full text-left px-3 py-1.5 hover:bg-neutral-50 font-medium text-neutral-800"
                      >
                        {mod}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Vehicle Year */}
              <div className="w-full md:w-28">
                <input
                  type="text"
                  placeholder="Vehicle Year:"
                  value={yearQuery}
                  onChange={(e) => setYearQuery(e.target.value)}
                  className="w-full bg-white px-3 py-2 rounded-xl text-xs text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:ring-1 focus:ring-neutral-900 font-medium"
                />
              </div>

              {/* VIN */}
              <div ref={vinDropdownRef} className="relative w-full md:w-36">
                <input
                  type="text"
                  placeholder="VIN:"
                  value={vinQuery}
                  onChange={(e) => handleVinInputChange(e.target.value)}
                  className="w-full bg-white px-3 py-2 rounded-xl text-xs text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:ring-1 focus:ring-neutral-900 font-mono font-medium"
                />
                <button
                  type="button"
                  onClick={() => setIsVinSamplesOpen((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 text-[10px] font-bold"
                  title="Sample VINs"
                >
                  VINs
                </button>

                {isVinSamplesOpen && (
                  <div className="absolute top-full right-0 mt-1.5 w-72 bg-white rounded-2xl border border-neutral-200 shadow-xl z-50 py-2">
                    <div className="px-3 py-1 font-bold text-neutral-400 uppercase text-[10px] tracking-wider">
                      Click to Test Sample VIN
                    </div>
                    {SAMPLE_VINS.slice(0, 4).map((s) => (
                      <button
                        key={s.vin}
                        type="button"
                        onClick={() => handleSelectSampleVin(s.vin)}
                        className="w-full text-left px-3 py-1.5 hover:bg-neutral-50 text-xs"
                      >
                        <div className="font-mono font-bold text-neutral-900">{s.vin}</div>
                        <div className="text-[10px] text-neutral-500">{s.make} {s.model} ({s.year})</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Button (Black Solid as in Figma) */}
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-2 bg-neutral-900 hover:bg-black text-white font-semibold rounded-xl text-xs transition-colors shrink-0 shadow-2xs flex items-center justify-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
