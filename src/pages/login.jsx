import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Languages,
  ArrowLeft
} from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../services/supabase';

const REMEMBER_EMAIL_KEY = 'lifedecode_remembered_email';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [mode, setMode] = useState('login'); // 'login' | 'forgot'
  const [fieldErrors, setFieldErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem(REMEMBER_EMAIL_KEY);
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    } catch {
      // Ignore storage access errors in restricted environments.
    }
  }, []);

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const clearAlerts = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  async function handleLogin(e) {
    e.preventDefault();
    clearAlerts();

    const errors = {};
    if (!email.trim()) {
      errors.email = 'Please enter your email address.';
    } else if (!validateEmail(email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errors.password = 'Please enter your password.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      setErrorMessage('Authentication is currently unavailable. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      return;
    }

    setFieldErrors({});
    setLoading(true);

    try {
      const trimmedEmail = email.trim();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password
      });

      if (error) {
        if (/invalid login credentials/i.test(error.message)) {
          setErrorMessage('Incorrect email or password. Please check your credentials and try again.');
        } else if (/email not confirmed/i.test(error.message)) {
          setErrorMessage('Please confirm your email address using the link sent to your inbox before logging in.');
        } else {
          setErrorMessage(error.message);
        }
        return;
      }

      try {
        if (rememberMe) {
          localStorage.setItem(REMEMBER_EMAIL_KEY, trimmedEmail);
        } else {
          localStorage.removeItem(REMEMBER_EMAIL_KEY);
        }
      } catch {
        // Ignore storage access errors.
      }

      if (data?.session) {
        navigate('/');
      } else {
        setSuccessMessage('Logged in successfully!');
        navigate('/');
      }
    } catch (err) {
      setErrorMessage(err?.message || 'Unable to log in right now. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword(e) {
    e.preventDefault();
    clearAlerts();

    if (!email.trim() || !validateEmail(email)) {
      setFieldErrors({ email: 'Please enter a valid email address to receive a reset link.' });
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      setErrorMessage('Password reset is unavailable because Supabase is not configured.');
      return;
    }

    setFieldErrors({});
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/login`
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setSuccessMessage(`Password reset instructions have been sent to ${email.trim()}. Please check your inbox and spam folder.`);
    } catch (err) {
      setErrorMessage(err?.message || 'Failed to send password reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Subtle brand glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[340px] bg-gradient-to-tr from-violet-200/40 to-indigo-100/30 blur-3xl rounded-full -z-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card overflow-hidden grid grid-cols-1 lg:grid-cols-12">

          {/* Left Brand Panel */}
          <div className="lg:col-span-5 bg-slate-900 text-white p-8 sm:p-10 flex flex-col justify-between space-y-8 relative overflow-hidden">
            <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-violet-600/20 blur-2xl pointer-events-none" />

            <div className="space-y-5 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-violet-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                <span>LifeDecode Account</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
                Understand complicated things. Make smarter decisions.
              </h1>

              <p className="text-sm text-slate-300 leading-relaxed">
                Sign in to decode legal contracts, medical reports, and financial agreements into clear, everyday language.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-800 relative z-10 text-xs sm:text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Zero Document Retention</p>
                  <p className="text-xs text-slate-400">Your uploaded files are processed in memory and never stored.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Languages className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">English & Hindi Support</p>
                  <p className="text-xs text-slate-400">Get authentic plain-language explanations in your preferred language.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
            {mode === 'login' ? (
              <form onSubmit={handleLogin} noValidate className="space-y-6">
                <div className="space-y-1.5">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Welcome back
                  </h2>
                  <p className="text-sm text-slate-500">
                    Log in with your email and password to continue with LifeDecode.
                  </p>
                </div>

                {errorMessage && (
                  <div role="alert" className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {successMessage && (
                  <div role="status" className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="login-email" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      disabled={loading}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
                        clearAlerts();
                      }}
                      placeholder="you@example.com"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-slate-900 placeholder-slate-400 transition-all focus:outline-none focus:ring-2 disabled:bg-slate-50 ${
                        fieldErrors.email
                          ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                          : 'border-slate-200 focus:ring-violet-500/20 focus:border-violet-500'
                      }`}
                      required
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="text-xs text-rose-600 font-medium">{fieldErrors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="login-password" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setFieldErrors({});
                        clearAlerts();
                      }}
                      className="text-xs font-semibold text-violet-600 hover:text-violet-700 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={password}
                      disabled={loading}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: '' }));
                        clearAlerts();
                      }}
                      placeholder="Enter your password"
                      className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm text-slate-900 placeholder-slate-400 transition-all focus:outline-none focus:ring-2 disabled:bg-slate-50 ${
                        fieldErrors.password
                          ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                          : 'border-slate-200 focus:ring-violet-500/20 focus:border-violet-500'
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="text-xs text-rose-600 font-medium">{fieldErrors.password}</p>
                  )}
                </div>

                {/* Remember me */}
                <div className="flex items-center justify-between">
                  <label className="inline-flex items-center gap-2.5 text-sm text-slate-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      disabled={loading}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                    />
                    <span>Remember my email</span>
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all group"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
                      <span>Logging in...</span>
                    </>
                  ) : (
                    <>
                      <span>Log In</span>
                      <ArrowRight className="w-4 h-4 text-violet-400 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>

                <p className="text-center text-sm text-slate-600 pt-2">
                  Don&apos;t have an account?{' '}
                  <Link to="/signup" className="font-bold text-violet-600 hover:text-violet-700 hover:underline">
                    Create an account
                  </Link>
                </p>
              </form>
            ) : (
              <form onSubmit={handleForgotPassword} noValidate className="space-y-6">
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setFieldErrors({});
                      clearAlerts();
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-2"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Log In</span>
                  </button>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Reset your password
                  </h2>
                  <p className="text-sm text-slate-500">
                    Enter your account email and we&apos;ll send you a secure password reset link.
                  </p>
                </div>

                {errorMessage && (
                  <div role="alert" className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {successMessage && (
                  <div role="status" className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{successMessage}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label htmlFor="reset-email" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="reset-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      disabled={loading}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
                        clearAlerts();
                      }}
                      placeholder="you@example.com"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-slate-900 placeholder-slate-400 transition-all focus:outline-none focus:ring-2 ${
                        fieldErrors.email
                          ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                          : 'border-slate-200 focus:ring-violet-500/20 focus:border-violet-500'
                      }`}
                      required
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="text-xs text-rose-600 font-medium">{fieldErrors.email}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white font-bold text-sm sm:text-base shadow-md transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending reset link...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Reset Link</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
