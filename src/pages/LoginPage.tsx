import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, LogIn, AlertCircle, Eye, EyeOff, KeyRound, CheckCircle, Mail } from 'lucide-react';
import { Button } from '../components/common/Button';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { signInWithEmail, resetPasswordForEmail, resendConfirmationEmail } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUnconfirmedEmail, setIsUnconfirmedEmail] = useState(false);

  // Resend confirmation email state
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState<string | null>(null);

  // Forgot Password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);
  const [forgotError, setForgotError] = useState<string | null>(null);

  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsUnconfirmedEmail(false);
    setResendSuccess(null);

    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setError('Please fill in both email and password fields.');
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      const { error: authError } = await signInWithEmail(cleanEmail, password);

      if (authError) {
        const msg = authError.message || '';
        if (msg.toLowerCase().includes('email not confirmed')) {
          setIsUnconfirmedEmail(true);
          setError('Please confirm your email address before signing in. Check your inbox and spam folder for the verification link.');
        } else if (msg.toLowerCase().includes('invalid login credentials')) {
          setError('Email or password is incorrect.');
        } else {
          setError(msg || 'Email or password is incorrect.');
        }
        return;
      }

      navigate('/dashboard');
    } catch (err: any) {
      setError('Email or password is incorrect.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    const cleanEmail = email.trim();
    if (!cleanEmail || !isValidEmail(cleanEmail)) {
      setError('Please enter a valid email address to resend confirmation.');
      return;
    }

    setResendLoading(true);
    setResendSuccess(null);
    try {
      const { error: resendErr } = await resendConfirmationEmail(cleanEmail);
      if (resendErr) {
        setError(resendErr.message || 'Failed to resend confirmation email.');
      } else {
        setResendSuccess(`Confirmation link has been resent to ${cleanEmail}. Please check your inbox.`);
      }
    } catch (err: any) {
      setError('An error occurred while resending the email.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotSuccess(null);

    const cleanEmail = forgotEmail.trim();
    if (!cleanEmail || !isValidEmail(cleanEmail)) {
      setForgotError('Please enter a valid email address.');
      return;
    }

    setForgotLoading(true);
    try {
      const { error: resetErr } = await resetPasswordForEmail(cleanEmail);
      if (resetErr) {
        setForgotError(resetErr.message || 'Failed to send password reset email.');
      } else {
        setForgotSuccess(`Password reset link sent to ${cleanEmail}. Check your inbox.`);
      }
    } catch (err: any) {
      setForgotError('An error occurred. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl w-fit mx-auto border border-indigo-100 shadow-xs">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Operator Sign In</h2>
          <p className="text-xs font-medium text-slate-500">Access RoadVisionAI command console via Supabase Auth</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 space-y-2 font-medium">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>

            {isUnconfirmedEmail && (
              <div className="pt-2 border-t border-red-200">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  isLoading={resendLoading}
                  onClick={handleResendConfirmation}
                  icon={<Mail className="w-3.5 h-3.5" />}
                  className="w-full text-xs py-1.5"
                >
                  Resend Verification Email
                </Button>
              </div>
            )}
          </div>
        )}

        {resendSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-medium">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{resendSuccess}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Official Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@city.gov"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700">Password</label>
              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email);
                  setForgotError(null);
                  setForgotSuccess(null);
                  setShowForgotModal(true);
                }}
                className="text-xs text-indigo-600 hover:underline font-bold"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full bg-indigo-600 hover:bg-indigo-700 border-indigo-600 text-white"
            isLoading={isLoading}
            icon={<LogIn className="w-4 h-4" />}
          >
            Sign In with Supabase
          </Button>
        </form>

        <div className="text-center text-xs text-slate-500 font-medium pt-2 border-t border-slate-100">
          Need an account?{' '}
          <Link to="/register" className="text-indigo-600 font-bold hover:underline">
            Register Survey Operator
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Reset Password</h3>
                <p className="text-xs text-slate-500 font-medium">Receive a Supabase password recovery link</p>
              </div>
            </div>

            {forgotError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{forgotError}</span>
              </div>
            )}

            {forgotSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{forgotSuccess}</span>
              </div>
            )}

            {!forgotSuccess && (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Registered Email</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="operator@city.gov"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowForgotModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    isLoading={forgotLoading}
                  >
                    Send Recovery Email
                  </Button>
                </div>
              </form>
            )}

            {forgotSuccess && (
              <div className="pt-2 text-right">
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => setShowForgotModal(false)}
                >
                  Close
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
