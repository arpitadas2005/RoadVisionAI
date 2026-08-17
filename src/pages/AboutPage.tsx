import React from 'react';
import { ShieldCheck, Cpu, Code2, Server, CheckCircle2, Terminal } from 'lucide-react';
import { Card } from '../components/common/Card';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl lg:text-2xl font-black text-slate-50 tracking-tight flex items-center gap-2">
          Project Information & Architecture
        </h2>
        <p className="text-xs text-slate-400">
          Smart Road Damage platform technical documentation, AI integration contract, and team details
        </p>
      </div>

      {/* System Architecture Overview */}
      <Card className="space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">System Architecture & AI Service Layer</h3>
            <p className="text-xs text-slate-400">Pluggable IDetectionService interface specification</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          The frontend is structured around an abstract detection engine interface (<code className="font-mono text-cyan-400">IDetectionService</code>). The application currently executes on a high-fidelity <strong>Simulated AI Service Engine</strong>, rendering HTML5 canvas overlays, bounding box annotations, and defect severity calculations.
        </p>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 space-y-1">
          <div className="text-slate-500 font-bold">// Architecture Flow:</div>
          <div>Frontend UI → IDetectionService → (Mock Engine OR FastAPI Endpoint) → Visual Annotations → Dashboard & History</div>
        </div>
      </Card>

      {/* Developer API Integration Guide */}
      <Card className="space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Connecting Real PyTorch / YOLO AI Endpoint</h3>
            <p className="text-xs text-slate-400">Zero UI rewrites required for production backend swap</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          To connect an active PyTorch, TensorFlow, or YOLOv8 FastAPI backend:
        </p>

        <ol className="list-decimal list-inside text-xs text-slate-400 space-y-2">
          <li>Create <code className="font-mono text-cyan-400">.env.local</code> in the root project directory.</li>
          <li>Set <code className="font-mono text-slate-200">VITE_AI_SERVICE_TYPE=api</code>.</li>
          <li>Set <code className="font-mono text-slate-200">VITE_AI_API_URL=https://your-model-server.com/api/v1/detect</code>.</li>
        </ol>
      </Card>

      {/* Technology Stack Inventory */}
      <Card className="space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Production Tech Stack</h3>
            <p className="text-xs text-slate-400">Modern web standards and high-performance libraries</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-bold text-slate-200">React 18 + Vite</div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-bold text-slate-200">TypeScript</div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-bold text-slate-200">Tailwind CSS</div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-bold text-slate-200">Recharts</div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-bold text-slate-200">HTML5 Canvas</div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-bold text-slate-200">Lucide Icons</div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-bold text-slate-200">LocalStorage Sync</div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-bold text-slate-200">React Router v7</div>
        </div>
      </Card>
    </div>
  );
};
