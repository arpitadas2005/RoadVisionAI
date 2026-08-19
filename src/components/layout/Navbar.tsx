import React, { useState, useEffect } from 'react';
import { Cpu, PlusCircle, Server, LogOut, LogIn } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getStoredEngineMode, getStoredApiUrl } from '../../services/detectionServiceFactory';

const pageTitles: Record<string, string> = {
  '/': 'Smart Road Damage Inspection System',
  '/dashboard': 'Executive Command Dashboard',
  '/detect': 'Road Damage Detection Workspace',
  '/analytics': 'Infrastructure Visual Analytics',
  '/history': 'Inspection Logs & History Audit',
  '/profile': 'Operator Profile & Settings',
  '/about': 'AI Architecture & System Info',
  '/login': 'Operator Authentication',
  '/register': 'Operator Registration',
};

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, signOut } = useAuth();

  const [engineMode, setEngineMode] = useState(getStoredEngineMode());
  const [apiUrl, setApiUrl] = useState(getStoredApiUrl());

  useEffect(() => {
    setEngineMode(getStoredEngineMode());
    setApiUrl(getStoredApiUrl());
  }, [location]);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const currentTitle =
    pageTitles[location.pathname] ||
    (location.pathname.startsWith('/result') ? 'Detection Inspection Result' : 'Smart Road Damage');

  const displayName = user?.fullName || 'Surveyor';
  const displayOrg = user?.organization || 'Road Ops';
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-8 flex items-center justify-between shadow-xs">
      {/* Page Title */}
      <div className="flex items-center gap-3">
        <h1 className="text-base md:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
          {currentTitle}
        </h1>
      </div>

      {/* Top Bar Status & User Profile */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Live AI Engine Status Pill */}
        <Link to="/detect" title={`Engine Mode: ${engineMode === 'api' ? 'Real API' : 'Simulated'}`}>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono text-slate-700 hover:border-indigo-300 transition-colors shadow-xs">
            {engineMode === 'api' ? (
              <Server className="w-3.5 h-3.5 text-amber-600" />
            ) : (
              <Cpu className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            )}
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="font-semibold">
              {engineMode === 'api' ? `API: ${apiUrl.replace(/^https?:\/\//, '').slice(0, 18)}...` : 'AI Engine: Active'}
            </span>
          </div>
        </Link>

        {/* Quick Detect CTA */}
        {isAuthenticated && (
          <Link
            to="/detect"
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-sm shadow-indigo-200 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Inspection</span>
          </Link>
        )}

        {/* User Profile / Auth State Controls */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 transition-colors"
                title="View Profile Settings"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs shadow-xs">
                  {initials}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-bold text-slate-900 truncate max-w-[120px]">{displayName}</div>
                  <div className="text-[10px] text-slate-500 truncate max-w-[120px]">{displayOrg}</div>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors ml-1"
                title="Sign Out with Supabase"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 text-xs font-bold transition-all shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
