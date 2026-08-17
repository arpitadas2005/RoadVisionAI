import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/common/Button';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('operator@smartcity.gov');
  const [password, setPassword] = useState('Password123!');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(false);

    if (!email.trim() || !password) {
      setError('Please fill in both email and password fields.');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate or call backend auth
      await new Promise((r) => setTimeout(r, 650));

      if (email.toLowerCase() === 'operator@smartcity.gov' && password === 'Password123!') {
        login('demo_jwt_token_operator_smartcity_2026', {
          id: 'usr-demo123',
          email: 'operator@smartcity.gov',
          full_name: 'Smart City Operator',
          organization: 'Road Infrastructure Ops Division',
          role: 'operator',
        });
        navigate('/dashboard');
      } else {
        setError('Invalid email or password combination.');
      }
    } catch (err: any) {
      setError('Authentication failed. Please verify credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-slate-950 space-y-6">
        <div className="text-center space-y-2">
          <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-2xl w-fit mx-auto border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-50">Operator Sign In</h2>
          <p className="text-xs text-slate-400">Access protected Smart Road Damage monitoring console</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Official Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@smartcity.gov"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
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
            className="w-full"
            isLoading={isLoading}
            icon={<LogIn className="w-4 h-4" />}
          >
            Sign In to Console
          </Button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800/80">
          Need an account?{' '}
          <Link to="/register" className="text-cyan-400 font-bold hover:underline">
            Register Survey Operator
          </Link>
        </div>
      </div>
    </div>
  );
};
