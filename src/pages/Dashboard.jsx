import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import {
  Wallet, ArrowUpDown, History, Coins, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle2, ArrowRight, Zap, Activity,
  BarChart2, Globe, Clock, ShieldCheck, ZapOff, Sparkles, Filter
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import AnimatedCard from '../components/ui/AnimatedCard';

/* ── Error Boundary (Feature G) ─────────────────────────── */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMsg: '' };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, errorMsg: error.message };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-5 rounded-2xl border border-rose-500/20 bg-rose-500/5 animate-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <ZapOff className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-rose-400 block leading-tight">Safety Net Triggered</span>
              <span className="text-[10px] text-rose-500/70 font-bold uppercase tracking-widest">Protocol Override</span>
            </div>
          </div>
          <p className="text-xs text-rose-300/80 font-mono mb-4 px-3 py-2 bg-black/40 rounded-lg">{this.state.errorMsg}</p>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-black/20 border border-white/5 mb-4">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] font-bold text-slate-300 line-clamp-1">
              Safe Default: <span className="text-white font-mono">0.00</span> — Block Reverted
            </span>
          </div>

          <button
            onClick={() => this.setState({ hasError: false })}
            className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-rose-500/20 border border-rose-500/30 hover:bg-rose-500/30 transition-all uppercase tracking-widest"
          >Reset Engine</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function SafetyNetCalc() {
  const [a, setA] = useState('100');
  const [b, setB] = useState('0');
  const [result, setResult] = useState(null);

  const calc = (op) => {
    const v1 = parseFloat(a), v2 = parseFloat(b);
    if (isNaN(v1) || isNaN(v2)) throw new Error('ERR_NON_NUMERIC: Invalid assets detected');
    if (op === 'sub' && v1 - v2 < 0) throw new Error('ERR_NEG_BALANCE: Insufficient liquidation');
    if (op === 'div' && v2 === 0) throw new Error('ERR_ZERO_DIV: Division by zero block');
    const res = op === 'add' ? v1 + v2 : op === 'sub' ? v1 - v2 : op === 'mul' ? v1 * v2 : v1 / v2;
    setResult(res.toFixed(4));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Asset Qty A</label>
          <input type="text" value={a} onChange={e => setA(e.target.value)} className="fin-input w-full font-mono text-xs" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Asset Qty B</label>
          <input type="text" value={b} onChange={e => setB(e.target.value)} className="fin-input w-full font-mono text-xs" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[['Add', 'add'], ['Deduct', 'sub'], ['Divide', 'div']].map(([label, op]) => (
          <button key={op} onClick={() => calc(op)}
            className={`py-2 rounded-xl text-[10px] font-bold transition-all border uppercase tracking-widest ${op === 'div'
                ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20'
                : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
              }`}>
            {label}
          </button>
        ))}
      </div>
      {result !== null && (
        <div className="p-3 rounded-xl flex items-center justify-between bg-emerald-500/5 border border-emerald-500/20 animate-in">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Valid Output</span>
          </div>
          <span className="font-mono font-bold text-white text-base">{result}</span>
        </div>
      )}
      <div className="flex items-start gap-2 text-[10px] text-slate-600 leading-tight bg-white/5 p-3 rounded-lg border border-white/5">
        <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-500 mt-0.5" />
        <p>Set B = 0 and click <span className="text-slate-300 font-bold">Divide</span> to simulate node failure interception.</p>
      </div>
    </div>
  );
}

/* ── Main Dashboard ──────────────────────────────────────── */
export default function Dashboard() {
  const { wallets, totalPortfolioValue, transactionStack, tradeQueue, exchangePrices } = useApp();

  const chartData = [
    { t: '00:00', value: totalPortfolioValue * 0.91 },
    { t: '04:00', value: totalPortfolioValue * 0.95 },
    { t: '08:00', value: totalPortfolioValue * 0.93 },
    { t: '12:00', value: totalPortfolioValue * 1.02 },
    { t: '16:00', value: totalPortfolioValue * 0.98 },
    { t: '20:00', value: totalPortfolioValue * 1.04 },
    { t: 'Now', value: totalPortfolioValue },
  ];

  const queueLength = tradeQueue.size();
  const nextTrade = tradeQueue.peek();

  const stats = [
    {
      label: 'Portfolio Value',
      value: `$${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      sub: '+12.4% vs last week',
      subUp: true,
      icon: Wallet,
      color: 'indigo'
    },
    {
      label: 'Active Queue',
      value: queueLength,
      sub: 'FIFO settlement pending',
      icon: ArrowUpDown,
      color: 'emerald'
    },
    {
      label: 'Operation Stack',
      value: transactionStack.size(),
      sub: 'LIFO undo entries',
      icon: History,
      color: 'amber'
    },
    {
      label: 'Managed Assets',
      value: wallets.length,
      sub: '4 chains connected',
      icon: Coins,
      color: 'purple'
    },
  ];

  return (
    <div className="w-full space-y-8 animate-in">

      {/* ── HERO SECTION ──────────────────────────────── */}
      <section className="fin-card relative p-8 lg:p-12 overflow-hidden bg-gradient-to-br from-indigo-950/40 via-slate-950 to-purple-950/30">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="fin-badge fin-badge-indigo p-1 px-3">Mainnet-1</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Globe className="w-3 h-3" /> US-EAST-1 Node
              </span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-display font-black text-white tracking-tighter leading-none mb-6">
              FinMesh <span className="text-indigo-500">Terminal</span>
            </h1>
            <p className="text-slate-400 text-lg lg:text-xl font-medium max-w-lg mb-8">
              Institutional-grade digital asset settlement engine with real-time risk orchestration.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/wallets" className="fin-btn fin-btn-primary px-8 py-3.5">
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/analytics" className="fin-btn fin-btn-outline px-8 py-3.5">
                Market Analytics
              </Link>
            </div>
          </div>

          <div className="lg:w-72 space-y-4">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Safety Status</span>
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> SECURE
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Auto-Liquidation</span>
                  <span className="text-xs text-white font-bold">Enabled</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Risk Protocol</span>
                  <span className="text-xs text-indigo-400 font-bold font-mono">ANSI-Z</span>
                </div>
                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Latency</span>
                  <span className="text-xs text-emerald-500 font-mono">1.2ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STAT CARDS ──────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="fin-card fin-card-hover p-6 group">
              <div className="flex items-center justify-between mb-6">
                <div className={`p-3 rounded-2xl bg-${s.color}-500/10 text-${s.color}-400 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className={`text-[10px] font-bold ${s.subUp ? 'text-emerald-400' : 'text-slate-500'} bg-white/5 px-2 py-0.5 rounded-full`}>
                  {s.subUp ? '▲ ' + s.sub : s.sub}
                </div>
              </div>
              <div>
                <span className="stat-label mb-1 block">{s.label}</span>
                <div className="stat-value text-2xl text-white font-mono tracking-tight">
                  {s.value}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── MAIN GRID ──────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

        {/* Portfolio Growth Chart */}
        <div className="xl:col-span-8 flex flex-col gap-8">
          <div className="fin-card p-8 min-h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-2xl font-display font-black text-white mb-1">Growth Forecast</h3>
                <p className="text-sm text-slate-500 font-medium tracking-wide">Real-time aggregate performance metrics</p>
              </div>
              <div className="flex gap-2">
                {['1H', '1D', '1W', 'ALL'].map(t => (
                  <button key={t} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${t === '1D' ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-white/5 border-white/5 text-slate-500 hover:text-white'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 w-full min-h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                  <XAxis
                    dataKey="t"
                    stroke="#475569"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis
                    stroke="#475569"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
                    labelStyle={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, marginBottom: 4 }}
                    itemStyle={{ color: '#fff', fontSize: 13, fontWeight: 800 }}
                    cursor={{ stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '5 5' }}
                    formatter={v => [`$${parseFloat(v).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 'Portfolio Value']}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#6366f1"
                    strokeWidth={4}
                    fill="url(#chartGradient)"
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pending Trades */}
          <div className="fin-card p-0 overflow-hidden">
            <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white leading-none">Settlement Priority</h3>
                  <p className="text-xs text-slate-500 mt-1">Next trade in high-frequency queue</p>
                </div>
              </div>
              <Link to="/queue" className="fin-btn fin-btn-outline py-2 px-4 text-[10px]">
                Manage Queue
              </Link>
            </div>
            <div className="p-8">
              {nextTrade ? (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg ${nextTrade.type === 'BUY' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                      {nextTrade.asset.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`fin-badge ${nextTrade.type === 'BUY' ? 'fin-badge-success' : 'fin-badge-danger'} scale-90`}>{nextTrade.type}</span>
                        <span className="text-lg font-black text-white">{nextTrade.quantity} {nextTrade.asset}</span>
                      </div>
                      <span className="text-xs font-mono text-slate-500 tracking-tighter">{nextTrade.walletAddress.substring(0, 24)}...</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:flex md:items-center gap-8 lg:gap-14">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Execution Price</p>
                      <p className="text-base font-bold text-white font-mono">${nextTrade.price.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Notional Value</p>
                      <p className="text-base font-bold text-indigo-400 font-mono">${(nextTrade.quantity * nextTrade.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-slate-600 border border-dashed border-white/10 rounded-2xl">
                  <Sparkles className="w-10 h-10 mb-4 opacity-20" />
                  <p className="text-sm font-bold tracking-wider uppercase opacity-40">Queue cleared • Waiting for intake</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Side Panels */}
        <div className="xl:col-span-4 flex flex-col gap-8">
          {/* Live Market */}
          <div className="fin-card flex flex-col overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-indigo-500/5">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Market Depth</h3>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-emerald" />
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-[10px] font-bold text-slate-400 font-mono">
                <Activity className="w-3 h-3 text-indigo-400" /> 2,342 msg/s
              </div>
            </div>

            <div className="p-3 space-y-1">
              {Object.entries(exchangePrices).map(([asset, prices]) => {
                const avg = (prices.A + prices.B + prices.C) / 3;
                const up = Math.random() > 0.4;
                const change = (Math.random() * 3 - 0.5).toFixed(2);
                return (
                  <div key={asset} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/[0.03] border border-transparent hover:border-white/5 transition-all group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${asset === 'BTC' ? 'bg-orange-500/10 text-orange-400' : asset === 'ETH' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                        {asset}
                      </div>
                      <div>
                        <span className="text-sm font-bold text-white block leading-tight">{asset} / USDT</span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{asset === 'BTC' ? 'Bitcoin' : asset === 'ETH' ? 'Ethereum' : 'Solana'}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white font-mono group-hover:text-indigo-400 transition-colors">
                        ${avg.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <p className={`text-[10px] font-black flex items-center justify-end gap-1 mt-0.5 ${up ? 'text-emerald-400' : 'text-rose-500'}`}>
                        {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {Math.abs(change)}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-auto p-4 bg-white/[0.02] border-t border-white/5">
              <button className="w-full py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors">
                View Full Orderbook
              </button>
            </div>
          </div>

          {/* Safety Net Module */}
          <div className="fin-card p-6 border-indigo-500/20 bg-indigo-500/[0.02]">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Safety Engine</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Boundary Protocol v4.2</p>
              </div>
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-500/10">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>

            <ErrorBoundary>
              <SafetyNetCalc />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  );
}
