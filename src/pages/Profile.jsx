import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import {
  User, Mail, Shield, Calendar, Clock, Server, Wallet, Key, Cpu,
  Edit2, Lock, Save, CheckCircle2, AlertTriangle, ArrowRight,
  TrendingUp, Activity, Smartphone
} from 'lucide-react';

export default function Profile() {
  const { wallets } = useApp();

  // Load user data from localStorage or default values
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('finmesh_user');
    return saved ? JSON.parse(saved) : {
      name: "John Doe",
      email: "john@finmesh.io",
      role: "System Administrator",
      memberSince: "March 12, 2024",
      status: "Verified",
      securityLevel: "Tier 3 (Maximum)",
      phone: "+1 (555) 019-2834",
      lastLogin: new Date().toLocaleString()
    };
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...user });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  
  const [notification, setNotification] = useState(null);

  const triggerNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!editForm.name || !editForm.email) {
      triggerNotification("Name and Email are required fields", "error");
      return;
    }
    const updatedUser = { ...user, ...editForm };
    setUser(updatedUser);
    localStorage.setItem('finmesh_user', JSON.stringify(updatedUser));
    // Trigger custom event to notify layout/header
    window.dispatchEvent(new Event('user_profile_updated'));
    setIsEditing(false);
    triggerNotification("Profile details saved successfully!");
  };

  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      triggerNotification("New passwords do not match!", "error");
      return;
    }
    if (passwordForm.new.length < 6) {
      triggerNotification("Password must be at least 6 characters long", "error");
      return;
    }
    triggerNotification("Password updated successfully!");
    setIsChangingPassword(false);
    setPasswordForm({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="space-y-8 animate-in relative">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 p-4 rounded-2xl border backdrop-blur-xl flex items-center gap-3 shadow-2xl ${
              notification.type === 'error'
                ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            }`}
          >
            {notification.type === 'error' ? (
              <AlertTriangle className="w-5 h-5 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            )}
            <span className="text-xs font-black uppercase tracking-wider">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-black text-white tracking-tight">Security & Credentials</h2>
          <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-[0.2em]">Enterprise Operator Hub</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Authority Node</span>
            <span className="text-xs font-bold text-indigo-400">{user.role}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Shield className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Profile Card & Security Overview */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main User Card */}
          <div className="fin-card p-6 overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <User className="w-32 h-32 text-indigo-500" />
            </div>

            <div className="flex flex-col items-center text-center pb-6 border-b border-white/5">
              <div className="relative group">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-black text-white shadow-2xl shadow-indigo-500/30 border border-white/10 group-hover:scale-105 transition-transform duration-300">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="absolute -bottom-1 -right-1 p-2 rounded-xl bg-emerald-500 text-black border-4 border-[#090d1f] shadow-lg">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>

              <h3 className="text-xl font-display font-black text-white mt-4 tracking-tight">{user.name}</h3>
              <p className="text-xs font-mono font-bold text-indigo-400 mt-1">{user.email}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="fin-badge fin-badge-indigo text-[9px] px-3 font-black">{user.role}</span>
                <span className="fin-badge fin-badge-success text-[9px] px-3 font-black">Verified</span>
              </div>
            </div>

            {/* Core Info Grid */}
            <div className="py-6 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-slate-500 font-bold uppercase tracking-wider">
                  <Calendar className="w-4 h-4 text-indigo-400" /> Member Since
                </div>
                <span className="text-white font-semibold">{user.memberSince}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-slate-500 font-bold uppercase tracking-wider">
                  <Clock className="w-4 h-4 text-indigo-400" /> Last Session
                </div>
                <span className="text-white font-mono font-bold">{user.lastLogin}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-slate-500 font-bold uppercase tracking-wider">
                  <Shield className="w-4 h-4 text-indigo-400" /> Security Level
                </div>
                <span className="text-emerald-400 font-bold">{user.securityLevel}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-slate-500 font-bold uppercase tracking-wider">
                  <Smartphone className="w-4 h-4 text-indigo-400" /> Phone Auth
                </div>
                <span className="text-white font-semibold">{user.phone}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <button
                onClick={() => {
                  setEditForm({ ...user });
                  setIsEditing(true);
                }}
                className="fin-btn w-full justify-center py-3.5 text-[10px] font-black uppercase tracking-wider"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit Profile
              </button>
              <button
                onClick={() => setIsChangingPassword(true)}
                className="fin-btn w-full justify-center bg-indigo-500/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 py-3.5 text-[10px] font-black uppercase tracking-wider"
              >
                <Lock className="w-3.5 h-3.5" /> Password
              </button>
            </div>
          </div>

          {/* Connected Wallets Panel */}
          <div className="fin-card p-6">
            <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2.5">
              <Wallet className="w-4 h-4 text-indigo-400" />
              Connected Wallets ({wallets.length})
            </h4>
            <div className="space-y-3 max-h-48 overflow-y-auto no-scrollbar">
              {wallets.map((w, idx) => (
                <div key={idx} className="p-3 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between hover:border-white/10 transition-colors">
                  <div>
                    <p className="text-xs font-black text-white">{w.owner}</p>
                    <p className="text-[10px] font-mono text-slate-500 mt-0.5 truncate w-48">{w.address}</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">${w.USDT.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Edit Profile, Password Modals & Stats Panel */}
        <div className="lg:col-span-7 space-y-6">

          {/* Edit Profile Form Panel */}
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="fin-card p-6 border-indigo-500/30 bg-indigo-500/[0.01]"
            >
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-indigo-400" />
                Update Profile Info
              </h3>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Full Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                      className="fin-input w-full font-semibold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Address</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                      className="fin-input w-full font-mono font-semibold"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Phone Number</label>
                    <input
                      type="text"
                      value={editForm.phone}
                      onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                      className="fin-input w-full font-semibold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Operator Role</label>
                    <input
                      type="text"
                      value={editForm.role}
                      disabled
                      className="fin-input w-full opacity-60 cursor-not-allowed font-semibold bg-white/5"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="fin-btn border-white/5 py-3 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="fin-btn fin-btn-primary py-3 text-xs"
                  >
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Change Password Form Panel */}
          {isChangingPassword && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="fin-card p-6 border-indigo-500/30 bg-indigo-500/[0.01]"
            >
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-400" />
                Change Password
              </h3>
              <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Current Password</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.current}
                    onChange={e => setPasswordForm({ ...passwordForm, current: e.target.value })}
                    className="fin-input w-full font-semibold"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">New Password</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.new}
                      onChange={e => setPasswordForm({ ...passwordForm, new: e.target.value })}
                      className="fin-input w-full font-semibold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Confirm Password</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.confirm}
                      onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                      className="fin-input w-full font-semibold"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsChangingPassword(false)}
                    className="fin-btn border-white/5 py-3 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="fin-btn fin-btn-primary py-3 text-xs"
                  >
                    Confirm Change
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* API Metrics & Usage stats */}
          <div className="fin-card p-6 relative">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Cpu className="w-24 h-24 text-emerald-500" />
            </div>

            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              API Usage & Cryptographic Statistics
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-black/40 border border-emerald-500/20">
                <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest block mb-1">API Requests</span>
                <span className="text-xl font-display font-black text-emerald-400">15,420 <span className="text-xs font-medium text-slate-600">/day</span></span>
              </div>
              <div className="p-4 rounded-2xl bg-black/40 border border-indigo-500/20">
                <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest block mb-1">Keys Active</span>
                <span className="text-xl font-display font-black text-indigo-400">3 Keys</span>
              </div>
              <div className="p-4 rounded-2xl bg-black/40 border border-purple-500/20">
                <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest block mb-1">Avg Latency</span>
                <span className="text-xl font-display font-black text-purple-400">12ms</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-bold uppercase tracking-wider">Daily Request Quota</span>
                  <span className="text-white font-mono font-bold">15,420 / 50,000 (30.8%)</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[30.8%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-bold uppercase tracking-wider">Cryptographic Computation Power</span>
                  <span className="text-white font-mono font-bold">85% Capacity</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-[85%] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex gap-3 text-[10px] text-slate-600 leading-relaxed italic">
              <Key className="w-4 h-4 shrink-0 text-slate-700" />
              Your API requests are cryptographically signed using AES-GCM 256-bit encryption. All activities are fully audited under FIPS compliance standards.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
