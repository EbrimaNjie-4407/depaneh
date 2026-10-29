import React, { useState } from 'react';
import {
  Car,
  Wrench,
  Store,
  Truck,
  ArrowRight,
  Shield,
  CheckCircle2,
  MapPin,
  ChevronDown,
} from 'lucide-react';
import { UserRole } from '../../types';
import { DeliveryRiderSignUpModal } from '../delivery/DeliveryRiderSignUpModal';

interface ChooseRolePageProps {
  onSelectRole: (role: UserRole) => void;
  onNavigate: (view: string) => void;
}

export function ChooseRolePage({ onSelectRole, onNavigate }: ChooseRolePageProps) {
  const [isRiderModalOpen, setIsRiderModalOpen] = useState(false);

  const handleRiderSignUpSuccess = () => {
    setIsRiderModalOpen(false);
    onSelectRole('delivery_rider');
    onNavigate('delivery_dashboard');
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans flex flex-col justify-between selection:bg-neutral-900 selection:text-white">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-neutral-200/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div
            onClick={() => onNavigate('landing')}
            className="cursor-pointer font-black text-2xl lg:text-3xl tracking-tight text-neutral-900"
          >
            DEPANEH.
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-neutral-600">
            <button
              onClick={() => onNavigate('landing')}
              className="hover:text-neutral-900 transition-colors"
            >
              Back to Home
            </button>
            <button
              onClick={() => {
                onSelectRole('admin');
                onNavigate('admin_dashboard');
              }}
              className="px-3.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-full font-semibold transition-colors flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 w-full space-y-10">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
            SPARE PARTS. LOCAL CONNECTIONS.
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
            Choose your workspace
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600">
            Select your role to access your dedicated dashboard, features, and tools across The Gambia.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {/* Card 1: Buyer / Owner */}
          <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-xs hover:border-neutral-400 transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-neutral-100 text-neutral-900 flex items-center justify-center">
                <Car className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-extrabold text-neutral-900">
                Buyer & Vehicle Owner
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Find parts by VIN or vehicle model, check compatibility, compare verified dealer quotes, and track deliveries.
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-100 space-y-2 text-[11px] text-neutral-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-neutral-800" />
                <span>OEM & Aftermarket catalog</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-neutral-800" />
                <span>Shop pickup or express delivery</span>
              </div>
            </div>

            <button
              onClick={() => {
                onSelectRole('mechanic');
                onNavigate('dealers');
              }}
              className="w-full py-3 bg-neutral-900 hover:bg-black text-white font-bold text-xs rounded-full transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Continue as Buyer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Mechanic */}
          <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-xs hover:border-neutral-400 transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-neutral-100 text-neutral-900 flex items-center justify-center">
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-extrabold text-neutral-900">
                Workshop Mechanic
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Submit part requests with photos and voice notes, receive competitive dealer offers, and inspect parts upon arrival.
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-100 space-y-2 text-[11px] text-neutral-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-neutral-800" />
                <span>Voice notes & photo requests</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-neutral-800" />
                <span>Multi-dealer quote comparison</span>
              </div>
            </div>

            <button
              onClick={() => {
                onSelectRole('mechanic');
                onNavigate('dealers');
              }}
              className="w-full py-3 bg-neutral-900 hover:bg-black text-white font-bold text-xs rounded-full transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Continue as Mechanic</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Spare-Parts Dealer */}
          <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-xs hover:border-neutral-400 transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-neutral-100 text-neutral-900 flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-extrabold text-neutral-900">
                Spare-Parts Dealer
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Manage your shop inventory, respond to incoming buyer requests, send formal quotations, and fulfill orders.
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-100 space-y-2 text-[11px] text-neutral-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-neutral-800" />
                <span>Inventory & stock management</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-neutral-800" />
                <span>Official verification badge</span>
              </div>
            </div>

            <button
              onClick={() => {
                onSelectRole('dealer');
                onNavigate('dealer_dashboard');
              }}
              className="w-full py-3 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-900 font-bold text-xs rounded-full transition-colors flex items-center justify-center gap-2"
            >
              <span>Dealer Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 4: Delivery Rider (Section 8 Mandatory Interface) */}
          <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-xs hover:border-neutral-400 transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-neutral-100 text-neutral-900 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-extrabold text-neutral-900">
                Delivery Rider
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Accept parts dispatches from dealer shops to customer workshops, verify handovers with PIN codes, and earn payouts.
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-100 space-y-2 text-[11px] text-neutral-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-neutral-800" />
                <span>Instant Wave / QMoney payouts</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-neutral-800" />
                <span>Protected PIN handover system</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  onSelectRole('delivery_rider');
                  onNavigate('delivery_dashboard');
                }}
                className="w-full py-3 bg-neutral-900 hover:bg-black text-white font-bold text-xs rounded-full transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <span>Rider Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsRiderModalOpen(true)}
                className="w-full py-2 text-center text-xs text-neutral-500 hover:text-neutral-900 font-medium"
              >
                Sign up as new rider →
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200/90 py-6 text-center text-xs text-neutral-500 bg-white">
        <p>DEPANEH · The Gambia · Illustrative accounts and transactions · Terms & privacy</p>
      </footer>

      {/* Rider Modal */}
      <DeliveryRiderSignUpModal
        isOpen={isRiderModalOpen}
        onClose={() => setIsRiderModalOpen(false)}
        onSuccess={handleRiderSignUpSuccess}
      />
    </div>
  );
}
