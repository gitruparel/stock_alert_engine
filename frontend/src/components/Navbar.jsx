import React from "react";
import { ShieldCheck, Activity, Zap, RefreshCw, Sliders, PlusCircle, Radio } from "lucide-react";

export function Navbar({
  sseConnected,
  onSimulateRandom,
  onOpenSimulateModal,
  onOpenConfigModal,
  onResetData,
  isSimulating
}) {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-40 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand & Market Status */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-400/30">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                KAVACH<span className="text-emerald-400 font-mono text-base">.NSE</span>
              </h1>
              <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700">
                PROTOTYPE v1.2
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <span>Automated Long-Term Stock Filter & Structural Alert Engine</span>
              <span className="hidden md:inline-block w-1 h-1 rounded-full bg-slate-600"></span>
              <span className="hidden md:flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                <span className={`w-1.5 h-1.5 rounded-full ${sseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                {sseConnected ? "NSE STREAM ACTIVE" : "CONNECTING..."}
              </span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Simulate Random Filing */}
          <button
            onClick={onSimulateRandom}
            disabled={isSimulating}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/10 disabled:opacity-50"
            title="Simulate incoming random NSE corporate disclosure"
          >
            <Zap className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? "Ingesting..." : "Simulate Filing"}</span>
          </button>

          {/* Custom Filing Builder */}
          <button
            onClick={onOpenSimulateModal}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
            title="Create a custom corporate filing to test filter rules"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Custom Ingest</span>
          </button>

          {/* Filter Rules Config */}
          <button
            onClick={onOpenConfigModal}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all"
            title="Configure noise threshold parameters"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Filter Rules</span>
          </button>

          {/* Reset State */}
          <button
            onClick={onResetData}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-all"
            title="Reset to default mock disclosures"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
