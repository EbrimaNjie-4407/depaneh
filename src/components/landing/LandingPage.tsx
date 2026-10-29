import React, { useState } from 'react';
import {
  ArrowRight,
  Search,
  Check,
  ChevronDown,
  X,
  ShieldCheck,
  Truck,
  Wrench,
  Store,
  MapPin,
  Lock,
  Phone,
  User,
} from 'lucide-react';
import heroImg from '../../assets/images/hero_mechanic_workshop_1791849519785.jpg';

interface LandingPageProps {
  onNavigate: (view: string) => void;
  onSelectRole: (role: 'mechanic' | 'dealer' | 'admin' | 'delivery_rider') => void;
}

export function LandingPage({ onNavigate, onSelectRole }: LandingPageProps) {
  const [modalType, setModalType] = useState<'signin' | 'signup' | 'verify' | null>(null);
  const [signupRole, setSignupRole] = useState<'buyer' | 'mechanic' | 'rider'>('buyer');
  const [phoneInput, setPhoneInput] = useState('+220 700 1234');
  const [passwordInput, setPasswordInput] = useState('••••••••••');
  const [nameInput, setNameInput] = useState('Awa Touray');
  const [locationInput, setLocationInput] = useState('Serekunda');
  const [verifyOtp, setVerifyOtp] = useState(['4', '8', '2', '1', '6', '9']);

  const handleOpenSignIn = () => setModalType('signin');
  const handleOpenSignUp = (initialRole: 'buyer' | 'mechanic' | 'rider' = 'buyer') => {
    setSignupRole(initialRole);
    setModalType('signup');
  };

  const handleCompleteSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setModalType('verify');
  };

  const handleVerifyPhone = (e: React.FormEvent) => {
    e.preventDefault();
    setModalType(null);
    if (signupRole === 'rider') {
      onSelectRole('delivery_rider');
    } else {
      onSelectRole('mechanic');
    }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans flex flex-col justify-between selection:bg-neutral-900 selection:text-white">
      {/* Top Navigation from Figma Page 1 */}
      <nav className="border-b border-neutral-200/90 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-black text-2xl lg:text-3xl tracking-tight text-neutral-900">
              DEPANEH.
            </span>
            <div className="hidden sm:flex items-center gap-1 text-xs text-neutral-600 font-medium">
              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
              <span>Serekunda, The Gambia</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-neutral-600">
            <button onClick={() => onNavigate('dealers')} className="hover:text-neutral-900">
              Saved
            </button>
            <button onClick={() => onNavigate('deliveries')} className="hover:text-neutral-900">
              Messages
            </button>
            <button onClick={() => onNavigate('notifications')} className="hover:text-neutral-900">
              Alerts
            </button>
            <button
              onClick={() => onNavigate('choose_role')}
              className="flex items-center gap-1 font-semibold text-neutral-900 hover:text-black"
            >
              <span>Buyer</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area matching Page 1 of Figma */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 flex-1 w-full space-y-8">
        {/* Breadcrumb & Section Header */}
        <div className="space-y-1">
          <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
            SPARE PARTS. LOCAL CONNECTIONS. / Onboarding
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-neutral-900 tracking-tight">
            Find the part. Get back to it.
          </h1>
        </div>

        {/* Two-Column Split Layout from Figma Page 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Visual Mechanic Feature Card */}
          <div className="lg:col-span-7 relative rounded-3xl overflow-hidden shadow-sm bg-neutral-950 text-white min-h-[440px] flex flex-col justify-end p-8 sm:p-12">
            {/* Background Image with Dark Vignette */}
            <div className="absolute inset-0 z-0">
              <img
                src={heroImg}
                alt="Automotive workshop mechanic"
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30" />
            </div>

            <div className="relative z-10 space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.08] text-white">
                  EVERYTHING <br />
                  YOUR VEHICLE <br />
                  NEEDS, <span className="text-neutral-300">IN ONE PLACE.</span>
                </h2>
                <p className="text-sm sm:text-base font-medium text-neutral-300 tracking-wide pt-1">
                  Mechanics · Parts · Delivery
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    onSelectRole('mechanic');
                    onNavigate('create_request');
                  }}
                  className="px-6 py-3 bg-white text-neutral-900 hover:bg-neutral-100 font-bold text-xs rounded-full transition-all shadow-sm flex items-center gap-2"
                >
                  <span>Request a mechanic</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    onSelectRole('mechanic');
                    onNavigate('browse_all_parts');
                  }}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-full transition-all shadow-sm flex items-center gap-2"
                >
                  <span>Buy parts</span>
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Built for the right fit & Role actions */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8 lg:py-2">
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
                Built for the right fit.
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                From brake pads to alternators, find the right fit from trusted dealers across The Gambia.
              </p>
            </div>

            {/* Middle Feature Capsule Card from Figma */}
            <div className="p-5 bg-neutral-100/90 rounded-2xl border border-neutral-200/70 space-y-1">
              <div className="font-bold text-xs text-neutral-900">
                Verified dealers. Clear prices. Better choices.
              </div>
              <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                SPARE PARTS. LOCAL CONNECTIONS.
              </div>
            </div>

            {/* Role Action Buttons (Black Solid and White Bordered as in Figma) */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  onSelectRole('mechanic');
                  onNavigate('dealers');
                }}
                className="w-full py-3.5 px-6 bg-neutral-900 hover:bg-black text-white font-bold text-xs rounded-full transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <span>I’m buying / I’m a mechanic</span>
              </button>

              <button
                onClick={() => {
                  onSelectRole('dealer');
                  onNavigate('dealer_dashboard');
                }}
                className="w-full py-3.5 px-6 bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-900 font-bold text-xs rounded-full transition-colors flex items-center justify-center gap-2"
              >
                <span>I’m a spare-parts dealer</span>
              </button>

              <button
                onClick={() => {
                  onSelectRole('delivery_rider');
                  onNavigate('delivery_dashboard');
                }}
                className="w-full py-3 px-6 bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-700 font-medium text-xs rounded-full transition-colors flex items-center justify-center gap-2"
              >
                <Truck className="w-3.5 h-3.5 text-neutral-500" />
                <span>Sign up as a delivery rider</span>
              </button>
            </div>

            {/* Sign in and Terms */}
            <div className="space-y-2 pt-2 text-center sm:text-left">
              <p className="text-xs text-neutral-600">
                Already on Depaneh?{' '}
                <button
                  onClick={handleOpenSignIn}
                  className="font-bold text-neutral-900 hover:underline"
                >
                  Sign in
                </button>
              </p>
              <p className="text-[11px] text-neutral-400">
                By continuing, you agree to our Terms and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer matching Figma */}
      <footer className="border-t border-neutral-200/90 py-6 text-center text-xs text-neutral-500 bg-white">
        <p>DEPANEH concept · The Gambia · Illustrative accounts and transactions · Terms & privacy</p>
      </footer>

      {/* --- Sign In Modal (Figma Page 2) --- */}
      {modalType === 'signin' && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-neutral-200 shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
                  SPARE PARTS. LOCAL CONNECTIONS. / Sign in
                </span>
                <h2 className="text-2xl font-black text-neutral-900 mt-1">Your next fix starts here.</h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Sign in to save parts, compare offers and keep your orders together.
                </p>
              </div>
              <button onClick={() => setModalType(null)} className="text-neutral-400 hover:text-neutral-900 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setModalType(null);
                onSelectRole('mechanic');
              }}
              className="space-y-4 text-xs"
            >
              <div className="space-y-1.5">
                <label className="font-bold text-neutral-700">Phone number</label>
                <input
                  type="text"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="+220 700 1234"
                  className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-2xl text-xs font-mono font-medium focus:outline-hidden focus:border-neutral-900"
                />
                <span className="text-[11px] text-neutral-400 block">Use the number registered with Depaneh.</span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-neutral-700">Password</label>
                  <button type="button" className="text-neutral-500 hover:text-neutral-900 text-[11px]">
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-2xl text-xs font-mono font-medium focus:outline-hidden focus:border-neutral-900"
                />
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-neutral-900 hover:bg-black text-white font-bold text-xs rounded-full transition-colors shadow-xs"
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenSignUp('buyer')}
                  className="w-full py-3 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-900 font-bold text-xs rounded-full transition-colors"
                >
                  Create an account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Create Account Modal (Figma Page 3) --- */}
      {modalType === 'signup' && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-neutral-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
                  SPARE PARTS. LOCAL CONNECTIONS. / Create account
                </span>
                <h2 className="text-2xl font-black text-neutral-900 mt-1">Good parts. Great connections.</h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Join Depaneh as a buyer, mechanic, or delivery rider.
                </p>
              </div>
              <button onClick={() => setModalType(null)} className="text-neutral-400 hover:text-neutral-900 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Account Type Tabs from Figma */}
            <div className="flex items-center gap-2 border-b border-neutral-200 pb-3 text-xs font-bold">
              <button
                type="button"
                onClick={() => setSignupRole('buyer')}
                className={`pb-1 px-3 border-b-2 transition-colors ${
                  signupRole === 'buyer'
                    ? 'border-neutral-900 text-neutral-900'
                    : 'border-transparent text-neutral-400 hover:text-neutral-700'
                }`}
              >
                Buyer
              </button>
              <button
                type="button"
                onClick={() => setSignupRole('mechanic')}
                className={`pb-1 px-3 border-b-2 transition-colors ${
                  signupRole === 'mechanic'
                    ? 'border-neutral-900 text-neutral-900'
                    : 'border-transparent text-neutral-400 hover:text-neutral-700'
                }`}
              >
                Mechanic
              </button>
              <button
                type="button"
                onClick={() => setSignupRole('rider')}
                className={`pb-1 px-3 border-b-2 transition-colors ${
                  signupRole === 'rider'
                    ? 'border-neutral-900 text-neutral-900'
                    : 'border-transparent text-neutral-400 hover:text-neutral-700'
                }`}
              >
                Delivery Rider
              </button>
            </div>

            <form onSubmit={handleCompleteSignUp} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-neutral-700">Full name</label>
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-2xl text-xs font-medium focus:outline-hidden focus:border-neutral-900"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-neutral-700">Phone number</label>
                  <input
                    type="text"
                    required
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-2xl text-xs font-mono font-medium focus:outline-hidden focus:border-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-neutral-700">Password</label>
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-2xl text-xs font-mono font-medium focus:outline-hidden focus:border-neutral-900"
                  />
                  <span className="text-[10px] text-neutral-400 block">At least 8 characters.</span>
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-neutral-700">Location</label>
                  <input
                    type="text"
                    required
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-2xl text-xs font-medium focus:outline-hidden focus:border-neutral-900"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="terms" required defaultChecked className="rounded accent-neutral-900" />
                <label htmlFor="terms" className="text-[11px] text-neutral-600">
                  I agree to the Terms of Service and Privacy Policy.
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-neutral-900 hover:bg-black text-white font-bold text-xs rounded-full transition-colors shadow-xs"
              >
                Create account
              </button>

              <div className="text-center pt-1">
                <span className="text-xs text-neutral-500">Already have an account? </span>
                <button
                  type="button"
                  onClick={handleOpenSignIn}
                  className="text-xs font-bold text-neutral-900 hover:underline"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Phone Verification Modal (Figma Page 4) --- */}
      {modalType === 'verify' && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-neutral-200 shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95">
            <div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
                SPARE PARTS. LOCAL CONNECTIONS. / Verify phone
              </span>
              <h2 className="text-2xl font-black text-neutral-900 mt-1">One quick check.</h2>
              <p className="text-xs text-neutral-500 mt-1">
                Enter the 6-digit code sent to {phoneInput}. It helps keep your account yours.
              </p>
            </div>

            <form onSubmit={handleVerifyPhone} className="space-y-6 text-xs">
              <div className="space-y-2">
                <label className="font-bold text-neutral-700 block">Verify your number</label>
                <div className="grid grid-cols-6 gap-2">
                  {verifyOtp.map((digit, idx) => (
                    <input
                      key={idx}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => {
                        const next = [...verifyOtp];
                        next[idx] = e.target.value;
                        setVerifyOtp(next);
                      }}
                      className="w-full text-center py-3 bg-neutral-50 border border-neutral-300 rounded-2xl text-base font-bold font-mono text-neutral-900 focus:outline-hidden focus:border-neutral-900 focus:bg-white"
                    />
                  ))}
                </div>
                <span className="text-[11px] text-neutral-400 block pt-1">Code expires in 04:32</span>
              </div>

              <div className="space-y-2.5">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-neutral-900 hover:bg-black text-white font-bold text-xs rounded-full transition-colors shadow-xs"
                >
                  Verify phone
                </button>
                <button
                  type="button"
                  onClick={() => setModalType('signup')}
                  className="w-full py-2.5 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-medium text-xs rounded-full transition-colors"
                >
                  Change phone number
                </button>
              </div>

              <div className="text-center text-[11px] text-neutral-400">
                Resend code · available in 28s
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
