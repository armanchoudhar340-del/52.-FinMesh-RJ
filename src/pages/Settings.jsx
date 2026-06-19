import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sliders, Shield, Bell, Eye, Database, Smartphone, Check,
  ToggleLeft, ToggleRight, Laptop, Globe, Info, RefreshCw, LogOut
} from 'lucide-react';

export default function Settings() {
  const [appearance, setAppearance] = useState('dark');
  
  // Toggles state
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    settlement: true,
    arbitrage: false
  });

  const [security, setSecurity] = useState({
    twoFactor: true,
    ipWhitelist: false,
    sessionTimeout: '30m'
  });

  const [apiPrefs, setApiPrefs] = useState({
    payloadCompression: true,
    verboseLogging: false
  });

  const [sessions, setSessions] = useState([
    { id: 1, device: "MacBook Pro (Chrome)", location: "New York, USA", status: "Active Now", ip: "192.168.1.14" },
    { id: 2, device: "iPhone 15 Pro (Safari)", location: "New York, USA", status: "Authorized", ip: "172.56.21.90" }
  ]);

  const [showSavedMsg, setShowSavedMsg] = useState(false);

  const saveSettings = () => {
    setShowSavedMsg(true);
    setTimeout(() => setShowSavedMsg(false), 3000);
  };

  const handleToggleNotif = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleToggleSecurity = (key) => {
    setSecurity(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleToggleApi = (key) => {
    setApiPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const terminateSession = (id) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-8 animate-in relative">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {showSavedMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 backdrop-blur-xl flex items-center gap-3 shadow-2xl"
          >
            <Check className="w-5 h-5 shrink-0" />
            <span className="text-xs font-black uppercase tracking-wider">Configuration updated & saved</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-black text-white tracking-tight">System Configurations</h2>
          <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-[0.2em]">Platform Preferences & Controls</p>
        </div>
        <button
          onClick={saveSettings}
          className="fin-btn fin-btn-primary py-3 px-6 text-xs font-black uppercase tracking-wider"
        >
          Save Configurations
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column - Preferences panels */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Notifications config */}
          <div className="fin-card p-6">
            <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2.5">
              <Bell className="w-5 h-5 text-indigo-400" />
              Notifications Configuration
            </h3>
            
            <div className="space-y-4">
              {[
                { key: 'email', title: 'Email Summaries', desc: 'Receive daily accounting updates and settlement reports via email.' },
                { key: 'push', title: 'Push Alerts', desc: 'Direct browser alerts on block verification and security flags.' },
                { key: 'settlement', title: 'Trade Settlements', desc: 'Immediate signals upon successful transaction or queue processing.' },
                { key: 'arbitrage', title: 'Arbitrage Signals', desc: 'Alerts when optimal pricing spreads exceed 1.5% target.' }
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                  <div className="space-y-0.5 max-w-[80%]">
                    <h4 className="text-xs font-bold text-slate-200">{item.title}</h4>
                    <p className="text-[10px] text-slate-500 leading-normal">{item.desc}</p>
                  </div>
                  <button 
                    onClick={() => handleToggleNotif(item.key)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {notifications[item.key] ? (
                      <ToggleRight className="w-9 h-9 text-emerald-400" />
                    ) : (
                      <ToggleLeft className="w-9 h-9 opacity-40" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* API Preferences config */}
          <div className="fin-card p-6">
            <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2.5">
              <Database className="w-5 h-5 text-emerald-400" />
              API & Integration Preferences
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                <div className="space-y-0.5 max-w-[80%]">
                  <h4 className="text-xs font-bold text-slate-200">Binary Payload Compression</h4>
                  <p className="text-[10px] text-slate-500">Automatically compress transaction logs into packed binary Hex arrays before transmission.</p>
                </div>
                <button onClick={() => handleToggleApi('payloadCompression')} className="text-slate-400">
                  {apiPrefs.payloadCompression ? (
                    <ToggleRight className="w-9 h-9 text-emerald-400" />
                  ) : (
                    <ToggleLeft className="w-9 h-9 opacity-40" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                <div className="space-y-0.5 max-w-[80%]">
                  <h4 className="text-xs font-bold text-slate-200">Verbose Debug Logging</h4>
                  <p className="text-[10px] text-slate-500">Keep comprehensive console traces of state machine transitions and LIFO stack modifications.</p>
                </div>
                <button onClick={() => handleToggleApi('verboseLogging')} className="text-slate-400">
                  {apiPrefs.verboseLogging ? (
                    <ToggleRight className="w-9 h-9 text-emerald-400" />
                  ) : (
                    <ToggleLeft className="w-9 h-9 opacity-40" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right column - Security & Session panels */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Security & Access */}
          <div className="fin-card p-6">
            <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2.5">
              <Shield className="w-5 h-5 text-indigo-400" />
              Security preferences
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="space-y-0.5 max-w-[70%]">
                  <h4 className="text-xs font-bold text-slate-200">Two-Factor Authentication</h4>
                  <p className="text-[10px] text-slate-500">Verify login attempts using secure time-based TOTP code generator.</p>
                </div>
                <button onClick={() => handleToggleSecurity('twoFactor')} className="text-slate-400">
                  {security.twoFactor ? (
                    <ToggleRight className="w-9 h-9 text-emerald-400" />
                  ) : (
                    <ToggleLeft className="w-9 h-9 opacity-40" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="space-y-0.5 max-w-[70%]">
                  <h4 className="text-xs font-bold text-slate-200">IP Route Whitelisting</h4>
                  <p className="text-[10px] text-slate-500">Only permit account access from pre-approved, certified IP ranges.</p>
                </div>
                <button onClick={() => handleToggleSecurity('ipWhitelist')} className="text-slate-400">
                  {security.ipWhitelist ? (
                    <ToggleRight className="w-9 h-9 text-emerald-400" />
                  ) : (
                    <ToggleLeft className="w-9 h-9 opacity-40" />
                  )}
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Automatic Session Timeout</label>
                <select 
                  value={security.sessionTimeout} 
                  onChange={e => setSecurity(prev => ({ ...prev, sessionTimeout: e.target.value }))}
                  className="fin-input w-full font-bold"
                >
                  <option value="15m">15 Minutes of Inactivity</option>
                  <option value="30m">30 Minutes of Inactivity</option>
                  <option value="1h">1 Hour of Inactivity</option>
                  <option value="never">Never Log Out Automatically</option>
                </select>
              </div>
            </div>
          </div>

          {/* Session Management */}
          <div className="fin-card p-6">
            <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2.5">
              <Laptop className="w-5 h-5 text-indigo-400" />
              Active Operator Sessions
            </h3>

            <div className="space-y-4">
              {sessions.map(s => (
                <div key={s.id} className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white">{s.device}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                        s.status === 'Active Now' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border border-white/10'
                      }`}>
                        {s.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[9px] text-slate-500 font-mono">
                      <Globe className="w-3 h-3 text-slate-600" /> {s.location} • IP: {s.ip}
                    </div>
                  </div>
                  {s.status !== 'Active Now' && (
                    <button 
                      onClick={() => terminateSession(s.id)}
                      className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors text-[9px] font-black uppercase"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
