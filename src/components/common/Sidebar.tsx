import React from 'react';
import {
  LayoutDashboard,
  Package,
  FileText,
  MessageSquareQuote,
  ShoppingBag,
  User,
  ShieldCheck,
  Users,
  AlertTriangle,
  Activity,
  BarChart3,
  Truck,
  Wallet,
  Clock,
  HelpCircle,
  ArrowUpRight,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { marketplaceStore } from '../../services/store';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export function Sidebar({ currentView, onNavigate }: SidebarProps) {
  const store = useStore();
  const role = store.currentRole;

  // For buyer/mechanic role, the Figma design uses the clean top-nav layout (Pages 1–29)
  if (role === 'mechanic' || role === 'owner') {
    return null;
  }

  // --- Dealer Workspace Sidebar (Figma Pages 30–45) ---
  if (role === 'dealer') {
    const dealerLinks = [
      { id: 'dealer_dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'dealer_inventory', label: 'Inventory', icon: Package, count: store.inventory.length },
      { id: 'dealer_requests', label: 'Requests', icon: FileText, count: store.requests.length },
      { id: 'dealer_quotations', label: 'Quotations', icon: MessageSquareQuote, count: 8 },
      { id: 'dealer_orders', label: 'Orders', icon: ShoppingBag, count: store.orders.length },
      { id: 'dealer_profile', label: 'Profile', icon: User },
    ];

    return (
      <aside className="w-64 bg-[#FAFAFA] border-r border-neutral-200/90 flex flex-col justify-between shrink-0 min-h-screen text-xs select-none">
        <div className="p-6 space-y-8">
          {/* Header */}
          <div className="space-y-1">
            <div
              onClick={() => onNavigate('dealer_dashboard')}
              className="cursor-pointer font-black text-2xl tracking-tight text-neutral-900"
            >
              DEPANEH.
            </div>
            <p className="text-neutral-500 font-medium text-[11px]">Dealer workspace</p>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {dealerLinks.map((item) => {
              const isActive =
                currentView === item.id ||
                (item.id === 'dealer_dashboard' && currentView === 'dealer_response_sent') ||
                (item.id === 'dealer_inventory' && currentView === 'dealer_add_part') ||
                (item.id === 'dealer_requests' && (currentView === 'dealer_request_detail' || currentView === 'dealer_respond')) ||
                (item.id === 'dealer_orders' && currentView === 'dealer_deliveries');

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'dealer_quotations') {
                      onNavigate('dealer_requests');
                    } else if (item.id === 'dealer_orders') {
                      onNavigate('dealer_deliveries');
                    } else {
                      onNavigate(item.id);
                    }
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-between group ${
                    isActive
                      ? 'text-neutral-900 font-bold bg-neutral-200/60'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {isActive ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                    ) : (
                      <span className="w-1.5 h-1.5" />
                    )}
                    <span>{item.label}</span>
                  </div>

                  {item.count !== undefined && (
                    <span className="text-[10px] font-mono text-neutral-400 group-hover:text-neutral-600">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile and Switch */}
        <div className="p-6 border-t border-neutral-200/80 space-y-3">
          <div>
            <div className="font-bold text-neutral-900 text-xs">Lamin Ceesay</div>
            <div className="text-[11px] text-neutral-500">Kairaba Auto Parts</div>
          </div>

          <button
            onClick={() => {
              marketplaceStore.setRole('mechanic');
              onNavigate('dealers');
            }}
            className="w-full text-left text-neutral-600 hover:text-neutral-900 flex items-center justify-between text-xs font-medium py-1 transition-colors"
          >
            <span>Switch to buyer account</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
          </button>

          <button
            onClick={() => onNavigate('dealer_profile')}
            className="w-full text-left text-neutral-500 hover:text-neutral-800 text-[11px] flex items-center gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help & support</span>
          </button>
        </div>
      </aside>
    );
  }

  // --- Admin Workspace Sidebar (Figma Pages 46–58) ---
  if (role === 'admin') {
    const adminLinks = [
      { id: 'admin_dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'admin_verification', label: 'Dealers', icon: ShieldCheck, count: store.applications.filter((a) => a.status === 'pending').length },
      { id: 'admin_users', label: 'Users', icon: Users, count: store.users.length },
      { id: 'admin_listings', label: 'Listings', icon: Package, count: store.inventory.length },
      { id: 'admin_requests', label: 'Requests', icon: FileText, count: store.requests.length },
      { id: 'admin_orders', label: 'Orders', icon: ShoppingBag, count: store.orders.length },
      { id: 'admin_disputes', label: 'Disputes', icon: AlertTriangle, count: 3 },
      { id: 'admin_activity', label: 'Activity', icon: Activity },
      { id: 'admin_reports', label: 'Reports', icon: BarChart3 },
    ];

    return (
      <aside className="w-64 bg-[#FAFAFA] border-r border-neutral-200/90 flex flex-col justify-between shrink-0 min-h-screen text-xs select-none">
        <div className="p-6 space-y-8">
          {/* Header */}
          <div className="space-y-1">
            <div
              onClick={() => onNavigate('admin_dashboard')}
              className="cursor-pointer font-black text-2xl tracking-tight text-neutral-900"
            >
              DEPANEH.
            </div>
            <p className="text-neutral-500 font-medium text-[11px]">Admin workspace</p>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {adminLinks.map((item) => {
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'admin_orders' || item.id === 'admin_disputes' || item.id === 'admin_activity' || item.id === 'admin_reports') {
                      onNavigate('admin_dashboard');
                    } else {
                      onNavigate(item.id);
                    }
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl font-medium transition-colors flex items-center justify-between group ${
                    isActive
                      ? 'text-neutral-900 font-bold bg-neutral-200/60'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {isActive ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                    ) : (
                      <span className="w-1.5 h-1.5" />
                    )}
                    <span>{item.label}</span>
                  </div>

                  {item.count !== undefined && item.count > 0 && (
                    <span className="text-[10px] font-mono text-neutral-400 group-hover:text-neutral-600">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile and Info */}
        <div className="p-6 border-t border-neutral-200/80 space-y-3">
          <div>
            <div className="font-bold text-neutral-900 text-xs">DEPANEH Admin</div>
            <div className="text-[11px] text-neutral-500">Role: Platform Lead</div>
          </div>

          <button
            onClick={() => {
              marketplaceStore.setRole('mechanic');
              onNavigate('dealers');
            }}
            className="w-full text-left text-neutral-600 hover:text-neutral-900 flex items-center justify-between text-xs font-medium py-1 transition-colors"
          >
            <span>Switch to buyer account</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
          </button>

          <button
            onClick={() => onNavigate('admin_dashboard')}
            className="w-full text-left text-neutral-500 hover:text-neutral-800 text-[11px] flex items-center gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help & support</span>
          </button>
        </div>
      </aside>
    );
  }

  // --- Delivery Rider Workspace Sidebar (Section 8 Mandatory Interface) ---
  if (role === 'delivery_rider') {
    const activeJobs = store.deliveryJobs.filter(
      (j) => j.status === 'accepted' || j.status === 'picked_up' || j.status === 'in_transit'
    ).length;

    const riderLinks = [
      { id: 'delivery_dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'delivery_active', label: 'Active Dispatches', icon: Truck, count: activeJobs },
      { id: 'delivery_requests', label: 'Available Jobs', icon: FileText, count: store.deliveryJobs.filter((j) => j.status === 'available').length || 4 },
      { id: 'delivery_earnings', label: 'Earnings & Payout', icon: Wallet },
      { id: 'delivery_profile', label: 'Rider Profile', icon: User },
    ];

    return (
      <aside className="w-64 bg-[#FAFAFA] border-r border-neutral-200/90 flex flex-col justify-between shrink-0 min-h-screen text-xs select-none">
        <div className="p-6 space-y-8">
          {/* Header */}
          <div className="space-y-1">
            <div
              onClick={() => onNavigate('delivery_dashboard')}
              className="cursor-pointer font-black text-2xl tracking-tight text-neutral-900"
            >
              DEPANEH.
            </div>
            <p className="text-neutral-500 font-medium text-[11px]">Rider workspace</p>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {riderLinks.map((item) => {
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-between group ${
                    isActive
                      ? 'text-neutral-900 font-bold bg-neutral-200/60'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {isActive ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                    ) : (
                      <span className="w-1.5 h-1.5" />
                    )}
                    <span>{item.label}</span>
                  </div>

                  {item.count !== undefined && item.count > 0 && (
                    <span className="text-[10px] font-mono text-neutral-400 group-hover:text-neutral-600">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile and Switch */}
        <div className="p-6 border-t border-neutral-200/80 space-y-3">
          <div>
            <div className="font-bold text-neutral-900 text-xs">Modou Lamin Ceesay</div>
            <div className="text-[11px] text-neutral-500 font-mono">Motorcycle · BJL-4821-B</div>
          </div>

          <button
            onClick={() => {
              marketplaceStore.setRole('mechanic');
              onNavigate('dealers');
            }}
            className="w-full text-left text-neutral-600 hover:text-neutral-900 flex items-center justify-between text-xs font-medium py-1 transition-colors"
          >
            <span>Switch to buyer account</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
          </button>

          <button
            onClick={() => onNavigate('delivery_profile')}
            className="w-full text-left text-neutral-500 hover:text-neutral-800 text-[11px] flex items-center gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help & support</span>
          </button>
        </div>
      </aside>
    );
  }

  return null;
}
