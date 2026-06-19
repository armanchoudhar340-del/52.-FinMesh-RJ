import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, Wallet, History, ArrowUpDown, UserCheck,
  SlidersHorizontal, RefreshCw, LineChart, Menu, X, Activity,
  Zap, TrendingUp, TrendingDown, Shield, Bell, Search, Settings, 
  ChevronRight, Globe, Cpu, LogOut, User, Key
} from 'lucide-react';

const navItems = [
  { path: '/',         label: 'Dashboard',        icon: LayoutDashboard, badge: null },
  { path: '/wallets',  label: 'Wallet Tracker',   icon: Wallet,          badge: null },
  { path: '/undo-log', label: 'Undo Log',          icon: History,         badge: 'Hooks' },
  { path: '/queue',    label: 'Settlement Queue',  icon: ArrowUpDown,     badge: 'Context' },
  { path: '/checker',  label: 'Account Checker',   icon: UserCheck,       badge: null },
  { path: '/sorter',   label: 'Trade Sorter',      icon: SlidersHorizontal,badge: null },
  { path: '/price-hub',label: 'Price Hub',         icon: RefreshCw,       badge: 'LIVE' },
  { path: '/analytics',label: 'Analytics',         icon: LineChart,       badge: null },
];

// Live ticker data
const TICKERS = [
  { symbol: 'BTC', price: 67250, change: +2.34, up: true },
  { symbol: 'ETH', price: 3452,  change: -0.82, up: false },
  { symbol: 'SOL', price: 145.8, change: +5.12, up: true },
  { symbol: 'SOL', price: 145.8, change: +5.12, up: true },
  { symbol: 'ADA', price: 0.451, change: +1.74, up: true },
  { symbol: 'DOGE',price: 0.124, change: -1.21, up: false },
  { symbol: 'DOT', price: 6.02,  change: +3.41, up: true },
  { symbol: 'LINK',price: 15.1,  change: +0.93, up: true },
  { symbol: 'XRP', price: 0.501, change: -0.55, up: false },
];

function TickerStrip({ prices }) {
  const items = TICKERS.map(t => {
    if (prices[t.symbol]) {
      const avg = (prices[t.symbol].A + prices[t.symbol].B + prices[t.symbol].C) / 3;
      return { ...t, price: avg };
    }
    return t;
  });
  const doubled = [...items, ...items];

  return (
    <div className="ticker-container flex-1 overflow-hidden">
      <div className="ticker-scroll py-2">
        {doubled.map((t, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-6 border-r border-white/5 shrink-0"
          >
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.symbol}</span>
            <span className="text-xs font-mono text-white font-bold">
              ${t.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className={`text-[10px] font-bold flex items-center gap-0.5 ${t.up ? 'text-emerald-400' : 'text-rose-400'}`}>
              {t.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(t.change).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [signOutModalOpen, setSignOutModalOpen] = useState(false);
  const [syncTime, setSyncTime] = useState(0);
  const [user, setUser] = useState({ name: "John Doe", email: "john@finmesh.io" });
  const profileRef = useRef(null);
  const { totalPortfolioValue, exchangePrices } = useApp();

  // Dynamic user data loader
  useEffect(() => {
    const loadUser = () => {
      const saved = localStorage.getItem('finmesh_user');
      if (saved) {
        setUser(JSON.parse(saved));
      }
    };
    loadUser();
    window.addEventListener('user_profile_updated', loadUser);
    return () => window.removeEventListener('user_profile_updated', loadUser);
  }, []);

  const handleSignOutConfirm = () => {
    localStorage.removeItem('finmesh_demo_session');
    setSignOutModalOpen(false);
    setProfileOpen(false);
    navigate('/login');
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => setSyncTime(t => t + 1), 1000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-indigo-500/30">
      
      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden lg:flex flex-col fixed top-0 left-0 w-[280px] h-screen bg-[#020617]/80 backdrop-blur-2xl border-r border-white/5 z-30">
        {/* Logo */}
        <div className="h-20 flex items-center px-8 border-b border-white/5">
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_20px_rgba(99,102,241,0.4)] group-hover:scale-105 transition-transform duration-300">
              <Zap className="w-5 h-5 text-white fill-white/20" />
            </div>
            <div>
              <h1 className="font-display font-black text-xl text-white leading-none tracking-tight">FinMesh</h1>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-emerald" />
                <p className="text-[9px] text-indigo-400 font-bold tracking-[0.2em] uppercase">Enterprise</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="px-6 py-6">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search assets..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all placeholder:text-slate-600"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.15em] px-4 mb-4">Operations</p>
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                >
                  <Icon className="w-5 h-5 shrink-0 opacity-80" />
                  <span className="flex-1 font-semibold">{item.label}</span>
                  {item.badge && (
                    <span className="fin-badge fin-badge-indigo scale-90">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-40 transition-opacity" />
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Bottom Status Panel */}
        <div className="p-6 mt-auto">
          <div className="fin-card bg-indigo-500/5 border-indigo-500/10 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Node Status</p>
                  <p className="text-xs font-bold text-emerald-400">Operational</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Latency</p>
                <p className="text-xs font-mono font-bold text-white">12ms</p>
              </div>
            </div>
            
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 w-[85%] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
            </div>

            <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
              <span className="flex items-center gap-1.5"><Globe className="w-3 h-3" /> US-EAST-1</span>
              <span>v2.4.0-build</span>
            </div>
          </div>
          
          <button className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/5 text-slate-400 hover:text-white hover:bg-white/5 transition-all text-xs font-bold">
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>
      </aside>

      {/* ── MOBILE NAVBAR ── */}
      <header className="lg:hidden fixed top-0 w-full z-40 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
            <Zap className="w-4 h-4 text-white fill-white/20" />
          </div>
          <span className="font-display font-black text-lg tracking-tight">FinMesh</span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* ── MOBILE MENU OVERLAY ── */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-[#020617]/95" onClick={() => setMobileMenuOpen(false)}>
          <div className="h-full w-80 bg-[#0f172a] border-r border-white/5 animate-in slide-in-from-left duration-300" onClick={e => e.stopPropagation()}>
            <div className="p-6 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                  <Zap className="w-4 h-4 text-white fill-white/20" />
                </div>
                <span className="font-display font-black text-xl tracking-tight">FinMesh</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="p-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-semibold">{item.label}</span>
                    {item.badge && <span className="fin-badge fin-badge-indigo ml-auto">{item.badge}</span>}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div className="lg:ml-[280px] min-h-screen flex flex-col pt-16 lg:pt-0 app-bg">
        
        {/* Top Desktop Bar */}
        <header className="hidden lg:flex items-center justify-between h-20 px-8 border-b border-white/5 sticky top-0 z-40 bg-[#020617]/50 backdrop-blur-xl">
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Institutional Access</span>
              <span className="text-sm font-bold text-white">Advanced Trading Interface</span>
            </div>
            
            <div className="flex items-center gap-6 px-6 py-2 border-l border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] pulse-emerald" />
                <span className="text-[11px] font-bold text-slate-400">Node Sync:</span>
                <span className="text-[11px] font-mono font-bold text-emerald-400">100%</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[11px] font-bold text-slate-400">Active Threads:</span>
                <span className="text-[11px] font-mono font-bold text-white">128</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Portfolio Overview */}
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl py-2 px-5 hover:bg-white/10 transition-colors cursor-pointer group">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Net Balance</span>
                <span className="text-lg font-display font-black text-white tracking-tight">
                  <span className="text-indigo-400">$</span>
                  {totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-[#020617]" />
              </button>

              {/* Profile Button + Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(prev => !prev)}
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 border flex items-center justify-center text-sm font-black text-white shadow-lg transition-all duration-200
                    ${ profileOpen
                        ? 'border-indigo-400 shadow-indigo-500/40 shadow-xl scale-95'
                        : 'border-white/10 hover:border-indigo-500/50 hover:scale-105'
                    }`}
                >
                  {user.name ? user.name.split(' ').map(n => n[0]).join('') : 'JD'}
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-14 w-56 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-[100] animate-in">
                    {/* User Info */}
                    <div className="px-4 py-4 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-xs font-black text-white">
                          {user.name ? user.name.split(' ').map(n => n[0]).join('') : 'JD'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white truncate w-32">{user.name}</p>
                          <p className="text-[10px] text-slate-500 font-medium truncate w-32">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2 px-2">
                      <button 
                        onClick={() => { navigate('/profile'); setProfileOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-xs font-semibold text-left"
                      >
                        <User className="w-4 h-4" /> My Profile
                      </button>
                      <button 
                        onClick={() => { navigate('/settings'); setProfileOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-xs font-semibold text-left"
                      >
                        <Settings className="w-4 h-4" /> Settings
                      </button>
                      <button 
                        onClick={() => { navigate('/api-keys'); setProfileOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-xs font-semibold text-left"
                      >
                        <Key className="w-4 h-4" /> API Keys
                      </button>
                    </div>

                    {/* Logout */}
                    <div className="px-2 pb-2 border-t border-white/5 pt-2">
                      <button 
                        onClick={() => setSignOutModalOpen(true)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-400 hover:text-white hover:bg-rose-500/10 transition-all text-xs font-semibold text-left"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Live Ticker Area */}
        <div className="hidden lg:block">
          <TickerStrip prices={exchangePrices} />
        </div>

        {/* Main Viewport */}
        <main className="flex-1 p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
          <Outlet />
        </main>

        {/* Footer info */}
        <footer className="px-10 py-6 border-t border-white/5 flex items-center justify-between text-[11px] font-medium text-slate-600">
          <div className="flex items-center gap-6">
            <span>&copy; 2026 FinMesh Technologies</span>
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> FIPS-140-2 Compliant</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><RefreshCw className="w-3 h-3" /> Auto-sync enabled</span>
            <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10">UTC {new Date().toISOString().slice(11, 16)}</span>
          </div>
        </footer>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .sidebar-item:hover svg { opacity: 1; color: white; transform: scale(1.1); }
        .sidebar-item.active svg { opacity: 1; color: #c084fc; stroke-width: 2.5px; }
      `}} />
      {/* Sign Out Confirmation Modal */}
      <AnimatePresence>
        {signOutModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Modal backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSignOutModalOpen(false)}
              className="absolute inset-0 bg-[#020617]/80 backdrop-blur-sm"
            />

            {/* Modal card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fin-card max-w-[420px] w-full p-6 border-rose-500/20 bg-slate-900/90 relative z-10 space-y-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                  <LogOut className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Sign Out</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Decryption Key Evacuation</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Are you sure you want to sign out of FinMesh Enterprise? Your active session token and sandbox parameters will be securely flushed.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSignOutModalOpen(false)}
                  className="fin-btn border-white/5 hover:bg-white/5 py-3.5 text-[10px] font-black uppercase tracking-wider text-center justify-center"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSignOutConfirm}
                  className="fin-btn bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20 py-3.5 text-[10px] font-black uppercase tracking-wider text-center justify-center"
                >
                  Sign Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
