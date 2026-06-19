import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Plus, Trash2, Eye, EyeOff, Copy, Check, ShieldAlert, Cpu, Terminal, Calendar } from 'lucide-react';

export default function ApiKeys() {
  const [keys, setKeys] = useState([
    { id: 1, name: "Production Gateway Key", prefix: "fm_live_...", key: "fm_live_8f8e8a7d3c2b1a0e9f8d7c6b5a4", created: "2026-03-12", scope: "Read / Write", status: "Active", visible: false },
    { id: 2, name: "Market Analytics Feed", prefix: "fm_read_...", key: "fm_read_1e2d3c4b5a6e7d8c9b0a1f2e3d4", created: "2026-05-01", scope: "Read Only", status: "Active", visible: false }
  ]);

  const [copiedId, setCopiedId] = useState(null);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyScope, setNewKeyScope] = useState('Read Only');
  const [createdKeyDetails, setCreatedKeyDetails] = useState(null);

  const handleCreateKey = (e) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const keyBytes = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const prefix = newKeyScope === 'Read Only' ? 'fm_read_' : 'fm_live_';
    const keyVal = prefix + keyBytes;

    const newKeyObj = {
      id: Date.now(),
      name: newKeyName,
      prefix: prefix + '...',
      key: keyVal,
      created: new Date().toISOString().split('T')[0],
      scope: newKeyScope,
      status: "Active",
      visible: false
    };

    setKeys(prev => [newKeyObj, ...prev]);
    setCreatedKeyDetails(newKeyVal);
    setNewKeyName('');
  };

  const handleCopy = (id, keyText) => {
    navigator.clipboard.writeText(keyText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRevoke = (id) => {
    setKeys(prev => prev.filter(k => k.id !== id));
  };

  const toggleVisibility = (id) => {
    setKeys(prev => prev.map(k => k.id === id ? { ...k, visible: !k.visible } : k));
  };

  return (
    <div className="space-y-8 animate-in relative">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-black text-white tracking-tight">API Key Management</h2>
          <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-[0.2em]">Cryptographic Access Control</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Credentials</span>
            <span className="text-xs font-bold text-emerald-400">{keys.length} Valid Keys</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Key className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Create API Key panel */}
        <div className="xl:col-span-4 space-y-6">
          <div className="fin-card p-6">
            <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-400" />
              Generate API Key
            </h3>

            <form onSubmit={handleCreateKey} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Key Description Name</label>
                <input
                  type="text"
                  required
                  value={newKeyName}
                  onChange={e => setNewKeyName(e.target.value)}
                  placeholder="e.g. Backoffice Ledger Feed"
                  className="fin-input w-full font-semibold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Scope Permissions</label>
                <select
                  value={newKeyScope}
                  onChange={e => setNewKeyScope(e.target.value)}
                  className="fin-input w-full font-semibold"
                >
                  <option value="Read Only">Read Only Access (Query balance/history)</option>
                  <option value="Read / Write">Full Access (Process trades/transfer)</option>
                </select>
              </div>

              <button
                type="submit"
                className="fin-btn fin-btn-primary w-full py-4 text-xs font-black uppercase tracking-wider"
              >
                Generate Token
              </button>
            </form>
          </div>

          {/* New key presentation card */}
          <AnimatePresence>
            {createdKeyDetails && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="fin-card p-6 border-emerald-500/30 bg-emerald-500/[0.01] relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Terminal className="w-20 h-20 text-emerald-500" />
                </div>
                <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  Key Generated Successfully
                </h4>
                <p className="text-[10px] text-slate-400 leading-normal mb-4">
                  Please copy this secret key immediately. It will not be shown again due to cryptographic compliance protocols.
                </p>
                <div className="flex items-center gap-2 p-3 bg-black/60 rounded-xl border border-white/5 font-mono text-[11px] text-white">
                  <span className="truncate flex-1 select-all">{createdKeyDetails}</span>
                  <button 
                    onClick={() => handleCopy('newKey', createdKeyDetails)}
                    className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                  >
                    {copiedId === 'newKey' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Existing keys list */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          <div className="fin-card p-6">
            <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2.5">
              <Key className="w-5 h-5 text-indigo-400" />
              Active System Access Tokens
            </h3>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              <AnimatePresence initial={false}>
                {keys.length > 0 ? (
                  keys.map(k => (
                    <motion.div
                      key={k.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                    >
                      <div className="space-y-2 max-w-[70%]">
                        <div className="flex items-center gap-3">
                          <h4 className="text-xs font-black text-white">{k.name}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                            k.scope === 'Read / Write' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-slate-500/10 text-slate-400 border border-white/10'
                          }`}>
                            {k.scope}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 font-mono text-[10px] text-slate-500">
                          <span className="truncate">{k.visible ? k.key : k.prefix}</span>
                          <button 
                            onClick={() => toggleVisibility(k.id)}
                            className="p-1 hover:text-white transition-colors"
                          >
                            {k.visible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          <button 
                            onClick={() => handleCopy(k.id, k.key)}
                            className="p-1 hover:text-white transition-colors"
                          >
                            {copiedId === k.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6">
                        <div className="text-right hidden sm:block">
                          <span className="text-[8px] text-slate-600 font-black uppercase tracking-widest flex items-center gap-1.5">
                            <Calendar className="w-3 h-3 text-slate-700" /> Created: {k.created}
                          </span>
                        </div>
                        <button
                          onClick={() => handleRevoke(k.id)}
                          className="p-2 rounded-xl bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 border border-rose-500/10 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-wider"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Revoke
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-20 text-center text-slate-700 opacity-40">
                    <Cpu className="w-12 h-12 mb-4 mx-auto" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">No Credentials Generated</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
