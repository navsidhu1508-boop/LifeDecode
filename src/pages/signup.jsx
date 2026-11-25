import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Check
} from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../services/supabase';

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [confirmationEmail, setConfirmationEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  const hasMinLength = password.length >= 6;
  const hasLetterAndNumber = /[A-Za-z]/.test(password) && /\d/.test(password);
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

  async function handleSignup(e) {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const errors = {};
    if (!name.trim() || name.trim().length < 2) {
      errors.name = 'Please enter your full name (at least 2 characters).';
    }
    if (!email.trim()) {
      errors.email = 'Please enter your email address.';
    } else if (!validateEmail(email)) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!password) {
      errors.password = 'Please create a password.';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long.';
    }
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      setErrorMessage('Account signup is currently unavailable. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      return;
    }

    setFieldErrors({});
    setLoading(true);

    try {
      const trimmedEmail = email.trim();
      const trimmedName = name.trim();

      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: { full_name: trimmedName },
          emailRedirectTo: `${window.location.origin}/login`
        }
      });

      if (error) {
        if (/already registered|user already exists/i.test(error.message)) {
          setErrorMessage('An account with this email already exists. Try logging in instead.');
        } else {
          setErrorMessage(error.message);
        }
        return;
      }

      // Supabase returns an empty identities array when an existing confirmed user signs up again
      if (data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        setErrorMessage('An account with this email is already registered. Please log in instead.');
        return;
      }

      if (data?.session) {
        setSuccessMessage('Account created successfully! Redirecting you to LifeDecode...');
        navigate('/');
      } else {
        setConfirmationEmail(trimmedEmail);
        setSuccessMessage('Account created! Please check your email and click the confirmation link to activate your account.');
      }
    } catch (err) {
      setErrorMessage(err?.message || 'Unable to create account right now. Please try again.');
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
                <span>Get Started Free</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
                Start understanding life, one document at a time.
              </h1>

              <p className="text-sm text-slate-300 leading-relaxed">
                Create your free LifeDecode account to turn fine print, medical reports, and financial disclosures into plain English or Hindi.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800 relative z-10 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-violet-400 flex-shrink-0" />
                <span>Paste text, upload PDFs, or scan images</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-violet-400 flex-shrink-0" />
                <span>Clear risks, jargon glossary & next steps</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Strict Zero Document Retention policy</span>
              </div>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
            {confirmationEmail ? (
              <div className="text-center py-6 space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-extrabold text-slate-900">
                    Confirm your email
                  </h2>
                  <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    We sent a confirmation link to <strong className="text-slate-900">{confirmationEmail}</strong>. Open that email and click the link to activate your LifeDecode account.
                  </p>
                </div>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    to="/login"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold shadow-sm transition-all"
                  >
                    <span>Go to Log In</span>
                    <ArrowRight className="w-4 h-4 text-violet-400" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmationEmail('');
                      setSuccessMessage('');
                    }}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold transition-all"
                  >
                    Use a different email
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSignup} noValidate className="space-y-5">
                <div className="space-y-1.5">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Create your account
                  </h2>
                  <p className="text-sm text-slate-500">
                    Fill in your details below to join LifeDecode.
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

                {/* Full name */}
                <div className="space-y-1.5">
                  <label htmlFor="signup-name" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="signup-name"
                      type="text"
                      autoComplete="name"
                      value={name}
                      disabled={loading}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: '' }));
                        setErrorMessage('');
                      }}
                      placeholder="Enter your full name"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-slate-900 placeholder-slate-400 transition-all focus:outline-none focus:ring-2 disabled:bg-slate-50 ${
                        fieldErrors.name
                          ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                          : 'border-slate-200 focus:ring-violet-500/20 focus:border-violet-500'
                      }`}
                      required
                    />
                  </div>
                  {fieldErrors.name && (
                    <p className="text-xs text-rose-600 font-medium">{fieldErrors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="signup-email" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="signup-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      disabled={loading}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
                        setErrorMessage('');
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
                  <label htmlFor="signup-password" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={password}
                      disabled={loading}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: '' }));
                        setErrorMessage('');
                      }}
                      placeholder="At least 6 characters"
                      minLength={6}
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

                  {/* Password checklist */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-[11px]">
                    <span className={`inline-flex items-center gap-1 ${hasMinLength ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                      <Check className="w-3 h-3" />
                      At least 6 characters
                    </span>
                    <span className={`inline-flex items-center gap-1 ${hasLetterAndNumber ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                      <Check className="w-3 h-3" />
                      Letters &amp; numbers (recommended)
                    </span>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label htmlFor="signup-confirm-password" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="signup-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={confirmPassword}
                      disabled={loading}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (fieldErrors.confirmPassword) setFieldErrors((prev) => ({ ...prev, confirmPassword: '' }));
                        setErrorMessage('');
                      }}
                      placeholder="Re-enter your password"
                      minLength={6}
                      className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm text-slate-900 placeholder-slate-400 transition-all focus:outline-none focus:ring-2 disabled:bg-slate-50 ${
                        fieldErrors.confirmPassword
                          ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                          : passwordsMatch
                          ? 'border-emerald-300 focus:ring-emerald-500/20 focus:border-emerald-500'
                          : 'border-slate-200 focus:ring-violet-500/20 focus:border-violet-500'
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="text-xs text-rose-600 font-medium">{fieldErrors.confirmPassword}</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all group"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>

                <p className="text-center text-sm text-slate-600 pt-1">
                  Already have an account?{' '}
                  <Link to="/login" className="font-bold text-violet-600 hover:text-violet-700 hover:underline">
                    Log in
                  </Link>
                </p>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
