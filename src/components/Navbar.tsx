import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import {
  ChevronDown,
  UserCheck,
  Briefcase,
  Layers,
  ArrowRightLeft,
  Check,
  Shield,
  Lock,
  UserPlus,
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'dashboard' | 'tasks' | 'projects' | 'collaboration' | 'services' | 'client_portal' | 'admin';
  setActiveTab: (tab: 'dashboard' | 'tasks' | 'projects' | 'collaboration' | 'services' | 'client_portal' | 'admin') => void;
  currentUser: UserProfile;
  users: UserProfile[];
  onSwitchUser: (user: UserProfile) => void;
  isClientView: boolean;
  setIsClientView: (val: boolean) => void;
  onOpenAuthModal: () => void;
  onOpenAdminPanel: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  users,
  onSwitchUser,
  isClientView,
  setIsClientView,
  onOpenAuthModal,
  onOpenAdminPanel,
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  type NavTabId = 'dashboard' | 'tasks' | 'projects' | 'collaboration' | 'services' | 'admin';
  const navLinks: { id: NavTabId; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'tasks', label: 'Task Board' },
    { id: 'projects', label: 'Project Tracking' },
    { id: 'collaboration', label: 'Team Live Hub' },
    { id: 'services', label: 'Agency Services' },
  ];

  const handleRoleSelection = (user: UserProfile) => {
    onSwitchUser(user);
    if (user.role === 'client') {
      setIsClientView(true);
      setActiveTab('client_portal');
    } else {
      setIsClientView(false);
      if (activeTab === 'client_portal') {
        setActiveTab('dashboard');
      }
    }
    setShowUserDropdown(false);
  };

  const toggleClientMode = () => {
    if (!isClientView) {
      const clientUser = users.find((u) => u.role === 'client') || currentUser;
      onSwitchUser(clientUser);
      setIsClientView(true);
      setActiveTab('client_portal');
    } else {
      const leadUser = users.find((u) => u.role === 'lead') || users[0];
      onSwitchUser(leadUser);
      setIsClientView(false);
      setActiveTab('dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                if (isClientView) {
                  setActiveTab('client_portal');
                } else {
                  setActiveTab('dashboard');
                }
              }}
              className="text-left group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-400 rotate-45 inline-block group-hover:scale-110 transition-transform" />
                <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
                  Prime Plus Team
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: 4–5 clean single-line text navigation links */}
          {!isClientView ? (
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-400">
              {navLinks.map((link) => {
                const isActive = activeTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => setActiveTab(link.id)}
                    className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 cursor-pointer ${
                      isActive
                        ? 'text-white border-b-2 border-amber-400 font-semibold'
                        : 'hover:text-slate-200'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>
          ) : (
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-400">
              <button
                onClick={() => setActiveTab('client_portal')}
                className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 cursor-pointer ${
                  activeTab === 'client_portal'
                    ? 'text-white border-b-2 border-amber-400 font-semibold'
                    : 'hover:text-slate-200'
                }`}
              >
                Client Overview
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 cursor-pointer ${
                  activeTab === 'projects'
                    ? 'text-white border-b-2 border-amber-400 font-semibold'
                    : 'hover:text-slate-200'
                }`}
              >
                Deliverables & Milestones
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 cursor-pointer ${
                  activeTab === 'services'
                    ? 'text-white border-b-2 border-amber-400 font-semibold'
                    : 'hover:text-slate-200'
                }`}
              >
                Services Catalog
              </button>
            </nav>
          )}

          {/* Zone 3: Actions + Admin Panel + Profile (Direct Login/Register Trigger) */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Direct WhatsApp Contact Button */}
            <a
              href="https://wa.me/923023608248?text=Hello%20Prime%20Plus%20Team!%20I%20am%20interested%20in%20your%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/25 transition-all whitespace-nowrap shrink-0 cursor-pointer"
              title="Chat on WhatsApp: +92 302 3608248"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>WhatsApp: 03023608248</span>
            </a>

            {/* View Mode Switcher Button */}
            <button
              onClick={toggleClientMode}
              className={`hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                isClientView
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/40 hover:bg-amber-500/20'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-600 hover:text-white'
              }`}
            >
              <ArrowRightLeft className="w-3 h-3" />
              <span>{isClientView ? 'Team Mode' : 'Client Mode'}</span>
            </button>

            {/* Admin Panel Button (Oper Profile Ke Sath) */}
            <button
              onClick={onOpenAdminPanel}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer whitespace-nowrap shrink-0 shadow-sm ${
                activeTab === 'admin'
                  ? 'bg-amber-400 text-slate-950 border-amber-400'
                  : 'bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 border-amber-400/40'
              }`}
              title="Admin Panel (Owner Mr.hcr - Password: Qwsa1122)"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Panel</span>
            </button>

            {/* User Profile Button: Clicking opens Login / Register Page Immediately */}
            <div className="relative">
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-2 p-1.5 pl-2 pr-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-400/70 transition-colors text-left cursor-pointer group shadow-sm"
                title="Click to Open Login / Register & Profile Switcher"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-amber-400/40 group-hover:ring-amber-400 transition-all"
                />
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-slate-200 leading-tight truncate max-w-[100px] group-hover:text-amber-300 transition-colors">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-slate-400 capitalize leading-tight">
                    {currentUser.role === 'lead' ? 'Owner / Admin' : currentUser.role}
                  </p>
                </div>
                <UserCheck className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 transition-colors" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="lg:hidden flex items-center justify-around py-2 border-t border-slate-800/60 overflow-x-auto text-xs">
          {!isClientView ? (
            <>
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`px-2 py-1 whitespace-nowrap ${
                    activeTab === link.id
                      ? 'text-amber-400 font-semibold border-b border-amber-400'
                      : 'text-slate-400'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('client_portal')}
                className={`px-2 py-1 whitespace-nowrap ${
                  activeTab === 'client_portal'
                    ? 'text-amber-400 font-semibold border-b border-amber-400'
                    : 'text-slate-400'
                }`}
              >
                Client Overview
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`px-2 py-1 whitespace-nowrap ${
                  activeTab === 'projects'
                    ? 'text-amber-400 font-semibold border-b border-amber-400'
                    : 'text-slate-400'
                }`}
              >
                Deliverables
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`px-2 py-1 whitespace-nowrap ${
                  activeTab === 'services'
                    ? 'text-amber-400 font-semibold border-b border-amber-400'
                    : 'text-slate-400'
                }`}
              >
                Services
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
