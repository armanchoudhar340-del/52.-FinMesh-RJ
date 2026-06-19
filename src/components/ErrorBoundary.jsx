import React from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("FinMesh Route/Component Failure Traced:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col items-center justify-center p-6 app-bg">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-500/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="fin-card max-w-[500px] w-full p-8 border-rose-500/20 bg-rose-500/[0.01] text-center relative z-10 space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-xl font-display font-black text-white tracking-tight uppercase">System Exception Traced</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Route sandbox execution failure</p>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-left space-y-2">
              <span className="text-[9px] text-slate-600 font-black uppercase tracking-wider block">Error Stack Trace</span>
              <p className="text-xs font-mono text-rose-400/90 break-all leading-normal">
                {this.state.error?.message || "Unknown cryptographic boundary exception"}
              </p>
            </div>

            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = "/";
              }}
              className="fin-btn w-full py-4 bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/30 text-indigo-400 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Restart Sandbox Session
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
