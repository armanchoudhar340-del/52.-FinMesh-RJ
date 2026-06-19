import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Mail, Lock, Check, AlertCircle, Info, Shield, Key } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      localStorage.setItem('finmesh_demo_session', 'active');
      
      // Setup initial default user info if not set
      if (!localStorage.getItem('finmesh_user')) {
        localStorage.setItem('finmesh_user', JSON.stringify({
          name: "John Doe",
          email: "demo@finmesh.io",
          role: "System Administrator",
          memberSince: "March 12, 2024",
          status: "Verified",
          securityLevel: "Tier 3 (Maximum)",
          phone: "+1 (555) 019-2834",
          lastLogin: new Date().toLocaleString()
        }));
      }

      navigate('/');
    }, 1000);
  };

  const useDemoCredentials = () => {
    setEmail('demo@finmesh.io');
    setPassword('demo123');
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex items-center justify-center p-6 app-bg relative overflow-hidden">
      
      {/* Decorative backdrop glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[460px] relative z-10"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_30px_rgba(99,102,241,0.4)] mb-4">
            <Zap className="w-8 h-8 text-white fill-white/20" />
          </div>
          <h1 className="font-display font-black text-2xl text-white tracking-tight">FinMesh Enterprise</h1>
          <p className="text-[10px] text-indigo-400 font-bold tracking-[0.25em] uppercase mt-1">Institutional Ledger Gateway</p>
        </div>

        {/* Glassmorphism Card */}
        <div className="fin-card p-8 border-white/10 bg-slate-900/40 backdrop-blur-2xl">
          <h2 className="text-base font-bold text-white mb-6 text-center uppercase tracking-wider">Gateway Authentication</h2>

          <form onSubmit={handleSignIn} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Authority Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="demo@finmesh.io"
                className="fin-input w-full font-semibold"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Access Decryption Key
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="fin-input w-full font-semibold"
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                    rememberMe ? 'bg-indigo-500 border-indigo-400' : 'border-white/10 bg-white/5'
                  }`}>
                    {rememberMe && <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />}
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Persist Session</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="fin-btn fin-btn-primary w-full py-4 text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Initializing...
                </>
              ) : (
                'Decrypt & Sign In'
              )}
            </button>
          </form>

          {/* Demo credentials helper block */}
          <div className="mt-8 pt-6 border-t border-white/5 space-y-3">
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block text-center">
              Internal Sandbox Operator Credentials
            </span>
            <button
              type="button"
              onClick={useDemoCredentials}
              className="w-full py-3 rounded-2xl bg-indigo-500/5 hover:bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:text-indigo-300 font-mono text-[10px] font-bold flex items-center justify-center gap-2.5 transition-all"
            >
              <Key className="w-3.5 h-3.5" /> Use Demo Credentials
            </button>
            <div className="flex items-center gap-2 justify-center text-[9px] text-slate-500 font-bold uppercase tracking-wider">
              <span>Email: demo@finmesh.io</span>
              <span className="text-slate-700">•</span>
              <span>Password: demo123</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 flex items-center justify-between text-[10px] text-slate-600 font-semibold px-4">
          <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> AES-256 Encrypted</span>
          <span>Gateway Build v2.4.0</span>
        </div>
      </motion.div>
    </div>
  );
}
