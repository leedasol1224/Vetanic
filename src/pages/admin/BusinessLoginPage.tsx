import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, ShieldCheck, ArrowLeft, Eye, EyeOff, AlertCircle } from 'lucide-react';

export const BusinessLoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('admin@vetanic.sg');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determine redirect destination
  const fromLocation = (location.state as { from?: { pathname: string } })?.from?.pathname || '/business/dashboard';

  // If already authenticated, redirect immediately
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(fromLocation, { replace: true });
    }
  }, [isAuthenticated, navigate, fromLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password) {
      setErrorMsg('Please provide both your business email and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      navigate(fromLocation, { replace: true });
    } else {
      setErrorMsg(result.error || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#222222] font-sans flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6F6A65] hover:text-[#9E2328] transition-colors p-2 rounded-xl hover:bg-[#E9E0D4]/50"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Storefront</span>
        </Link>

        <span className="inline-flex items-center gap-1 bg-[#9E2328]/10 text-[#9E2328] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
          <ShieldCheck className="w-3 h-3" />
          Staff Portal
        </span>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#9E2328] text-white shadow-soft mb-2">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#222222] tracking-tight">
            VETANIC Business
          </h1>
          <p className="text-xs text-[#6F6A65] max-w-sm mx-auto">
            Authorized internal access for Singapore order management, inventory operations, and customer fulfillment.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-7 sm:p-8 border border-[#DED7CE] shadow-soft space-y-6">
          {errorMsg && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs animate-soft-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="font-medium leading-relaxed">{errorMsg}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#222222] uppercase tracking-wider">
                Business Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#6F6A65] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@vetanic.sg"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DED7CE] bg-[#FAF7F2] text-xs font-medium text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#9E2328] focus:border-[#9E2328] transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-[#222222] uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#6F6A65] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#DED7CE] bg-[#FAF7F2] text-xs font-medium text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#9E2328] focus:border-[#9E2328] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6F6A65] hover:text-[#222222] focus:outline-none"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-[#9E2328] hover:bg-[#841C21] disabled:opacity-60 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-xs transition-all mt-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Verifying...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sign In to Console</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Staff Helper */}
          <div className="pt-4 border-t border-[#DED7CE]/80 text-[11px] text-[#6F6A65] space-y-1.5 bg-[#FAF7F2] p-3.5 rounded-2xl">
            <div className="font-bold text-[#222222] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#9E2328]" />
              <span>Internal Operations Key</span>
            </div>
            <p className="leading-relaxed">
              Default staff credentials: <code className="bg-white px-1.5 py-0.5 rounded border border-[#DED7CE] text-[#9E2328] font-bold">admin@vetanic.sg</code> with password <code className="bg-white px-1.5 py-0.5 rounded border border-[#DED7CE] text-[#9E2328] font-bold">vetanic2026</code>.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-[#6F6A65]">
        <span>VETANIC Singapore • Enterprise Protected Console</span>
      </div>
    </div>
  );
};
