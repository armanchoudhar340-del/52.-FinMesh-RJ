import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { packTransaction } from '../utils/BitPacker';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, RotateCcw, Trash, Plus, Layers, ChevronRight, Cpu, Database,
  ArrowDown, Terminal, Binary, Hash, Zap, AlertCircle, History, Check, Info
} from 'lucide-react';

export default function UndoLog() {
  const { wallets, transactionStack, rolledBackTransactions, executeTransaction, undoLastTransaction, rollbackFailedTx } = useApp();

  const [sender, setSender] = useState('');
  const [receiver, setReceiver] = useState('');
  const [asset, setAsset] = useState('BTC');
  const [amount, setAmount] = useState('0.1');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [selectedTx, setSelectedTx] = useState(null);

  const transactions = transactionStack.toArray();
  const packedDetails = selectedTx ? packTransaction(selectedTx) : transactions[0] ? packTransaction(transactions[0]) : null;

  const handleTransfer = (e) => {
    e.preventDefault();
    setErrorMsg(''); setSuccessMsg('');
    if (!sender || !receiver) return setErrorMsg('Identity Exception: Source/Target undefined');
    if (sender === receiver) return setErrorMsg('Protocol Exception: Circular route detected');
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return setErrorMsg('Logic Exception: Quantized value must be positive');
    try {
      const tx = executeTransaction(sender, receiver, asset, amt);
      setSuccessMsg(`TX-${tx.id} Committed to Stack`);
      setSelectedTx(tx);
    } catch (err) { setErrorMsg(err.message); }
  };

  const handleUndo = () => {
    setErrorMsg(''); setSuccessMsg('');
    try {
      const u = undoLastTransaction();
      if (u) setSuccessMsg(`TX-${u.id} Reverted • State Restored`);
    } catch (err) { setErrorMsg(err.message); }
  };

  return (
    <div className="space-y-8 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-black text-white tracking-tight">Transaction Orchestrator</h2>
          <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-[0.2em]">Atomic LIFO State Management</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Stack Integrity</span>
            <span className="text-xs font-bold text-emerald-400">VERIFIED</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Database className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

        {/* ── Transaction Controls ── */}
        <div className="xl:col-span-4 space-y-6">
          <div className="fin-card p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Terminal className="w-20 h-20 text-indigo-500" />
            </div>

            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-400" />
              Push Transaction
            </h3>

            <AnimatePresence mode='wait'>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 text-xs text-rose-400 font-bold flex items-center gap-3 mb-6"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
                </motion.div>
              )}
              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-emerald-400 font-bold flex items-center gap-3 mb-6"
                >
                  <Check className="w-4 h-4 shrink-0" /> {successMsg}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleTransfer} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Source Entity</label>
                <select value={sender} onChange={e => setSender(e.target.value)} className="fin-input w-full font-semibold">
                  <option value="">Select Origin...</option>
                  <option value="EXTERNAL">SYSTEM_FAUCET</option>
                  {wallets.map(w => <option key={w.address} value={w.address}>{w.owner}</option>)}
                </select>
              </div>

              <div className="flex justify-center -my-2 relative z-10">
                <div className="p-2 rounded-full bg-slate-900 border border-white/5 text-slate-600">
                  <ArrowDown className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Destination Entity</label>
                <select value={receiver} onChange={e => setReceiver(e.target.value)} className="fin-input w-full font-semibold">
                  <option value="">Select Target...</option>
                  <option value="EXTERNAL">BURN_ADDRESS</option>
                  {wallets.map(w => <option key={w.address} value={w.address}>{w.owner}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Asset Category</label>
                  <select value={asset} onChange={e => setAsset(e.target.value)} className="fin-input w-full font-bold">
                    {['BTC', 'ETH', 'SOL', 'USDT'].map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Quantum</label>
                  <input type="number" step="any" min="0.0001" value={amount} onChange={e => setAmount(e.target.value)} className="fin-input w-full font-mono font-bold" />
                </div>
              </div>

              <button type="submit" className="fin-btn fin-btn-primary w-full py-4 text-xs font-black uppercase tracking-[0.2em]">
                Execute Block Push
              </button>
            </form>
          </div>

          <div className="fin-card p-6 border-rose-500/20 bg-rose-500/[0.02]">
            <button
              onClick={handleUndo}
              disabled={transactionStack.isEmpty()}
              className="fin-btn w-full py-4 bg-rose-500/10 border-rose-500/30 text-rose-500 hover:bg-rose-500/20 disabled:opacity-30 disabled:hover:bg-rose-500/10 text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Atomic POP (Undo)
            </button>
            <p className="text-[9px] text-slate-600 text-center font-bold uppercase tracking-widest mt-4">
              Pops Head Element & Reverts Balances
            </p>
          </div>
        </div>

        {/* ── Stack Visualizer ── */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          <div className="fin-card p-6 flex flex-col h-full border-indigo-500/20 relative">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">LIFO Stack</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5 font-mono">0xSTACK_MEM</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                Size: {transactionStack.size()}
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-end gap-3 min-h-[400px]">
              <AnimatePresence initial={false}>
                {transactions.length > 0 ? (
                  transactions.slice(0, 7).map((tx, idx) => {
                    const isTop = idx === 0;
                    return (
                      <motion.div
                        key={tx.id}
                        initial={{ opacity: 0, x: -20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 - idx * 0.02 }}
                        exit={{ opacity: 0, x: 20, scale: 0.95 }}
                        onClick={() => setSelectedTx(tx)}
                        className={`
                          cursor-pointer rounded-2xl p-4 border transition-all relative group
                          ${isTop
                            ? 'bg-indigo-500 border-indigo-400 shadow-xl shadow-indigo-500/20'
                            : 'bg-white/5 border-white/5 hover:border-white/10'}
                        `}
                      >
                        {isTop && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-amber-500 text-[8px] font-black text-black uppercase tracking-widest shadow-lg">
                            Stack Top
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${isTop ? 'bg-white/20' : 'bg-white/5'} text-${isTop ? 'white' : 'indigo-400'}`}>
                              <Hash className="w-4 h-4" />
                            </div>
                            <div>
                              <div className={`font-mono text-[10px] font-bold ${isTop ? 'text-white/70' : 'text-slate-500'}`}>TX #{tx.id}</div>
                              <div className={`text-sm font-black ${isTop ? 'text-white' : 'text-slate-200'}`}>{tx.amount} {tx.asset}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-[9px] font-black uppercase tracking-widest ${isTop ? 'text-white/80' : tx.status === 'SUCCESS' ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {tx.status}
                            </div>
                            <div className={`text-[9px] font-mono mt-0.5 ${isTop ? 'text-white/50' : 'text-slate-600'}`}>
                              {tx.sender.slice(0, 4)}... → {tx.receiver.slice(0, 4)}...
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-700 opacity-40">
                    <Database className="w-12 h-12 mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">Stack Null State</p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em] flex items-center justify-center gap-3">
                <div className="h-px w-8 bg-slate-800" /> Stack Base <div className="h-px w-8 bg-slate-800" />
              </span>
            </div>
          </div>
        </div>

        {/* ── Data Inspector (Feature H) ── */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          <div className="fin-card bg-emerald-500/[0.02] border-emerald-500/20 p-6 overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Binary className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Quantum Packer</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Bit-Level Optimization</p>
              </div>
            </div>

            {packedDetails ? (
              <div className="space-y-6">
                {/* Efficiency */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-black/40 border border-emerald-500/20">
                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest block mb-2">Memory Saved</span>
                    <span className="text-2xl font-display font-black text-emerald-400">{packedDetails.percentageSaved}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-black/40 border border-indigo-500/20">
                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest block mb-2">Comp Ratio</span>
                    <span className="text-2xl font-display font-black text-indigo-400">{packedDetails.compressionRatio}</span>
                  </div>
                </div>

                {/* Binary Hex */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-500">Packed Hex</span>
                    <span className="text-indigo-400 font-mono">{packedDetails.packedSize}B (55-bit)</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 text-sm font-mono font-bold text-white break-all tracking-widest">
                    0x{packedDetails.packedHex}
                  </div>
                </div>

                {/* Segment Inspection */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Bitfield Segments</label>
                  <div className="space-y-1">
                    {[
                      { label: 'TX_ID', bits: '16b', value: packedDetails.bitFields.id.bits, color: 'text-indigo-400' },
                      { label: 'ASSET_MAP', bits: '3b', value: packedDetails.bitFields.asset.bits, color: 'text-purple-400' },
                      { label: 'MANTISSA', bits: '20b', value: packedDetails.bitFields.amount.bits, color: 'text-emerald-400' },
                      { label: 'SRC_REF', bits: '8b', value: packedDetails.bitFields.sender.bits, color: 'text-amber-400' },
                      { label: 'DST_REF', bits: '8b', value: packedDetails.bitFields.receiver.bits, color: 'text-rose-400' },
                    ].map(seg => (
                      <div key={seg.label} className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5 hover:border-white/10 transition-all">
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] font-black text-slate-500 w-16">{seg.label}</span>
                          <span className="px-2 py-0.5 rounded-md bg-white/5 text-[8px] font-bold text-slate-600 font-mono">{seg.bits}</span>
                        </div>
                        <span className={`text-[10px] font-mono font-bold ${seg.color}`}>{seg.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex gap-3 text-[10px] text-slate-600 leading-relaxed italic">
                  <Info className="w-4 h-4 shrink-0 text-slate-700" />
                  Demonstrates memory optimization by packing complex JS objects into fixed-length binary buffers for high-throughput messaging.
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-slate-700 opacity-40">
                <Cpu className="w-12 h-12 mb-4 mx-auto" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">Inspector Ready</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ── Historical Log ── */}
      <div className="fin-card overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <History className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white">Full Transaction Audit Log</h3>
          </div>
          {rolledBackTransactions.length > 0 && (
            <span className="fin-badge fin-badge-danger uppercase text-[9px] px-3 font-black">
              {rolledBackTransactions.length} Rollbacks Detected
            </span>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="fin-table">
            <thead>
              <tr>
                <th>Identifier</th>
                <th>Source Address</th>
                <th>Target Address</th>
                <th>Asset</th>
                <th className="text-right">Quantity</th>
                <th>Status</th>
                <th className="text-center">Maintenance</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? transactions.map(tx => (
                <tr key={tx.id} onClick={() => setSelectedTx(tx)}
                  className={`cursor-pointer group ${selectedTx?.id === tx.id ? 'bg-indigo-500/10' : ''}`}>
                  <td className="font-mono font-black text-white">#{tx.id}</td>
                  <td className="font-mono text-slate-500 text-[10px]">{tx.sender}</td>
                  <td className="font-mono text-slate-500 text-[10px]">{tx.receiver}</td>
                  <td><span className="fin-badge fin-badge-indigo text-[9px] scale-90">{tx.asset}</span></td>
                  <td className="font-mono font-black text-white text-right">{tx.amount.toFixed(4)}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${tx.status === 'SUCCESS' ? 'bg-emerald-500 pulse-emerald' : 'bg-rose-500'}`} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${tx.status === 'SUCCESS' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {tx.status}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center justify-center">
                      {tx.status.startsWith('FAILED') ? (
                        <button onClick={(e) => { e.stopPropagation(); rollbackFailedTx(tx.id); }}
                          className="p-2 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-all flex items-center gap-2 text-[9px] font-black uppercase">
                          <Trash className="w-3.5 h-3.5" /> Purge
                        </button>
                      ) : <span className="text-slate-800 font-mono text-[9px]">NO_OPS</span>}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="7" className="py-20 text-center text-slate-600 font-bold uppercase tracking-[0.2em] italic opacity-40">Persistence Layer Empty</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
