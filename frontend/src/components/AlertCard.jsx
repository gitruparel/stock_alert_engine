import React, { useState } from "react";
import { AlertCircle, ChevronDown, ChevronUp, ExternalLink, Send, ShieldAlert, Sparkles, Building2, CheckSquare } from "lucide-react";

export function AlertCard({ alert, onOpenNotification, onSelectTicker }) {
  const [showChecklist, setShowChecklist] = useState(false);

  const getSeverityBadgeClass = (severity) => {
    switch (severity?.toUpperCase()) {
      case "CRITICAL":
        return "badge-critical";
      case "HIGH":
        return "badge-high";
      case "MEDIUM":
        return "badge-medium";
      default:
        return "badge-noise";
    }
  };

  const formattedDate = new Date(alert.filing_date).toLocaleString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <article className="glass-panel rounded-xl p-5 border border-slate-800 hover:border-slate-700 transition-all duration-200 relative group">
      {/* Top Header Row */}
      <div className="flex flex-wrap items-start justify-between gap-2.5 mb-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Ticker Button */}
          <button
            onClick={() => onSelectTicker(alert.ticker)}
            className="font-mono text-sm font-bold px-2.5 py-1 rounded bg-slate-800 text-emerald-400 hover:bg-slate-700 hover:text-emerald-300 border border-slate-700 transition-colors flex items-center gap-1.5"
            title="Inspect historical structural flags for this stock"
          >
            <span>{alert.ticker}</span>
          </button>

          <span className="text-sm font-semibold text-slate-200">
            {alert.company_name}
          </span>

          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline-block">
            • {alert.sector}
          </span>
        </div>

        {/* Severity Badge */}
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-mono font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full ${getSeverityBadgeClass(alert.severity)}`}>
            {alert.severity} IMPACT
          </span>
          <span className="text-xs text-slate-400 font-mono">
            {formattedDate}
          </span>
        </div>
      </div>

      {/* Event Type & Headline */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono">
            [{alert.event_type}]
          </span>
        </div>
        <h3 className="text-sm font-medium text-slate-100 leading-snug">
          {alert.raw_headline || alert.summary_text}
        </h3>
      </div>

      {/* Summary Text */}
      <div className="text-xs text-slate-300 mb-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 leading-relaxed font-sans">
        {alert.summary_text}
      </div>

      {/* Key Fundamental Metrics Badges if present */}
      {alert.fundamental_metrics && Object.keys(alert.fundamental_metrics).length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {Object.entries(alert.fundamental_metrics).map(([key, val]) => (
            <div key={key} className="text-[11px] font-mono bg-slate-900 px-2 py-1 rounded border border-slate-800 text-slate-300 flex items-center gap-1.5">
              <span className="text-slate-500 uppercase">{key.replace(/_/g, ' ')}:</span>
              <span className="text-emerald-300 font-semibold">{String(val)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Fundamental Thesis Impact Box (Why this is NOT noise) */}
      {alert.fundamental_thesis_impact && (
        <div className="mb-3 p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/30">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Why This Matters (Long-Term Thesis):</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {alert.fundamental_thesis_impact}
          </p>
        </div>
      )}

      {/* Action Checklist Accordion */}
      {alert.action_checklist && alert.action_checklist.length > 0 && (
        <div className="mb-3">
          <button
            onClick={() => setShowChecklist(!showChecklist)}
            className="flex items-center justify-between w-full text-xs font-medium text-slate-400 hover:text-slate-200 py-1 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span>Recommended Due Diligence Checklist ({alert.action_checklist.length} points)</span>
            </span>
            {showChecklist ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showChecklist && (
            <ul className="mt-2 space-y-1.5 pl-2 border-l-2 border-slate-800 text-xs text-slate-300 font-mono">
              {alert.action_checklist.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">{idx + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
        <div className="flex items-center gap-2">
          {/* Notification Preview Button */}
          <button
            onClick={() => onOpenNotification(alert)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all font-medium"
            title="Preview how this alert formats for WhatsApp or Telegram"
          >
            <Send className="w-3.5 h-3.5" />
            <span>View Dispatch Preview</span>
          </button>

          {/* Quick Ticker Filter */}
          <button
            onClick={() => onSelectTicker(alert.ticker)}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Audit History</span>
          </button>
        </div>

        {alert.source_url && (
          <a
            href={alert.source_url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors"
            title="View original exchange corporate filing"
          >
            <span className="hidden md:inline">NSE Filing</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </article>
  );
}
