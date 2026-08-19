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
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 text-slate-700 min-h-screen fixed left-0 top-0 z-40 shadow-sm">
      {/* Brand Header */}
      <div className="h-16 px-6 border-b border-slate-100 flex items-center gap-3 bg-white">
        <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 shadow-sm">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <div className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-1.5">
            ROADVISION
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-indigo-600 text-white font-bold">
              AI
            </span>
          </div>
          <div className="text-[11px] text-slate-400 font-medium">Smart Traffic Infrastructure</div>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Navigation Console
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
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
      <div className="p-4 m-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs shadow-sm">
        <div className="flex items-center gap-2 mb-1 text-slate-800 font-bold">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Smart City Node Active
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Real-time pothole & pavement crack detection operational.
        </p>
      </div>
    </aside>
  );
};
