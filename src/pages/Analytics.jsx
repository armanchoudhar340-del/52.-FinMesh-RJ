import React from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line,
  BarChart, Bar,
  CartesianGrid
} from 'recharts';
import {
  TrendingUp,
  Wallet,
  ArrowUpDown,
  CheckCircle,
  Activity,
  Layers,
  Zap,
  Clock,
  Briefcase,
  PieChart as PieIcon,
  LineChart as LineIcon,
  BarChart3,
  Cpu
} from 'lucide-react';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e'];

export default function Analytics() {
  const {
    wallets,
    tradeQueue,
    settledTradesCount,
    totalTradesCount,
    getAssetPrice,
    transactionStack
  } = useApp();

  const activeWallets = wallets.length;
  const pendingQueue = tradeQueue.size();

  // 1. DYNAMIC DATA: Calculate Asset Allocation breakdown across all wallets
  const assetTotals = { BTC: 0, ETH: 0, SOL: 0, USDT: 0 };
  wallets.forEach(w => {
    assetTotals.BTC += w.BTC;
    assetTotals.ETH += w.ETH;
    assetTotals.SOL += w.SOL;
    assetTotals.USDT += w.USDT;
  });

  const assetDistributionData = [
    { name: 'BTC', value: parseFloat((assetTotals.BTC * getAssetPrice('BTC')).toFixed(2)) },
    { name: 'ETH', value: parseFloat((assetTotals.ETH * getAssetPrice('ETH')).toFixed(2)) },
    { name: 'SOL', value: parseFloat((assetTotals.SOL * getAssetPrice('SOL')).toFixed(2)) },
    { name: 'USDT', value: parseFloat(assetTotals.USDT.toFixed(2)) },
  ].filter(item => item.value > 0);

  // 2. MOCK DATA: Historical Trade Volume (Bar Chart)
  const tradeVolumeData = [
    { day: 'Mon', Volume: 125000 },
    { day: 'Tue', Volume: 184000 },
    { day: 'Wed', Volume: 242000 },
    { day: 'Thu', Volume: 155000 },
    { day: 'Fri', Volume: 298000 },
    { day: 'Sat', Volume: 320000 },
    { day: 'Sun', Volume: 410000 },
  ];

  // 3. MOCK DATA: Wallet Growth (Line Chart)
  const walletGrowthData = [
    { name: 'March', Accounts: 8 },
    { name: 'April', Accounts: 15 },
    { name: 'May', Accounts: 24 },
    { name: 'June', Accounts: activeWallets + 20 }
  ];

  // 4. DYNAMIC/MOCK DATA: Success vs Rollback/Fail rate trends (Bar Chart)
  const txHistoryCount = transactionStack.size();
  const txTrendData = [
    { period: 'W1', Success: 18, Reverted: 2 },
    { period: 'W2', Success: 25, Reverted: 4 },
    { period: 'W3', Success: 32, Reverted: 1 },
    { period: 'W4', Success: txHistoryCount, Reverted: 3 }
  ];

  const kpis = [
    { label: 'Active Entities', value: activeWallets, color: 'text-white', icon: Wallet },
    { label: 'Network Throughput', value: totalTradesCount, color: 'text-indigo-400', icon: Activity },
    { label: 'Queue Latency', value: pendingQueue, color: 'text-amber-500', icon: Clock },
    { label: 'Settlement Yield', value: settledTradesCount, color: 'text-emerald-400', icon: CheckCircle },
    { label: 'Token Assets', value: 4, color: 'text-white', icon: Briefcase },
  ];

  return (
    <div className="space-y-8 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-black text-white tracking-tight italic">Operations Hub</h2>
          <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-[0.2em]">High-Fidelity Network Intelligence & Metrics</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">System Load</span>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-tighter">Optimized</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Cpu className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            key={kpi.label}
            className="fin-card p-5 border-white/5 bg-black/40 relative group overflow-hidden"
          >
            <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:opacity-10 transition-opacity">
              <kpi.icon className="w-16 h-16 text-white" />
            </div>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">{kpi.label}</span>
            <span className={`text-2xl font-display font-black tracking-tight ${kpi.color} block`}>
              {kpi.value.toLocaleString()}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Analytics Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Trade Volume */}
        <div className="fin-card p-6 border-indigo-500/10 flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-base font-bold text-white flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              Trade Volume Dynamics (USD)
            </h3>
            <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-black text-indigo-400 uppercase tracking-widest">
              Weekly Profile
            </div>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tradeVolumeData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  tickFormatter={(v) => `$${v / 1000}k`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="p-4 rounded-2xl bg-black/90 border border-white/10 backdrop-blur-xl shadow-2xl">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{payload[0].payload.day}</p>
                          <p className="text-lg font-black text-white">${payload[0].value.toLocaleString()}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="Volume" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#areaGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Portfolio Distribution */}
        <div className="fin-card p-6 border-emerald-500/10 flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-base font-bold text-white flex items-center gap-3">
              <PieIcon className="w-5 h-5 text-emerald-400" />
              Asset Inventory Liquidity
            </h3>
            <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-400 uppercase tracking-widest">
              Dynamic Weighting
            </div>
          </div>

          <div className="flex-1 flex flex-col lg:flex-row items-center justify-between gap-8 px-4">
            {assetDistributionData.length > 0 ? (
              <>
                <div className="relative w-full aspect-square max-w-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={assetDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius="75%"
                        outerRadius="95%"
                        paddingAngle={8}
                        dataKey="value"
                        stroke="none"
                      >
                        {assetDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="p-4 rounded-2xl bg-black/90 border border-white/10 backdrop-blur-xl shadow-2xl">
                                <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">{payload[0].name}</p>
                                <p className="text-lg font-black text-indigo-400 font-mono">${payload[0].value.toLocaleString()}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Total Value</span>
                    <span className="text-xl font-display font-black text-white">
                      ${assetDistributionData.reduce((a, b) => a + b.value, 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>

                <div className="w-full flex flex-col gap-4">
                  {assetDistributionData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center justify-between p-3 rounded-2xl bg-black/20 border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">{entry.name} / USD</span>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-slate-400">
                        ${entry.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="w-full flex flex-col items-center justify-center text-slate-600 space-y-4">
                <Layers className="w-12 h-12 opacity-20" />
                <p className="text-[10px] font-black uppercase tracking-widest">Registry Depleted</p>
              </div>
            )}
          </div>
        </div>

        {/* Account Growth */}
        <div className="fin-card p-6 border-white/10 flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-base font-bold text-white flex items-center gap-3">
              <LineIcon className="w-5 h-5 text-purple-400" />
              Onboarding Velocity
            </h3>
            <div className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[9px] font-black text-purple-400 uppercase tracking-widest">
              Cumulative Entities
            </div>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={walletGrowthData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 10 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="p-4 rounded-2xl bg-black/90 border border-white/10 backdrop-blur-xl shadow-2xl">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{payload[0].payload.name}</p>
                          <p className="text-lg font-black text-white">{payload[0].value} Accounts</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="Accounts"
                  stroke="#a855f7"
                  strokeWidth={4}
                  dot={{ fill: '#a855f7', strokeWidth: 2, r: 4, stroke: '#020617' }}
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transaction Outcome Trends */}
        <div className="fin-card p-6 border-white/10 flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-base font-bold text-white flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-amber-500" />
              Execution Integrity Trend
            </h3>
            <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[9px] font-black text-amber-400 uppercase tracking-widest">
              Stability Audit
            </div>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={txTrendData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }} barGap={8}>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis
                  dataKey="period"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 10 }}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="p-4 rounded-2xl bg-black/90 border border-white/10 backdrop-blur-xl shadow-2xl space-y-2">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 border-b border-white/5 pb-2">{payload[0].payload.period}</p>
                          {payload.map(p => (
                            <div key={p.name} className="flex items-center justify-between gap-6">
                              <span className="text-[10px] font-black text-white uppercase tracking-widest">{p.name}</span>
                              <span className="text-xs font-black" style={{ color: p.fill }}>{p.value} Txns</span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="Success" fill="#10b981" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="Reverted" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
