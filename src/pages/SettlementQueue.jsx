import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRightLeft,
  Play,
  FastForward,
  Trash2,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  Layers,
  Zap,
  Activity,
  Cpu,
  Database,
  ArrowRight,
  ShieldCheck,
  Check,
  AlertCircle
} from 'lucide-react';

export default function SettlementQueue() {
  const {
    wallets,
    tradeQueue,
    placeTrade,
    processNextTrade,
    getAssetPrice
  } = useApp();

  // Form states
  const [type, setType] = useState('BUY'); // BUY or SELL
  const [asset, setAsset] = useState('BTC');
  const [quantity, setQuantity] = useState('0.5');
  const [price, setPrice] = useState('');
  const [selectedWallet, setSelectedWallet] = useState('');

  // Info/Feedback messages
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const queueItems = tradeQueue.toArray();
  const queueLength = tradeQueue.size();
  const frontTrade = tradeQueue.peek();
  const rearTrade = tradeQueue.rear();

  // Pre-fill current market price when asset changes
  const handleAssetChange = (newAsset) => {
    setAsset(newAsset);
    const mktPrice = getAssetPrice(newAsset).toFixed(2);
    setPrice(mktPrice);
  };

  // Initialize limit price if empty
  useEffect(() => {
    if (!price && asset) {
      setPrice(getAssetPrice(asset).toFixed(2));
    }
  }, [asset, price, getAssetPrice]);

  const handlePlaceTrade = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!selectedWallet) {
      setErrorMsg('Routing Error: Clearing wallet context undefined');
      return;
    }

    const qty = parseFloat(quantity);
    const prc = parseFloat(price);

    if (isNaN(qty) || qty <= 0) {
      setErrorMsg('Quantum Exception: Quantity must be non-zero positive');
      return;
    }
    if (isNaN(prc) || prc <= 0) {
      setErrorMsg('Valuation Exception: Limit price exceeds lower bound');
      return;
    }

    try {
      const trade = placeTrade(type, asset, qty, prc, selectedWallet);
      setSuccessMsg(`Order Enqueued: TRD-${trade.id} committed to pipe`);
      setQuantity('0.5');
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleProcessNext = () => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = processNextTrade();
      if (res && res.success) {
        const trade = res.trade;
        const total = (trade.quantity * trade.price).toFixed(2);
        setSuccessMsg(`Settlement Confirmed: TRD-${trade.id} finalized @ $${trade.price}`);
      }
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleProcessAll = () => {
    setErrorMsg('');
    setSuccessMsg('');
    if (tradeQueue.isEmpty()) {
      setErrorMsg('Queue Exception: Inlet buffer at zero capacity');
      return;
    }

    let count = 0;
    let errors = [];

    // Loop through queue size
    const limit = tradeQueue.size();
    for (let i = 0; i < limit; i++) {
      try {
        const res = processNextTrade();
        if (res && res.success) count++;
      } catch (err) {
        errors.push(err.message);
      }
    }

    if (errors.length > 0) {
      setErrorMsg(`Partial Settlement: ${count} completed, ${errors.length} failed`);
    } else {
      setSuccessMsg(`Batch Clear: All pending orders finalized successfully`);
    }
  };

  return (
    <div className="space-y-8 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-black text-white tracking-tight">Settlement Clearing House</h2>
          <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-[0.2em]">Automated FIFO Transaction Pipeline</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pipeline Health</span>
            <span className="text-xs font-bold text-emerald-400">ACTIVE</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Activity className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="fin-card p-6 border-emerald-500/20 bg-emerald-500/[0.02] relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Play className="w-24 h-24 text-emerald-500" />
          </div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-3">Head Node (FIFO)</span>
          {frontTrade ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`fin-badge text-[9px] ${frontTrade.type === 'BUY' ? 'fin-badge-success' : 'fin-badge-danger'}`}>
                  {frontTrade.type}
                </span>
                <span className="text-xl font-display font-black text-white">{frontTrade.quantity} {frontTrade.asset}</span>
              </div>
              <div className="font-mono text-[10px] text-slate-500 mt-1">
                ID: {frontTrade.id} • ${frontTrade.price.toFixed(2)}
              </div>
            </div>
          ) : (
            <div className="text-sm font-bold text-slate-700 py-4 uppercase tracking-widest">Buffer Empty</div>
          )}
        </div>

        <div className="fin-card p-6 border-indigo-500/20 bg-indigo-500/[0.02] relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Database className="w-24 h-24 text-indigo-500" />
          </div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-3">Rear Inlet</span>
          {rearTrade ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`fin-badge text-[9px] ${rearTrade.type === 'BUY' ? 'fin-badge-success' : 'fin-badge-danger'}`}>
                  {rearTrade.type}
                </span>
                <span className="text-xl font-display font-black text-white">{rearTrade.quantity} {rearTrade.asset}</span>
              </div>
              <div className="font-mono text-[10px] text-slate-500 mt-1">
                ID: {rearTrade.id} • ${rearTrade.price.toFixed(2)}
              </div>
            </div>
          ) : (
            <div className="text-sm font-bold text-slate-700 py-4 uppercase tracking-widest">Null Entry</div>
          )}
        </div>

        <div className="fin-card p-6 bg-slate-500/[0.02]">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-3">Queue Capacity</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-black text-white">{queueLength}</span>
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Pending</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(queueLength * 10, 100)}%` }} />
          </div>
        </div>

        <div className="fin-card p-6 bg-slate-500/[0.02] flex flex-col justify-between">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-1.5">Asset Spread</span>
          <div className="flex items-center gap-4">
            {['BTC', 'ETH', 'SOL'].map(a => (
              <div key={a} className="text-center">
                <div className="text-[10px] font-mono text-slate-500">{a}</div>
                <div className="text-xs font-black text-white">${getAssetPrice(a).toFixed(0)}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-1 mt-3">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className={`h-1 flex-1 rounded-full ${i <= 4 ? 'bg-indigo-500/40' : 'bg-slate-800'}`} />)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Order Form */}
        <div className="lg:col-span-4 space-y-6">
          <div className="fin-card p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Zap className="w-20 h-20 text-indigo-400" />
            </div>

            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              Limit Order Entry
            </h3>

            {(errorMsg || successMsg) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl mb-6 text-xs font-bold flex items-center gap-3 border ${errorMsg ? 'bg-rose-500/5 border-rose-500/20 text-rose-400' : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                  }`}
              >
                {errorMsg ? <AlertCircle className="w-4 h-4 shrink-0" /> : <Check className="w-4 h-4 shrink-0" />}
                {errorMsg || successMsg}
              </motion.div>
            )}

            <form onSubmit={handlePlaceTrade} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Trading Side</label>
                <div className="grid grid-cols-2 gap-2 p-1.5 bg-black/40 rounded-2xl border border-white/5">
                  <button
                    type="button"
                    onClick={() => setType('BUY')}
                    className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${type === 'BUY'
                      ? 'bg-emerald-500 text-white shadow-lg'
                      : 'text-slate-500 hover:text-slate-300'
                      }`}
                  >
                    Bid (Buy)
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('SELL')}
                    className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${type === 'SELL'
                      ? 'bg-rose-500 text-white shadow-lg'
                      : 'text-slate-500 hover:text-slate-300'
                      }`}
                  >
                    Ask (Sell)
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Clearing Account</label>
                <select
                  value={selectedWallet}
                  onChange={(e) => setSelectedWallet(e.target.value)}
                  className="fin-input w-full font-bold"
                >
                  <option value="">Select funding wallet...</option>
                  {wallets.map(w => (
                    <option key={w.address} value={w.address}>{w.owner} (0x{w.address.substring(0, 8)})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Asset</label>
                  <select
                    value={asset}
                    onChange={(e) => handleAssetChange(e.target.value)}
                    className="fin-input w-full font-bold"
                  >
                    <option value="BTC">BTC</option>
                    <option value="ETH">ETH</option>
                    <option value="SOL">SOL</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Quantity</label>
                  <input
                    type="number" step="any" min="0.0001"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="fin-input w-full font-mono font-bold text-center"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Limit Price (USDT)</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-bold">$</div>
                  <input
                    type="number" step="any" min="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="fin-input w-full pl-8 font-mono font-bold"
                    placeholder="Market Price"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="fin-btn fin-btn-primary w-full py-4 text-xs font-black uppercase tracking-[0.2em]"
              >
                Enqueue Market Order
              </button>
            </form>
          </div>
        </div>

        {/* Queue Visualizer */}
        <div className="lg:col-span-8 space-y-8">

          <div className="fin-card p-6 border-indigo-500/20 relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Pipeline Visualization</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-0.5">FIFO Asynchronous State Tape</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleProcessNext}
                  disabled={tradeQueue.isEmpty()}
                  className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-all disabled:opacity-30 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                >
                  <Play className="w-3.5 h-3.5" /> Dequeue
                </button>
                <button
                  onClick={handleProcessAll}
                  disabled={tradeQueue.isEmpty()}
                  className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-all disabled:opacity-30 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                >
                  <FastForward className="w-3.5 h-3.5" /> Flush All
                </button>
              </div>
            </div>

            <div className="bg-black/40 rounded-2xl border border-white/5 p-6 flex items-center justify-between gap-6 overflow-hidden relative min-h-[160px]">
              {/* Visual Indicators */}
              <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black/80 to-transparent z-10 flex items-center justify-center pointer-events-none">
                <div className="rotate-90 text-[10px] font-black text-emerald-500/40 uppercase tracking-[0.5em] -translate-x-4">Settlement</div>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black/80 to-transparent z-10 flex items-center justify-center pointer-events-none">
                <div className="rotate-90 text-[10px] font-black text-indigo-500/40 uppercase tracking-[0.5em] translate-x-4">Ingestion</div>
              </div>

              <div className="flex-1 flex gap-4 overflow-x-auto no-scrollbar py-4 px-12">
                <AnimatePresence initial={false}>
                  {queueItems.length > 0 ? (
                    queueItems.map((trade, idx) => (
                      <motion.div
                        key={trade.id}
                        layout
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -50, scale: 0.9 }}
                        className={`
                            min-w-[200px] p-4 rounded-2xl border relative shrink-0 transition-all
                            ${idx === 0
                            ? 'bg-indigo-500 border-indigo-400 shadow-xl shadow-indigo-500/20'
                            : 'bg-white/[0.03] border-white/10 hover:border-white/20'}
                          `}
                      >
                        <div className={`absolute top-3 right-4 font-mono text-[9px] font-black ${idx === 0 ? 'text-white/60' : 'text-slate-600'}`}>
                          {idx === 0 ? 'FRONT' : `R+${idx}`}
                        </div>
                        <div className={`text-[9px] font-bold uppercase tracking-widest mb-1 ${idx === 0 ? 'text-white/70' : 'text-slate-500'}`}>TRD-{trade.id}</div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${idx === 0 ? 'bg-white/20 text-white' : trade.type === 'BUY' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                            {trade.type}
                          </span>
                          <span className={`text-sm font-black ${idx === 0 ? 'text-white' : 'text-slate-200'}`}>{trade.quantity} {trade.asset}</span>
                        </div>
                        <div className={`text-[10px] font-mono ${idx === 0 ? 'text-white/80' : 'text-slate-500'}`}>LMT: ${trade.price.toFixed(2)}</div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="w-full flex flex-col items-center justify-center text-slate-700 opacity-30 py-4">
                      <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-800 flex items-center justify-center mb-2">
                        <ArrowRight className="w-6 h-6" />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em]">Buffer Ready for Ingest</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="fin-card overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white">Clearing Ledger</h3>
              </div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] font-mono">Pipe: 0xSETTLE_FIFO</div>
            </div>
            <div className="overflow-x-auto">
              <table className="fin-table">
                <thead>
                  <tr>
                    <th>Sequence</th>
                    <th>Ticket</th>
                    <th>Account</th>
                    <th>Side</th>
                    <th>Asset</th>
                    <th className="text-right">Quantum</th>
                    <th className="text-right">Valuation</th>
                    <th className="text-right">Total Est.</th>
                  </tr>
                </thead>
                <tbody>
                  {queueItems.length > 0 ? (
                    queueItems.map((trade, idx) => (
                      <tr key={trade.id} className="group">
                        <td>
                          <div className="flex items-center gap-2 font-mono font-black text-slate-500">
                            #{idx + 1}
                            {idx === 0 && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                          </div>
                        </td>
                        <td className="font-mono text-slate-500 text-[10px]">FIX-{trade.id.toString(16).toUpperCase()}</td>
                        <td className="font-mono text-slate-500 text-[10px]">0x{trade.walletAddress.substring(0, 8)}</td>
                        <td>
                          <span className={`text-[9px] font-black uppercase tracking-widest ${trade.type === 'BUY' ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {trade.type}
                          </span>
                        </td>
                        <td className="text-white font-black">{trade.asset}</td>
                        <td className="text-right font-mono text-slate-300">{trade.quantity.toFixed(4)}</td>
                        <td className="text-right font-mono text-slate-300 font-bold">${trade.price.toLocaleString()}</td>
                        <td className="text-right font-mono text-indigo-400 font-black">${(trade.quantity * trade.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="py-20 text-center text-slate-700 font-black uppercase tracking-[0.3em] italic">FIFO pipeline at zero throughput</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
