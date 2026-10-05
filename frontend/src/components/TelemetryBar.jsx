import React from "react";
import { Filter, AlertTriangle, Clock, Activity, CheckCircle2, ShieldAlert } from "lucide-react";

export function TelemetryBar({ telemetry }) {
  if (!telemetry) return null;

  const {
    total_filings_processed = 0,
    high_impact_alerts_delivered = 0,
    intraday_noise_cancelled = 0,
    noise_cancellation_pct = 0,
    estimated_hours_saved = "0.0",
    severity_distribution = {}
  } = telemetry;

  const criticalCount = severity_distribution.CRITICAL || 0;
  const highCount = severity_distribution.HIGH || 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4 mb-6">
      {/* 1. Noise Cancellation Rate */}
      <div className="glass-panel rounded-xl p-4 border border-slate-800/80 relative overflow-hidden">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="flex items-center gap-1.5 font-medium">
            <Filter className="w-3.5 h-3.5 text-emerald-400" />
            Noise Canceling Efficiency
          </span>
          <span className="text-[11px] font-mono text-emerald-400 font-semibold">{noise_cancellation_pct}%</span>
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl font-bold font-mono text-white tracking-tight">{intraday_noise_cancelled}</span>
          <span className="text-xs text-slate-400">suppressed of {total_filings_processed}</span>
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(noise_cancellation_pct, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* 2. High-Conviction Signals */}
      <div className="glass-panel rounded-xl p-4 border border-slate-800/80">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="flex items-center gap-1.5 font-medium">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            High-Impact Alerts
          </span>
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
            Passed
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-amber-400 tracking-tight">
            {high_impact_alerts_delivered}
          </span>
          <span className="text-xs text-slate-400">structural signals</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          {highCount} High impact • {criticalCount} Critical
        </p>
      </div>

      {/* 3. Critical Governance Warnings */}
      <div className="glass-panel rounded-xl p-4 border border-slate-800/80">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            Critical Governance Flags
          </span>
          {criticalCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          )}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-rose-400 tracking-tight">
            {criticalCount}
          </span>
          <span className="text-xs text-slate-400">immediate alerts</span>
        </div>
        <p className="text-[11px] text-rose-300/80 mt-1 truncate">
          Auditor resignations, SEBI/RBI curbs
        </p>
      </div>

      {/* 4. Time Saved */}
      <div className="glass-panel rounded-xl p-4 border border-slate-800/80">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            Screen Time Saved
          </span>
          <span className="text-[10px] font-mono text-cyan-400">~15m/drop</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-white tracking-tight">
            {estimated_hours_saved}h
          </span>
          <span className="text-xs text-slate-400">noise-free hours</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 truncate">
          Saved from intraday price & gossip churn
        </p>
      </div>
    </div>
  );
}
