import React from 'react';
import { Link } from 'react-router-dom';
import {
  Scan,
  BarChart3,
  ArrowRight,
  Sparkles,
  Camera,
  Zap,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../components/common/Button';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="relative rounded-3xl bg-white border border-slate-200/80 p-8 lg:p-12 overflow-hidden shadow-sm">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-50/80 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-50/80 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-700 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            Smart City Infrastructure AI Monitoring
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            AI-Powered Road Damage Detection for Safer Roads
          </h1>

          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-2xl">
            Detect potholes, pavement cracks, and surface degradation in seconds. RoadVisionAI provides municipal teams and surveyors with instant visual AI annotations, severity ratings, and actionable road health reports.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link to="/detect">
              <Button size="lg" variant="primary" icon={<Scan className="w-5 h-5" />} className="bg-indigo-600 hover:bg-indigo-700 border-indigo-600 text-white">
                Analyze Road
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="secondary" icon={<ArrowRight className="w-5 h-5" />}>
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Interactive Visual Showcase */}
        <div className="mt-10 rounded-2xl bg-slate-900 border border-slate-800 p-4 relative overflow-hidden group shadow-md">
          <div className="relative aspect-[21/9] w-full rounded-xl overflow-hidden bg-slate-950">
            <img
              src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=1200&auto=format&fit=crop"
              alt="AI Road Detection Preview"
              className="w-full h-full object-cover opacity-90"
            />
            {/* Overlay Visual Bounding Boxes */}
            <div className="absolute top-[40%] left-[28%] w-[34%] h-[28%] border-2 border-red-500 bg-red-500/20 rounded shadow-lg shadow-red-500/30 flex items-start p-1.5">
              <span className="bg-red-600 text-white font-bold text-[10px] px-1.5 py-0.5 rounded font-mono">
                Pothole (96% Confidence)
              </span>
            </div>
            <div className="absolute top-[32%] right-[16%] w-[22%] h-[40%] border-2 border-amber-500 bg-amber-500/20 rounded shadow-lg shadow-amber-500/30 flex items-start p-1.5">
              <span className="bg-amber-600 text-white font-bold text-[10px] px-1.5 py-0.5 rounded font-mono">
                Transverse Crack (88% Confidence)
              </span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-300 font-mono">
            <span className="flex items-center gap-1.5 text-slate-200 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Automated Computer Vision Model Output
            </span>
            <span className="text-indigo-400 font-bold">Processing Speed: 142ms</span>
          </div>
        </div>
      </section>

      {/* Why RoadVisionAI Is Useful */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900">Why Municipalities Choose RoadVisionAI</h2>
          <p className="text-xs font-medium text-slate-500">Frictionless visual inspection designed for field surveyors and road authorities</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 hover:border-indigo-300 transition-all shadow-sm">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl w-fit border border-indigo-100 shadow-xs">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Upload Photos or Dashcam Video</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Drag & drop photos, inspect dashcam footage, or capture live webcam video feeds directly from surveyor smartphones or connected vehicles.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 hover:border-indigo-300 transition-all shadow-sm">
            <div className="p-3 bg-red-50 text-red-600 rounded-2xl w-fit border border-red-100 shadow-xs">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Visual Bounding Boxes & Severity</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Color-coded bounding box overlays highlight potholes (Red), cracks (Orange), and surface defects (Cyan) with clear confidence scores.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 hover:border-indigo-300 transition-all shadow-sm">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl w-fit border border-emerald-100 shadow-xs">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Auditable Reports & History</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Save survey runs to searchable history, monitor city-wide damage trends, export JSON/CSV reports, and allocate repair crews efficiently.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Steps */}
      <section className="bg-white border border-slate-200/80 rounded-3xl p-8 space-y-8 shadow-sm">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900">3-Step Inspection Process</h2>
          <p className="text-xs font-medium text-slate-500">Simple and intuitive workflow for first-time operators</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
            <div className="text-2xl font-black font-mono text-indigo-600">01.</div>
            <h4 className="text-sm font-bold text-slate-900">Upload Road Media</h4>
            <p className="text-xs text-slate-500 font-medium">
              Drag & drop a road photo or video clip. Max file size 25MB (JPG, PNG, WebP, MP4).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
            <div className="text-2xl font-black font-mono text-indigo-600">02.</div>
            <h4 className="text-sm font-bold text-slate-900">Run AI Analysis</h4>
            <p className="text-xs text-slate-500 font-medium">
              Neural vision pipeline analyzes pavement textures and detects visible defects.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
            <div className="text-2xl font-black font-mono text-indigo-600">03.</div>
            <h4 className="text-sm font-bold text-slate-900">View Annotated Report</h4>
            <p className="text-xs text-slate-500 font-medium">
              Inspect bounding boxes, review road health score index, export JSON report, and track history.
            </p>
          </div>
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="border-t border-slate-200 pt-8 pb-4 text-center text-xs text-slate-500 space-y-2 font-medium">
        <div className="flex items-center justify-center gap-2 font-bold text-slate-900">
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          <span>RoadVisionAI Infrastructure Monitoring System</span>
        </div>
        <p>© 2026 Smart City Infrastructure Division. All rights reserved.</p>
      </footer>
    </div>
  );
};
