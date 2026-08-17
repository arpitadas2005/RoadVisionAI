import React, { useState, useEffect } from 'react';
import { Cpu, PlusCircle, Server, LogOut, LogIn, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getStoredEngineMode, getStoredApiUrl } from '../../services/detectionServiceFactory';

const pageTitles: Record<string, string> = {
  '/': 'Smart Road Damage Inspection System',
  '/dashboard': 'Executive Command Dashboard',
  '/detect': 'Road Damage Detection Workspace',
  '/analytics': 'Infrastructure Visual Analytics',
  '/history': 'Inspection Logs & History Audit',
  '/about': 'AI Architecture & System Info',
  '/login': 'Operator Authentication',
  '/register': 'Operator Registration',
};

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const [engineMode, setEngineMode] = useState(getStoredEngineMode());
  const [apiUrl, setApiUrl] = useState(getStoredApiUrl());

  useEffect(() => {
    setEngineMode(getStoredEngineMode());
    setApiUrl(getStoredApiUrl());
  }, [location]);

  const currentTitle =
    pageTitles[location.pathname] ||
    (location.pathname.startsWith('/result') ? 'Detection Inspection Result' : 'Smart Road Damage');

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-4 md:px-8 flex items-center justify-between">
      {/* Page Title */}
      <div className="flex items-center gap-3">
        <h1 className="text-base md:text-lg font-bold text-slate-100 tracking-tight flex items-center gap-2">
          {currentTitle}
        </h1>
      </div>

      {/* Top Bar Status & User Profile */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Live AI Engine Status Pill */}
        <Link to="/detect" title={`Engine Mode: ${engineMode === 'api' ? 'Real API' : 'Simulated'}`}>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-800/40 text-xs font-mono text-cyan-300 hover:border-cyan-500/60 transition-colors">
            {engineMode === 'api' ? (
              <Server className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            )}
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>
              {engineMode === 'api' ? `API: ${apiUrl.replace(/^https?:\/\//, '').slice(0, 18)}...` : 'AI Engine: Simulated'}
            </span>
          </div>
        </Link>

        {/* Quick Detect CTA */}
        {isAuthenticated && (
          <Link
            to="/detect"
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Inspection</span>
          </Link>
        )}

        {/* User Profile / Auth State Controls */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 font-bold text-xs">
                {user.full_name.slice(0, 2).toUpperCase()}
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-slate-200 truncate max-w-[120px]">{user.full_name}</div>
                <div className="text-[10px] text-slate-400 truncate max-w-[120px]">{user.organization || 'Operator'}</div>
              </div>
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors ml-1"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 text-xs font-bold transition-all"
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
