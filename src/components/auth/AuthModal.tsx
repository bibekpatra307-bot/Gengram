import React, { useState } from 'react';
import { 
  X, Mail, Lock, User, AtSign, Eye, EyeOff, 
  Sparkles, CheckCircle, AlertCircle, ArrowRight, ShieldCheck 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalMode, 
    setAuthModalMode, 
    signInWithGoogle, 
    signInWithEmail, 
    signUpWithEmail, 
    loginAsDemoUser,
    isLoading, 
    authError, 
    clearAuthError 
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (authModalMode === 'login') {
        await signInWithEmail(email, password);
      } else {
        const cleanUsername = username.replace(/^@/, '').trim();
        await signUpWithEmail(email, password, displayName.trim(), cleanUsername);
      }
    } catch (err) {
      // Handled in AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    clearAuthError();
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-[#0b0d14] border border-white/[0.1] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 overflow-hidden">
        {/* Glow ambient background highlights */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header with Close */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl nexora-gradient flex items-center justify-center text-white font-black text-sm shadow-md shadow-indigo-500/25">
              G
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">
                {authModalMode === 'login' ? 'Welcome Back to Gengram' : 'Join Gengram'}
              </h2>
              <p className="text-[11px] text-neutral-400">
                {authModalMode === 'login' ? 'Sign in to access your account' : 'Create your personal profile'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-neutral-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher: Log In vs Create Account */}
        <div className="flex p-1 mt-5 bg-white/[0.04] rounded-2xl border border-white/[0.08]">
          <button
            type="button"
            onClick={() => {
              clearAuthError();
              setAuthModalMode('login');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              authModalMode === 'login'
                ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/10'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => {
              clearAuthError();
              setAuthModalMode('signup');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              authModalMode === 'signup'
                ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/10'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Notification */}
        {authError && (
          <div className="mt-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <div className="flex-1 leading-relaxed">{authError}</div>
          </div>
        )}

        {/* One-Click Google Auth */}
        <div className="mt-5">
          <button
            type="button"
            onClick={() => signInWithGoogle()}
            disabled={isLoading || submitting}
            className="w-full py-2.5 px-4 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-white text-xs font-semibold flex items-center justify-center gap-3 transition cursor-pointer group shadow-sm disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{authModalMode === 'login' ? 'Sign in with Google' : 'Sign up with Google'}</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-white/[0.08]" />
          <span className="px-3 text-[10px] text-neutral-500 uppercase tracking-widest font-mono">
            or with email
          </span>
          <div className="flex-1 h-px bg-white/[0.08]" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {authModalMode === 'signup' && (
            <>
              <div>
                <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                  Full Name / Display Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Maya Chen"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                  Unique Username
                </label>
                <div className="relative">
                  <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. mayachen_design"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
              Password {authModalMode === 'signup' && <span className="text-neutral-500">(min 6 characters)</span>}
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-indigo-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || isLoading}
            className="w-full mt-2 py-3 rounded-2xl nexora-gradient text-white text-xs font-bold shadow-lg shadow-indigo-500/25 hover:opacity-95 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <span className="animate-pulse">Processing...</span>
            ) : (
              <>
                <span>{authModalMode === 'login' ? 'Log In to Gengram' : 'Create Gengram Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* 1-Click Demo Profiles for Fast Testing */}
        <div className="mt-5 pt-4 border-t border-white/[0.06]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-neutral-400 font-medium">Quick Demo Profiles:</span>
            <span className="text-[9px] text-cyan-400 font-mono">1-Click Fast Access</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => loginAsDemoUser('alex')}
              className="py-1.5 px-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] text-[10px] text-neutral-300 font-semibold transition text-center truncate cursor-pointer"
            >
              Alex (Creator)
            </button>
            <button
              type="button"
              onClick={() => loginAsDemoUser('elena')}
              className="py-1.5 px-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] text-[10px] text-neutral-300 font-semibold transition text-center truncate cursor-pointer"
            >
              Elena (Studio)
            </button>
            <button
              type="button"
              onClick={() => loginAsDemoUser('liam')}
              className="py-1.5 px-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] text-[10px] text-neutral-300 font-semibold transition text-center truncate cursor-pointer"
            >
              Liam (Audio)
            </button>
          </div>
        </div>

        {/* Switch mode footer */}
        <div className="mt-4 text-center">
          {authModalMode === 'login' ? (
            <p className="text-xs text-neutral-400">
              New to Gengram?{' '}
              <button
                type="button"
                onClick={() => {
                  clearAuthError();
                  setAuthModalMode('signup');
                }}
                className="text-cyan-400 hover:text-cyan-300 font-bold transition underline cursor-pointer"
              >
                Create an account
              </button>
            </p>
          ) : (
            <p className="text-xs text-neutral-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  clearAuthError();
                  setAuthModalMode('login');
                }}
                className="text-indigo-400 hover:text-indigo-300 font-bold transition underline cursor-pointer"
              >
                Log In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
