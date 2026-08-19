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
        <h2 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight">
          Operator Account & Security Settings
        </h2>
        <p className="text-xs font-medium text-slate-500">
          Manage your RoadVisionAI surveyor profile and Supabase security credentials
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        {/* User Identity Banner */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/60">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-black text-xl shadow-xs shrink-0">
            {initials}
          </div>
          <div className="text-center sm:text-left space-y-1 min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h3 className="text-lg font-bold text-slate-900">{displayName}</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {displayRole}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono truncate">{displayEmail}</p>
            <p className="text-xs text-slate-700 font-semibold">{displayOrg}</p>
          </div>
        </div>

        {/* Profile Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <UserIcon className="w-4 h-4 text-indigo-600" />
              <span>Full Name</span>
            </div>
            <div className="text-sm font-bold text-slate-900">{displayName}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <Mail className="w-4 h-4 text-indigo-600" />
              <span>Registered Email</span>
            </div>
            <div className="text-sm font-bold text-slate-900 truncate">{displayEmail}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <Building className="w-4 h-4 text-indigo-600" />
              <span>Department / Organization</span>
            </div>
            <div className="text-sm font-bold text-slate-900">{displayOrg}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>Account Provisioned</span>
            </div>
            <div className="text-sm font-bold text-slate-900">{displayCreated}</div>
          </div>
        </div>

        {/* Password Reset Section */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100 shadow-xs">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Security Credentials</h4>
              <p className="text-xs text-slate-500 font-medium">
                Trigger Supabase password recovery link sent directly to your registered email address
              </p>
            </div>
          </div>

          {resetSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{resetSuccess}</span>
            </div>
          )}

          {resetError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
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
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Supabase Auth Session Active</span>
          </div>

          <Button
            variant="primary"
            size="md"
            className="bg-red-600 hover:bg-red-700 border-red-600 text-white"
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
