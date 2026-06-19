import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import {
  Plus, Search, Trash2, Edit3, Copy, Check, Info, Map as MapIcon,
  ChevronDown, ExternalLink, Shield, Layers, Globe, ZapOff
} from 'lucide-react';

export default function WalletTracker() {
  const {
    wallets,
    walletsMap,
    addWallet,
    editWallet,
    deleteWallet,
    getAssetPrice
  } = useApp();

  const [search, setSearch] = useState('');
  const [filterAsset, setFilterAsset] = useState('ALL');
  const [copiedAddress, setCopiedAddress] = useState('');

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [address, setAddress] = useState('');
  const [owner, setOwner] = useState('');
  const [btc, setBtc] = useState('');
  const [eth, setEth] = useState('');
  const [sol, setSol] = useState('');
  const [usdt, setUsdt] = useState('');
  const [editAddress, setEditAddress] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const copyToClipboard = (addr) => {
    navigator.clipboard.writeText(addr);
    setCopiedAddress(addr);
    setTimeout(() => setCopiedAddress(''), 1500);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!address.startsWith('0x') && address.length < 20) {
      setErrorMsg("Protocol Error: Invalid hash provided");
      return;
    }
    if (!owner.trim()) {
      setErrorMsg("Identity Error: Owner name required");
      return;
    }

    const btcVal = btc === '' ? 0 : parseFloat(btc);
    const ethVal = eth === '' ? 0 : parseFloat(eth);
    const solVal = sol === '' ? 0 : parseFloat(sol);
    const usdtVal = usdt === '' ? 0 : parseFloat(usdt);

    if (isNaN(btcVal) || isNaN(ethVal) || isNaN(solVal) || isNaN(usdtVal)) {
      setErrorMsg("Validation Error: Balances must be valid numeric values");
      return;
    }

    try {
      addWallet(address, owner, btcVal, ethVal, solVal, usdtVal);
      setAddress('');
      setOwner('');
      setBtc('');
      setEth('');
      setSol('');
      setUsdt('');
      setIsAddOpen(false);
      
      setSuccessToast("Wallet initialized successfully.");
      setTimeout(() => setSuccessToast(''), 4000);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const openEditModal = (w) => {
    setEditAddress(w.address);
    setOwner(w.owner);
    setBtc(w.BTC.toString());
    setEth(w.ETH.toString());
    setSol(w.SOL.toString());
    setUsdt(w.USDT.toString());
    setIsEditOpen(true);
    setErrorMsg('');
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const btcVal = btc === '' ? 0 : parseFloat(btc);
    const ethVal = eth === '' ? 0 : parseFloat(eth);
    const solVal = sol === '' ? 0 : parseFloat(sol);
    const usdtVal = usdt === '' ? 0 : parseFloat(usdt);

    if (isNaN(btcVal) || isNaN(ethVal) || isNaN(solVal) || isNaN(usdtVal)) {
      setErrorMsg("Validation Error: Balances must be valid numeric values");
      return;
    }

    try {
      editWallet(editAddress, owner, btcVal, ethVal, solVal, usdtVal);
      setIsEditOpen(false);
      setSuccessToast("Wallet updated successfully.");
      setTimeout(() => setSuccessToast(''), 4000);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const calculateWalletValue = (w) => {
    let val = 0;
    val += w.BTC * getAssetPrice('BTC');
    val += w.ETH * getAssetPrice('ETH');
    val += w.SOL * getAssetPrice('SOL');
    val += w.USDT * 1;
    return val;
  };

  const filteredWallets = wallets.filter(w => {
    const matchesSearch =
      w.address.toLowerCase().includes(search.toLowerCase()) ||
      w.owner.toLowerCase().includes(search.toLowerCase());

    if (filterAsset === 'ALL') return matchesSearch;
    return matchesSearch && w[filterAsset] > 0;
  });

  const totalPortfolioValue = wallets.reduce((acc, w) => acc + calculateWalletValue(w), 0);
  const totalAssetsCount = wallets.reduce((acc, w) => acc + (w.BTC > 0 ? 1 : 0) + (w.ETH > 0 ? 1 : 0) + (w.SOL > 0 ? 1 : 0) + (w.USDT > 0 ? 1 : 0), 0);

  return (
    <div className="space-y-8 animate-in">
      {/* Success Toast */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 backdrop-blur-xl flex items-center gap-3 shadow-2xl"
          >
            <Check className="w-5 h-5 shrink-0" />
            <span className="text-xs font-black uppercase tracking-wider">{successToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-display font-black text-white tracking-tight mb-2">Portfolio Management</h2>
          <p className="text-slate-500 font-medium">Manage institutional exchange wallets with deterministic Map orchestration.</p>
        </div>
        <button
          onClick={() => {
            setAddress('0x' + Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10) + 'A' + Math.random().toString(16).substring(2, 6));
            setOwner('');
            setBtc('');
            setEth('');
            setSol('');
            setUsdt('');
            setIsAddOpen(true);
            setErrorMsg('');
          }}
          className="fin-btn fin-btn-primary px-6 py-3 shrink-0"
        >
          <Plus className="w-5 h-5" />
          Provision New Wallet
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Registered Wallets', value: wallets.length, sub: 'Deterministic IDs', icon: Shield, color: 'indigo' },
          { label: 'Unique Assets', value: totalAssetsCount, sub: 'Across 4 Chains', icon: Layers, color: 'purple' },
          { label: 'Total Value', value: `$${totalPortfolioValue.toLocaleString(undefined, { minimumDigits: 2 })}`, sub: 'Live Market Data', icon: Globe, color: 'emerald' },
        ].map(stat => (
          <div key={stat.label} className="fin-card p-6 border-b-2" style={{ borderBottomColor: `var(--color-brand-${stat.color})` }}>
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-400`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="stat-label">{stat.label}</span>
            </div>
            <div className="stat-value text-3xl text-white font-mono">{stat.value}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2 px-2 py-0.5 bg-white/5 rounded-md inline-block">
              {stat.sub}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

        {/* Main Content */}
        <div className="xl:col-span-9 flex flex-col gap-6">
          <div className="fin-card overflow-hidden">
            <div className="p-6 border-b border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 bg-white/[0.02]">
              <div className="relative w-full md:w-96 group">
                <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Filter by hash or identity..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="fin-input w-full pl-11 py-2.5 text-xs font-semibold"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
                {['ALL', 'BTC', 'ETH', 'SOL', 'USDT'].map((asset) => (
                  <button
                    key={asset}
                    onClick={() => setFilterAsset(asset)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${filterAsset === asset
                      ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                      : 'bg-white/5 border-white/5 text-slate-500 hover:text-white'
                      }`}
                  >
                    {asset === 'ALL' ? 'Total' : asset}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="fin-table">
                <thead>
                  <tr>
                    <th>Owner</th>
                    <th>Wallet Address</th>
                    <th className="text-right">BTC</th>
                    <th className="text-right">ETH</th>
                    <th className="text-right">SOL</th>
                    <th className="text-right">USDT</th>
                    <th className="text-right">Market Value</th>
                    <th className="text-center">Ops</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWallets.length > 0 ? (
                    filteredWallets.map((w) => {
                      const totalVal = calculateWalletValue(w);
                      return (
                        <tr key={w.address} className="group">
                          <td className="font-bold text-white tracking-wide">{w.owner}</td>
                          <td>
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-[11px] text-slate-500">{w.address.substring(0, 10)}...{w.address.slice(-6)}</span>
                              <button
                                onClick={() => copyToClipboard(w.address)}
                                className="p-1.5 rounded-lg bg-white/5 text-slate-500 hover:text-indigo-400 transition-all opacity-0 group-hover:opacity-100"
                              >
                                {copiedAddress === w.address ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                          </td>
                          <td className="text-right font-mono text-slate-300">{w.BTC.toFixed(4)}</td>
                          <td className="text-right font-mono text-slate-300">{w.ETH.toFixed(2)}</td>
                          <td className="text-right font-mono text-slate-300">{w.SOL.toFixed(2)}</td>
                          <td className="text-right font-mono font-bold text-emerald-500">${w.USDT.toLocaleString()}</td>
                          <td className="text-right">
                            <span className="font-mono font-black text-white px-3 py-1 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
                              ${totalVal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                          </td>
                          <td>
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => openEditModal(w)}
                                className="p-2 rounded-lg bg-white/5 text-slate-500 hover:text-indigo-400 hover:bg-indigo-400/10 transition-all"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Authorize wallet deletion for ${w.owner}?`)) {
                                    deleteWallet(w.address);
                                  }
                                }}
                                className="p-2 rounded-lg bg-white/5 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="8" className="py-20 text-center text-slate-600 font-bold uppercase tracking-[0.2em] bg-white/[0.01]">
                        Index empty for query: "{search}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Map Explorer Sidebar */}
        <div className="xl:col-span-3 flex flex-col gap-6">
          <div className="fin-card bg-indigo-500/[0.02] border-indigo-500/20 sticky top-28">
            <div className="p-6 border-b border-indigo-500/10 flex items-center justify-between bg-indigo-500/5">
              <div className="flex items-center gap-3">
                <MapIcon className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white leading-none">Map Inspector</h3>
              </div>
              <div className="text-[10px] font-black text-indigo-400 bg-indigo-950/50 px-2 py-0.5 rounded border border-indigo-500/20">O(1)</div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                Real-time heap inspection of the deterministic <span className="font-mono text-indigo-300">walletsMap</span>.
              </p>

              <div className="space-y-3 max-h-[450px] overflow-y-auto no-scrollbar">
                {Array.from(walletsMap.entries()).map(([key, value]) => (
                  <div key={key} className="p-4 bg-black/40 border border-white/5 rounded-2xl group hover:border-indigo-500/30 transition-all">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
                      <span className="font-mono text-[9px] text-slate-500 uppercase tracking-tighter">{key.substring(0, 16)}...</span>
                      <ExternalLink className="w-3 h-3 text-slate-700 group-hover:text-indigo-400 transition-colors" />
                    </div>
                    <pre className="text-[9px] font-mono text-slate-400 leading-relaxed overflow-x-hidden">
                      <span className="text-indigo-400">"owner":</span> "{value.owner}",<br />
                      <span className="text-indigo-400">"assets":</span> {"{"}<br />
                      &nbsp;&nbsp;BTC:{value.BTC}, ETH:{value.ETH},<br />
                      &nbsp;&nbsp;SOL:{value.SOL}, USDT:{value.USDT}<br />
                      {"}"}
                    </pre>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex gap-3 items-start">
                <Info className="w-4 h-4 text-indigo-400 mt-1 shrink-0" />
                <span className="text-[10px] text-slate-400 font-medium leading-tight">
                  Unlike ES6 Objects, <span className="text-white">Maps</span> preserve insertion order and optimize for high-frequency address-key lookups.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      {[
        {
          open: isAddOpen,
          close: () => setIsAddOpen(false),
          submit: handleAddSubmit,
          title: 'Provision Exchange Wallet',
          subtitle: 'Initialize new secure asset storage',
          isEdit: false
        },
        {
          open: isEditOpen,
          close: () => setIsEditOpen(false),
          submit: handleEditSubmit,
          title: 'Modify Wallet States',
          subtitle: `Hash: ${editAddress}`,
          isEdit: true
        }
      ].map((modal) => modal.open && (
        <div key={modal.title} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6 animate-in">
          <div className="fin-card w-full max-w-xl shadow-2xl border-white/10 animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="p-8 border-b border-white/5 bg-gradient-to-r from-indigo-500/5 to-purple-500/5">
              <h3 className="text-2xl font-display font-black text-white mb-2">{modal.title}</h3>
              <p className="text-xs font-mono text-slate-500 tracking-tight">{modal.subtitle}</p>
            </div>

            <form onSubmit={modal.submit} className="p-8 space-y-6">
              {errorMsg && (
                <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl text-xs text-rose-400 font-bold flex items-center gap-3">
                  <ZapOff className="w-4 h-4" /> {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {!modal.isEdit && (
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="fin-input font-mono text-sm"
                      placeholder="0x..."
                    />
                  </div>
                )}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Authorized Owner</label>
                  <input
                    type="text"
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    className="fin-input font-semibold text-sm"
                    placeholder="Institutional ID"
                  />
                </div>

                {['BTC', 'ETH', 'SOL', 'USDT'].map(asset => (
                  <div key={asset} className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{asset} Balance</label>
                    <div className="relative">
                      <input
                        type="number" step="any" min="0"
                        value={asset === 'BTC' ? btc : asset === 'ETH' ? eth : asset === 'SOL' ? sol : usdt}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (asset === 'BTC') setBtc(v);
                          else if (asset === 'ETH') setEth(v);
                          else if (asset === 'SOL') setSol(v);
                          else setUsdt(v);
                        }}
                        className="fin-input pl-10 font-mono text-sm"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-indigo-400/50">{asset}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={modal.close}
                  className="fin-btn fin-btn-outline px-6"
                >
                  Terminate
                </button>
                <button
                  type="submit"
                  className="fin-btn fin-btn-primary px-8"
                >
                  {modal.isEdit ? 'Authorize Update' : 'Initialize Block'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ))}

    </div>
  );
}
