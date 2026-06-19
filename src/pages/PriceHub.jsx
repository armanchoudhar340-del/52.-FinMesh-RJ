import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Coins,
  ArrowUpRight,
  Zap,
  HelpCircle,
  History,
  ShieldCheck,
  Activity,
  ArrowRight,
  TrendingDown,
  Scale,
  DollarSign,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function PriceHub() {
  const {
    exchangePrices,
    arbitrageLogs,
    triggerArbitrage,
    wallets
  } = useApp();

  const [selectedAsset, setSelectedAsset] = useState('BTC');
  const [tradeAmount, setTradeAmount] = useState('1.0');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Calculate cheapest buy and dearest sell exchange for a specific asset
  const getArbitrageDetails = (asset) => {
    const prices = exchangePrices[asset];
    if (!prices) return null;

    let bestBuyEx = 'A';
    let bestSellEx = 'A';
    let minPrice = prices.A;
    let maxPrice = prices.A;

    Object.keys(prices).forEach(ex => {
      if (prices[ex] < minPrice) {
        minPrice = prices[ex];
        bestBuyEx = ex;
      }
      if (prices[ex] > maxPrice) {
        maxPrice = prices[ex];
        bestSellEx = ex;
      }
    });

    const diff = maxPrice - minPrice;
    const percentageDiff = (diff / minPrice) * 100;

    return {
      bestBuyEx,
      bestSellEx,
      minPrice,
      maxPrice,
      diff,
      percentageDiff
    };
  };

  const getExchangeName = (ex) => {
    if (ex === 'A') return 'BinanceX';
    if (ex === 'B') return 'CoinbasePro';
    if (ex === 'C') return 'KrakenPrime';
    return ex;
  };

  const handleExecuteArbitrage = (e) => {
    e.preventDefault();
    setFeedbackMsg('');
    setErrorMsg('');

    const amt = parseFloat(tradeAmount);
    if (isNaN(amt) || amt <= 0) {
      setErrorMsg('Please specify a valid trade size!');
      return;
    }

    const arb = getArbitrageDetails(selectedAsset);
    if (!arb || arb.diff <= 0) {
      setErrorMsg('No profitable arbitrage opportunity found at this time.');
      return;
    }

    // Profit = quantity * diff
    const profit = parseFloat((amt * arb.diff).toFixed(2));

    try {
      triggerArbitrage(
        selectedAsset,
        amt,
        getExchangeName(arb.bestBuyEx),
        getExchangeName(arb.bestSellEx),
        profit
      );
      setFeedbackMsg(`Success! Executed ${amt} ${selectedAsset} arbitrage. Arbitrage ID ${Math.floor(Math.random() * 1000)} settled.`);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  // Pre-calculate details for all assets
  const arbitrageSummary = {
    BTC: getArbitrageDetails('BTC'),
    ETH: getArbitrageDetails('ETH'),
    SOL: getArbitrageDetails('SOL')
  };

  const activeArb = arbitrageSummary[selectedAsset];
  const activeProfit = activeArb ? (parseFloat(tradeAmount) * activeArb.diff).toFixed(2) : 0;

  return (
    <div className="space-y-8 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-black text-white tracking-tight italic">Price Oracle</h2>
          <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-[0.2em]">Cross-Exchange Fluidity & Arbitrage Engine</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Oracle Sync</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <Activity className="w-3 h-3" /> REALTIME
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Scale className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Live Market Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['BTC', 'ETH', 'SOL'].map((asset) => {
          const prices = exchangePrices[asset];
          const summary = arbitrageSummary[asset];
          if (!prices || !summary) return null;

          return (
            <motion.div
              layout
              key={asset}
              className="fin-card p-6 relative overflow-hidden group border-indigo-500/10"
            >
              {summary.percentageDiff > 0.08 && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors animate-pulse" />
              )}

              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center font-black text-[10px] text-indigo-400">
                    {asset}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white tracking-tight">{asset}/USDT</h3>
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-wider">Spot Index</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase flex items-center gap-1.5 ${summary.percentageDiff > 0.08 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-black/40 text-slate-500'
                  }`}>
                  {summary.percentageDiff > 0.08 && <Zap className="w-3 h-3 fill-current" />}
                  Spread {summary.percentageDiff.toFixed(2)}%
                </div>
              </div>

              <div className="space-y-3 mb-6 relative z-10">
                {[
                  { id: 'A', name: 'BinanceX' },
                  { id: 'B', name: 'CoinbasePro' },
                  { id: 'C', name: 'KrakenPrime' }
                ].map(ex => (
                  <div key={ex.id} className="flex justify-between items-center p-3 rounded-2xl bg-black/20 border border-white/5 group-hover:border-white/10 transition-colors">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{ex.name}</span>
                    <span className={`font-mono font-bold text-xs ${summary.bestBuyEx === ex.id ? 'text-emerald-400' : summary.bestSellEx === ex.id ? 'text-rose-400' : 'text-slate-300'}`}>
                      ${prices[ex.id].toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 relative z-10">
                <div className="bg-emerald-500/5 p-3 rounded-2xl border border-emerald-500/10 flex flex-col items-center">
                  <span className="text-[9px] font-black text-emerald-500/70 uppercase tracking-[0.2em] mb-1">Buy Logic</span>
                  <span className="text-[10px] font-black text-white uppercase">{getExchangeName(summary.bestBuyEx)}</span>
                </div>
                <div className="bg-rose-500/5 p-3 rounded-2xl border border-rose-500/10 flex flex-col items-center">
                  <span className="text-[9px] font-black text-rose-500/70 uppercase tracking-[0.2em] mb-1">Sell Logic</span>
                  <span className="text-[10px] font-black text-white uppercase">{getExchangeName(summary.bestSellEx)}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Arbitrage Command Center */}
        <div className="lg:col-span-4 space-y-8">
          <div className="fin-card p-6 relative overflow-hidden flex flex-col border-indigo-500/20">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Zap className="w-24 h-24 text-amber-500" />
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Flash Arb</h3>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-0.5">Risk-Neutral spread capture</p>
              </div>
            </div>

            <AnimatePresence mode='wait'>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 flex items-start gap-3"
                >
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span className="text-[10px] font-bold text-rose-400 leading-relaxed uppercase">{errorMsg}</span>
                </motion.div>
              )}
              {feedbackMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex items-start gap-3"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-[10px] font-bold text-emerald-400 leading-relaxed uppercase">{feedbackMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleExecuteArbitrage} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block">Execution Pair</label>
                <select
                  value={selectedAsset}
                  onChange={(e) => setSelectedAsset(e.target.value)}
                  className="fin-input w-full px-4 py-3 text-xs font-bold font-mono"
                >
                  <option value="BTC">BTC / USDT</option>
                  <option value="ETH">ETH / USDT</option>
                  <option value="SOL">SOL / USDT</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block">Payload Size (Units)</label>
                <div className="relative">
                  <Coins className="w-4 h-4 text-slate-700 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="number" step="any" min="0.001"
                    value={tradeAmount}
                    onChange={(e) => setTradeAmount(e.target.value)}
                    className="fin-input w-full pl-11 pr-4 py-3 text-sm font-black font-mono"
                  />
                </div>
              </div>

              {activeArb && (
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Est. Capture</span>
                    <span className="text-sm font-black text-white font-mono">${activeProfit}</span>
                  </div>
                  <div className="w-full h-px bg-white/5" />
                  <div className="flex items-center gap-3">
                    <div className="flex-1 text-[9px] font-black text-slate-500 uppercase leading-snug">
                      Routing through {getExchangeName(activeArb.bestBuyEx)} and {getExchangeName(activeArb.bestSellEx)}
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="fin-btn w-full py-4 text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98]"
                style={{ backgroundColor: 'var(--fin-emerald)', border: 'none' }}
              >
                Execute Sweep
              </button>
            </form>
          </div>
        </div>

        {/* Transaction Ledger */}
        <div className="lg:col-span-8 space-y-8">
          <div className="fin-card p-6 border-indigo-500/10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <History className="w-5 h-5 font-bold" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">Arbitrage Execution Log</h3>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-0.5">Historical spread captures</p>
                </div>
              </div>
              <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-400 uppercase tracking-widest">
                SECURE SETTLEMENT
              </div>
            </div>

            <div className="overflow-x-auto no-scrollbar">
              <table className="fin-table">
                <thead>
                  <tr>
                    <th className="text-[9px] font-black uppercase tracking-widest text-slate-500 py-4">Descriptor</th>
                    <th className="text-[9px] font-black uppercase tracking-widest text-slate-500 py-4">Entity</th>
                    <th className="text-[9px] font-black uppercase tracking-widest text-slate-500 py-4 text-right">Units</th>
                    <th className="text-[9px] font-black uppercase tracking-widest text-slate-500 py-4">Routing Path</th>
                    <th className="text-[9px] font-black uppercase tracking-widest text-slate-500 py-4 text-right">Capture Yield</th>
                    <th className="text-[9px] font-black uppercase tracking-widest text-slate-500 py-4 text-right">Txn Hash</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence initial={false}>
                    {arbitrageLogs.length > 0 ? (
                      arbitrageLogs.map((log) => (
                        <motion.tr
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          key={log.id}
                          className="group hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="py-5 font-mono text-[10px] text-slate-600 font-black">#ARB_{log.id}</td>
                          <td className="py-5">
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{log.asset}</span>
                          </td>
                          <td className="py-5 text-right font-mono text-[10px] text-slate-400 font-bold">{log.amount.toFixed(4)}</td>
                          <td className="py-5">
                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                              {log.buyFrom} <ArrowRight className="w-3 h-3 text-slate-700" /> {log.sellTo}
                            </div>
                          </td>
                          <td className="py-5 text-right">
                            <span className="text-[10px] font-black text-emerald-400 font-mono">+$ {log.profit.toFixed(2)}</span>
                          </td>
                          <td className="py-5 text-right">
                            <div className="px-2 py-0.5 rounded bg-black/40 border border-white/5 inline-block font-mono text-[8px] text-slate-600 font-black group-hover:text-slate-400 transition-colors">
                              0x{log.txId.substring(0, 8)}...
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="py-20 text-center">
                          <Layers className="w-12 h-12 text-slate-800 mx-auto mb-4 opacity-50" />
                          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">No Arbitrage Events Detected</p>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            <div className="mt-auto pt-6 border-t border-white/5 flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Delta Neutral Strategy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Cross-Exchange Settlement</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
