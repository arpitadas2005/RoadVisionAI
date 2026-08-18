import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Scan,
  BarChart3,
  History,
  Info,
  ShieldCheck,
  Home,
  User,
  ChevronRight,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { label: 'Home', path: '/', icon: <Home className="w-5 h-5" /> },
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Detect Damage', path: '/detect', icon: <Scan className="w-5 h-5" /> },
    { label: 'Analytics', path: '/analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { label: 'History', path: '/history', icon: <History className="w-5 h-5" /> },
    { label: 'Profile', path: '/profile', icon: <User className="w-5 h-5" /> },
    { label: 'About Project', path: '/about', icon: <Info className="w-5 h-5" /> },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-950 border-r border-slate-800 text-slate-300 min-h-screen fixed left-0 top-0 z-40">
      {/* Brand Header */}
      <div className="h-16 px-6 border-b border-slate-800 flex items-center gap-3 bg-slate-950">
        <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <div className="text-sm font-black text-slate-50 tracking-tight flex items-center gap-1.5">
            SMART ROAD
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              AI
            </span>
          </div>
          <div className="text-[11px] text-slate-400 font-medium">Visual Damage Monitoring</div>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Navigation Console
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
              }`
            }
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span>{item.label}</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-40" />
          </NavLink>
        ))}
      </div>

      {/* Footer System Status Banner */}
      <div className="p-4 m-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
        <div className="flex items-center gap-2 mb-1 text-slate-300 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          Smart City Node Active
        </div>
        <p className="text-[11px] text-slate-400">
          Real-time pothole & crack detection pipeline operational.
        </p>
      </div>
    </aside>
  );
};
