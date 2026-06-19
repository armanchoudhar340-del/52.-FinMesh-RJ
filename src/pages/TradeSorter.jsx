import React, { useState, useEffect, useRef } from 'react';
import { runQuickSort, runMergeSort } from '../utils/Sorter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  SlidersHorizontal,
  ChevronUp,
  ChevronDown,
  Info,
  Activity,
  Zap,
  Cpu,
  Terminal,
  BarChart3,
  Layers,
  Clock,
  ArrowRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const initialAssets = [
  { asset: 'SOL', name: 'Solana', frequency: 245, volume: 82400.5, value: 12030473.0 },
  { asset: 'BTC', name: 'Bitcoin', frequency: 195, volume: 185.4, value: 12458880.0 },
  { asset: 'ETH', name: 'Ethereum', frequency: 165, volume: 2240.8, value: 7730760.0 },
  { asset: 'DOGE', name: 'Dogecoin', frequency: 310, volume: 45000000.0, value: 5400000.0 },
  { asset: 'ADA', name: 'Cardano', frequency: 120, volume: 1540000.0, value: 693000.0 },
  { asset: 'DOT', name: 'Polkadot', frequency: 85, volume: 62000.0, value: 372000.0 },
  { asset: 'LINK', name: 'Chainlink', frequency: 140, volume: 48000.0, value: 720000.0 },
  { asset: 'XRP', name: 'Ripple', frequency: 280, volume: 5200000.0, value: 2600000.0 }
];

export default function TradeSorter() {
  const [sortKey, setSortKey] = useState('frequency'); // frequency, volume, value
  const [algorithm, setAlgorithm] = useState('quicksort'); // quicksort, mergesort
  const [order, setOrder] = useState('desc'); // desc, asc

  // Player State
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(600); // ms per step

  // Sort Results
  const [sortResult, setSortResult] = useState(() => {
    return runQuickSort(initialAssets, 'frequency', 'desc');
  });

  const timerRef = useRef(null);

  // Re-run sort logic whenever configurations change
  const recomputeSort = () => {
    setIsPlaying(false);
    setCurrentStepIdx(0);

    let res;
    if (algorithm === 'quicksort') {
      res = runQuickSort(initialAssets, sortKey, order);
    } else {
      res = runMergeSort(initialAssets, sortKey, order);
    }
    setSortResult(res);
  };

  useEffect(() => {
    recomputeSort();
  }, [sortKey, algorithm, order]);

  // Handle auto-playing loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIdx(prev => {
          if (prev >= sortResult.steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playSpeed);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isPlaying, sortResult, playSpeed]);

  const handleStepForward = () => {
    if (currentStepIdx < sortResult.steps.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIdx(0);
  };

  const currentStep = sortResult.steps[currentStepIdx] || {
    arr: initialAssets,
    compare: [],
    action: 'initial',
    pivot: -1
  };

  // Label formatting
  const getKeyLabel = (key) => {
    if (key === 'frequency') return 'Trade Count';
    if (key === 'volume') return 'Traded Volume';
    if (key === 'value') return 'USD Volume ($)';
    return key;
  };

  const formatValue = (val, key) => {
    if (key === 'value') return `$${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    if (key === 'volume') return val.toLocaleString(undefined, { maximumFractionDigits: 0 });
    return val;
  };

  // Determine bar colors based on comparison/pivot focus states
  const getBarColor = (index, item) => {
    if (currentStep.action === 'sorted') return '#10b981'; // finished emerald
    if (currentStep.pivot === index) return '#f43f5e'; // pivot focus
    if (currentStep.compare.includes(index)) return '#f59e0b'; // comparison

    // Check if index is in merge range (Merge Sort division helper)
    if (currentStep.range) {
      const [low, mid, high] = currentStep.range;
      if (index >= low && index <= high) {
        return '#6366f1'; // active indigo segment
      }
    }

    return 'rgba(255, 255, 255, 0.05)';
  };

  return (
    <div className="space-y-8 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-black text-white tracking-tight italic">Sort Profiler</h2>
          <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-[0.2em]">Live Algorithm Benchmarking & Visualization</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Comparisons</span>
            <span className="text-lg font-mono font-black text-amber-500">{sortResult.comparisons}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Complexity</span>
            <span className="text-lg font-mono font-black text-indigo-500">O(N log N)</span>
          </div>
        </div>
      </div>

      {/* Control Center */}
      <div className="fin-card p-6 border-indigo-500/10 bg-indigo-500/[0.02]">
        <div className="flex items-center gap-3 mb-6">
          <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Configuration</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Benchmark Metric</label>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              className="fin-input w-full px-4 py-2 text-xs font-bold"
            >
              <option value="frequency">Trade Frequency</option>
              <option value="volume">Trade Volume (Units)</option>
              <option value="value">USD Trade Value ($)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Target Algorithm</label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className="fin-input w-full px-4 py-2 text-xs font-bold text-indigo-400"
            >
              <option value="quicksort">Quick Sort (Partitioning)</option>
              <option value="mergesort">Merge Sort (Recursive)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Directional Bias</label>
            <select
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="fin-input w-full px-4 py-2 text-xs font-bold"
            >
              <option value="desc">Descending (High → Low)</option>
              <option value="asc">Ascending (Low → High)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Animation Delta ({playSpeed}ms)</label>
            <div className="pt-2 px-1">
              <input
                type="range"
                min="100"
                max="1500"
                step="50"
                value={playSpeed}
                onChange={(e) => setPlaySpeed(parseInt(e.target.value))}
                className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-3 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${isPlaying
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                  : 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                }`}
            >
              {isPlaying ? (
                <><Pause className="w-4 h-4 fill-current" /> Pause Execution</>
              ) : (
                <><Play className="w-4 h-4 fill-current" /> Bootstrap Sort</>
              )}
            </button>

            <button
              onClick={handleStepForward}
              disabled={currentStepIdx >= sortResult.steps.length - 1}
              className="p-2.5 bg-black/40 border border-white/5 rounded-xl text-slate-400 hover:text-white transition-all disabled:opacity-20"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={handleReset}
              className="p-2.5 bg-black/40 border border-white/5 rounded-xl text-slate-400 hover:text-white transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-8 font-mono">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Execution Trace</span>
              <span className="text-xs font-bold text-slate-300">FRAME_{String(currentStepIdx + 1).padStart(3, '0')}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Swap Latency</span>
              <span className="text-xs font-bold text-indigo-400">{sortResult.swaps} WRITES</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

        {/* Main Visualization */}
        <div className="xl:col-span-8 space-y-8">
          <div className="fin-card p-6 min-h-[460px] relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <BarChart3 className="w-32 h-32 text-indigo-400" />
            </div>

            <div className="flex justify-between items-center mb-10">
              <h3 className="text-lg font-bold text-white flex items-center gap-3">
                <Activity className="w-5 h-5 text-indigo-400" />
                Spatial Array Topology
              </h3>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-white/5">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">{getKeyLabel(sortKey)}</span>
              </div>
            </div>

            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentStep.arr} margin={{ top: 20, right: 0, left: 0, bottom: 20 }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="asset"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }}
                    dy={10}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(255, 255, 255, 0.02)' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="p-4 rounded-2xl bg-black/90 border border-white/10 backdrop-blur-xl shadow-2xl">
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">{data.name}</p>
                            <p className="text-lg font-black text-white">{formatValue(data[sortKey], sortKey)}</p>
                            <p className="text-[9px] font-mono text-slate-500 mt-2 uppercase tracking-tighter">Ticker: {data.asset}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey={sortKey} radius={[6, 6, 0, 0]} barSize={40}>
                    {currentStep.arr.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getBarColor(index, entry)}
                        className="transition-all duration-300"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="mt-8 flex flex-wrap gap-6 items-center justify-center border-t border-white/5 pt-6">
              {[
                { label: 'Idle State', color: 'rgba(255, 255, 255, 0.05)' },
                { label: 'Comparing', color: '#f59e0b' },
                { label: 'Pivot Focus', color: '#f43f5e' },
                { label: 'Subarray Range', color: '#6366f1' },
                { label: 'Optimized', color: '#10b981' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-500">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          {/* Ranking Ribbon */}
          <div className="fin-card p-6 border-emerald-500/10">
            <div className="flex items-center gap-3 mb-6">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Computed Rank Order</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              <AnimatePresence>
                {currentStep.arr.map((item, idx) => (
                  <motion.div
                    layout
                    key={item.asset}
                    className={`p-3 rounded-xl border text-center transition-all ${currentStep.action === 'sorted'
                        ? 'bg-emerald-500/5 border-emerald-500/20'
                        : 'bg-black/40 border-white/5'
                      }`}
                  >
                    <span className="text-[9px] font-mono font-black text-slate-600 block mb-1">
                      #{idx + 1}
                    </span>
                    <span className="text-xs font-black text-white block">
                      {item.asset}
                    </span>
                    <div className="mt-2 text-[9px] font-bold text-slate-500 font-mono truncate">
                      {item[sortKey] > 1000000 ? (item[sortKey] / 1000000).toFixed(1) + 'M' : item[sortKey].toLocaleString()}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Trace Console */}
        <div className="xl:col-span-4 space-y-8">
          <div className="fin-card p-6 border-indigo-500/20 flex flex-col h-full min-h-[600px]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Execution Ledger</h3>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-0.5">Live Log Sequence</p>
                </div>
              </div>
              <div className="px-2 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-[8px] font-black text-indigo-400 uppercase tracking-widest">
                Live Trace
              </div>
            </div>

            <div className="flex-1 bg-black/40 rounded-2xl border border-white/5 p-4 font-mono text-[10px] space-y-3 overflow-y-auto no-scrollbar">
              <div className="flex items-center gap-2 text-slate-600 font-black mb-4 pb-2 border-b border-white/5 uppercase tracking-widest">
                <Clock className="w-3 h-3" /> Boot sequence complete.
              </div>

              {sortResult.steps.slice(0, currentStepIdx + 1).map((step, idx) => {
                let actionText = '';
                let icon = <ArrowRight className="w-3 h-3 shrink-0" />;

                if (step.action === 'initial') actionText = 'Initialized entity array buffer.';
                else if (step.action === 'select-pivot') actionText = `Pivot Lock: ${step.arr[step.pivot].asset} @ ${formatValue(step.arr[step.pivot][sortKey], sortKey)}`;
                else if (step.action === 'compare') {
                  const [i1, i2] = step.compare;
                  actionText = `Compare: ${step.arr[i1]?.asset} vs ${step.arr[i2]?.asset}`;
                }
                else if (step.action === 'swap') {
                  const [i1, i2] = step.compare;
                  actionText = `Swap Buffer: ${step.arr[i1]?.asset} ↔ ${step.arr[i2]?.asset}`;
                }
                else if (step.action === 'divide') {
                  const [low, mid, high] = step.range;
                  actionText = `Divide Sub-range: [Idx ${low} : ${high}]`;
                }
                else if (step.action === 'write') {
                  const [pos] = step.compare;
                  actionText = `Re-write Segment Idx [${pos}] → ${step.arr[pos]?.asset}`;
                }
                else if (step.action === 'sorted') actionText = 'Array fully optimized. Termination.';

                const isCurrent = idx === currentStepIdx;

                return (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={idx}
                    className={`flex items-start gap-3 leading-tight ${isCurrent ? 'text-indigo-400 font-black' : 'text-slate-500'}`}
                  >
                    <span className="text-[8px] text-slate-800 font-bold shrink-0 mt-0.5">[{String(idx + 1).padStart(2, '0')}]</span>
                    <span className="flex-1">{actionText}</span>
                  </motion.div>
                );
              })}
              <div ref={(el) => el?.scrollIntoView({ behavior: 'smooth' })} />
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-black/40 border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Algorithm Efficiency</span>
                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">High</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-indigo-500"
                  initial={{ width: 0 }}
                  animate={{ width: '85%' }}
                />
              </div>
              <p className="text-[9px] text-slate-500 font-bold leading-relaxed uppercase">
                Execution depth monitored at {sortResult.steps.length} frames. CPU cycle cost was minimal for target dataset N=8.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
