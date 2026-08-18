import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, Mail, Building, Shield, Calendar, KeyRound, LogOut, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../components/common/Button';
import { formatDate } from '../utils/formatters';
import { useNavigate } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut, resetPasswordForEmail } = useAuth();

  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    setResetLoading(true);
    setResetSuccess(null);
    setResetError(null);

    try {
      const { error } = await resetPasswordForEmail(user.email);
      if (error) {
        setResetError(error.message || 'Failed to send password reset email.');
      } else {
        setResetSuccess(`A secure password recovery link has been sent to ${user.email}.`);
      }
    } catch (err: any) {
      setResetError('An error occurred while sending password reset email.');
    } finally {
      setResetLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const displayName = user?.fullName || 'Road Surveyor';
  const displayEmail = user?.email || 'operator@city.gov';
  const displayOrg = user?.organization || 'Road Maintenance & Public Works';
  const displayRole = user?.role ? user.role.toUpperCase() : 'OPERATOR';
  const displayCreated = user?.createdAt ? formatDate(user.createdAt) : 'Active Session';
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl lg:text-2xl font-black text-slate-50 tracking-tight">
          Operator Account & Security Settings
        </h2>
        <p className="text-xs text-slate-400">
          Manage your RoadVisionAI surveyor profile and Supabase security credentials
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl shadow-slate-950">
        {/* User Identity Banner */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black text-xl shadow-lg shadow-cyan-500/10 shrink-0">
            {initials}
          </div>
          <div className="text-center sm:text-left space-y-1 min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h3 className="text-lg font-bold text-slate-100">{displayName}</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                {displayRole}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono truncate">{displayEmail}</p>
            <p className="text-xs text-slate-300 font-medium">{displayOrg}</p>
          </div>
        </div>

        {/* Profile Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <UserIcon className="w-4 h-4 text-cyan-400" />
              <span>Full Name</span>
            </div>
            <div className="text-sm font-bold text-slate-100">{displayName}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>Registered Email</span>
            </div>
            <div className="text-sm font-bold text-slate-100 truncate">{displayEmail}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Building className="w-4 h-4 text-cyan-400" />
              <span>Department / Organization</span>
            </div>
            <div className="text-sm font-bold text-slate-100">{displayOrg}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Account Provisioned</span>
            </div>
            <div className="text-sm font-bold text-slate-100">{displayCreated}</div>
          </div>
        </div>

        {/* Password Reset Section */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100">Security Credentials</h4>
              <p className="text-xs text-slate-400">
                Trigger Supabase password recovery link sent directly to your registered email address
              </p>
            </div>
          </div>

          {resetSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{resetSuccess}</span>
            </div>
          )}

          {resetError && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{resetError}</span>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            isLoading={resetLoading}
            onClick={handlePasswordReset}
            icon={<KeyRound className="w-3.5 h-3.5" />}
          >
            Send Password Reset Link
          </Button>
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Supabase Auth Session Active</span>
          </div>

          <Button
            variant="primary"
            size="md"
            className="bg-red-600 hover:bg-red-500 border-red-500"
            onClick={handleLogout}
            icon={<LogOut className="w-4 h-4" />}
          >
            Sign Out of Account
          </Button>
        </div>
      </div>
    </div>
  );
};
