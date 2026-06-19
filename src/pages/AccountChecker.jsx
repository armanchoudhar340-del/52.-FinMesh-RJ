import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  User,
  Calendar,
  Award,
  HelpCircle,
  Hash,
  Database,
  Cpu,
  ShieldCheck,
  AlertCircle,
  Activity,
  Zap,
  Check,
  Fingerprint,
  Info
} from 'lucide-react';

export default function AccountChecker() {
  const { checkAccount, wallets, accountHashMap } = useApp();

  const [addressInput, setAddressInput] = useState('');
  const [activeSearchResult, setActiveSearchResult] = useState(null);

  // Trigger search instantly on input
  const handleInputChange = (e) => {
    const val = e.target.value;
    setAddressInput(val);
    if (val.trim()) {
      const res = checkAccount(val);
      setActiveSearchResult(res);
    } else {
      setActiveSearchResult(null);
    }
  };

  const handleSelectPreset = (addr) => {
    setAddressInput(addr);
    const res = checkAccount(addr);
    setActiveSearchResult(res);
  };

  // Get current bucket states to show hash collision distribution
  const bucketsState = accountHashMap.getBucketsState();

  return (
    <div className="space-y-8 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-black text-white tracking-tight">Identity Resolver</h2>
          <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-[0.2em]">O(1) Hash-Based Entity Verification</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Resolver Status</span>
            <span className="text-xs font-bold text-emerald-400">OPERATIONAL</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Fingerprint className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Speed Dial / Presets */}
      <div className="fin-card p-6 border-indigo-500/10 bg-indigo-500/[0.02]">
        <div className="flex items-center gap-3 mb-6">
          <Zap className="w-4 h-4 text-indigo-400" />
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Registered Protocol Entities</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {wallets.map(w => (
            <button
              key={w.address}
              onClick={() => handleSelectPreset(w.address)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${addressInput === w.address
                  ? 'bg-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-500/20 scale-105'
                  : 'bg-black/40 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10'
                }`}
            >
              {w.owner} • 0x{w.address.substring(0, 6)}
            </button>
          ))}
          <button
            onClick={() => handleSelectPreset('0xInvalidAddressTokenFakeHash999')}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${addressInput === '0xInvalidAddressTokenFakeHash999'
                ? 'bg-rose-500 border-rose-400 text-white shadow-lg shadow-rose-500/20 scale-105'
                : 'bg-black/40 border-white/5 text-slate-600 hover:text-rose-400 hover:border-rose-500/20'
              }`}
          >
            NULL_REFERENCE
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

        {/* Resolver Interface */}
        <div className="xl:col-span-8 space-y-8">

          <div className="fin-card p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Search className="w-24 h-24 text-indigo-400" />
            </div>

            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              Address Verification Engine
            </h3>

            <div className="relative mb-8">
              <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="0x Protocol Address or Entity ID..."
                value={addressInput}
                onChange={handleInputChange}
                className="fin-input w-full pl-12 pr-6 py-4 font-mono font-bold placeholder:text-slate-700"
              />
            </div>

            <AnimatePresence mode='wait'>
              {addressInput.trim() && activeSearchResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="pt-2"
                >
                  {activeSearchResult.value ? (
                    <div className="p-6 rounded-3xl bg-emerald-500/[0.03] border border-emerald-500/20 relative group overflow-hidden">
                      <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Check className="w-32 h-32 text-emerald-500" />
                      </div>

                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                            <ShieldCheck className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] block">Entity Verified</span>
                            <span className="text-xs font-mono text-slate-500 mt-0.5 font-bold uppercase">Mapping Found in Bucket #{activeSearchResult.bucketIndex}</span>
                          </div>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-black/40 border border-white/5 text-[10px] font-mono text-slate-500 font-bold">
                          O(1) CONSTANT_TIME
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                        <div className="space-y-2">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Primary Owner</span>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold text-xs">
                              {activeSearchResult.value.owner.charAt(0)}
                            </div>
                            <span className="text-base font-bold text-white tracking-tight">{activeSearchResult.value.owner}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Entry Sequence</span>
                          <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm font-bold text-slate-300">{activeSearchResult.value.created}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Entity Permission</span>
                          <div className="flex items-center gap-3">
                            <Award className="w-4 h-4 text-amber-400" />
                            <span className={`text-[10px] font-black uppercase tracking-widest ${activeSearchResult.value.type === 'CORP' ? 'text-indigo-400' : 'text-slate-400'}`}>
                              {activeSearchResult.value.type} LEVEL
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 rounded-3xl bg-rose-500/[0.03] border border-rose-500/20">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400">
                          <AlertCircle className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-sm font-black text-white uppercase tracking-widest block">Entity Resolution Failure</span>
                          <span className="text-xs text-slate-500 font-bold mt-1">
                            Target address mapping does not exist in the active HashMap registry. Access denied.
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {addressInput.trim() && activeSearchResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="fin-card p-6 border-indigo-500/20"
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Algorithm Execution Trace</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-0.5">Polynomial Rolling Hash Implementation</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-4 font-mono">
                      <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                        <div className="flex justify-between items-center text-[10px] pb-2 border-b border-white/5">
                          <span className="text-slate-500 font-black uppercase">Input Key Buffer</span>
                          <span className="text-indigo-400 font-bold">{addressInput.length} bytes</span>
                        </div>
                        <div className="text-[11px] text-slate-300 font-bold break-all leading-relaxed whitespace-pre-wrap">
                          "{addressInput}"
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-indigo-500/[0.02] border border-indigo-500/10">
                          <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest block mb-1">DJB2 Hash</span>
                          <span className="text-sm font-black text-indigo-400">{activeSearchResult.hashValue}</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-emerald-500/[0.02] border border-emerald-500/10">
                          <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest block mb-1">Bucket Modulo</span>
                          <span className="text-sm font-black text-emerald-400">IDX_{activeSearchResult.bucketIndex}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
                        <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest block mb-1">Collision Detection</span>
                        <span className={`text-[11px] font-black uppercase tracking-widest ${activeSearchResult.collisionOccurred ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {activeSearchResult.collisionOccurred ? "LINKED_CHAIN" : "ATOMIC_HIT"}
                        </span>
                      </div>
                      <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
                        <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest block mb-1">Computed Cost</span>
                        <span className="text-[11px] font-black text-indigo-400 uppercase tracking-widest">{activeSearchResult.complexity}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Hash Rolling Iterations</span>
                    <div className="space-y-2 max-h-[220px] overflow-y-auto no-scrollbar pr-2">
                      {activeSearchResult.hashingSteps.map((step, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-black/40 border border-white/5 text-[10px] font-mono text-slate-400 font-bold hover:border-white/10 transition-colors">
                          <span className="text-indigo-500/50 mr-2">{idx.toString().padStart(2, '0')}</span>
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Memory Buckets Visualizer */}
        <div className="xl:col-span-4 space-y-8">
          <div className="fin-card p-6 border-indigo-500/20 relative overflow-hidden flex flex-col h-full">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Database className="w-16 h-16 text-indigo-400" />
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Bucket Topology</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-0.5">Linear Chaining Distribution</p>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar pr-1">
              {bucketsState.map(bucket => {
                const isTarget = addressInput.trim() && activeSearchResult?.bucketIndex === bucket.index;
                return (
                  <motion.div
                    layout
                    key={bucket.index}
                    className={`p-4 rounded-2xl border transition-all ${isTarget
                        ? 'bg-indigo-500 border-indigo-400 shadow-xl shadow-indigo-500/20 scale-[1.02]'
                        : 'bg-black/40 border-white/5 hover:border-white/10'
                      }`}
                  >
                    <div className="flex justify-between items-center text-[10px] mb-3">
                      <span className={`font-black uppercase tracking-widest ${isTarget ? 'text-white' : 'text-slate-600'}`}>
                        0xBUCKET_{bucket.index.toString(16).toUpperCase()}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${isTarget ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-500'}`}>
                        {bucket.count} SLOTS
                      </span>
                    </div>

                    {bucket.count > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {bucket.keys.map(key => {
                          const isSearchedKey = key === addressInput;
                          return (
                            <div
                              key={key}
                              className={`text-[9px] px-2 py-1 rounded-lg font-mono font-bold transition-all ${isSearchedKey
                                  ? 'bg-white text-indigo-600 shadow-lg'
                                  : isTarget ? 'bg-white/10 text-white/50 border border-white/5' : 'bg-black/40 text-slate-500 border border-white/5'
                                }`}
                            >
                              0x{key.substring(2, 6)}...{key.slice(-4)}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="h-4 flex items-center">
                        <div className="w-full h-px bg-slate-800/50 border-t border-dashed border-slate-700/30" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-start gap-4">
              <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase tracking-wider">
                Linear chaining used for collision resolution. Optimal bucket count maintained at 12 to demonstrate linked search complexity.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
