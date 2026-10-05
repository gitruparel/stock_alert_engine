import React from "react";
import { ShieldOff, EyeOff, CheckCircle2 } from "lucide-react";

export function NoiseCard({ item, onSelectTicker }) {
  const formattedDate = new Date(item.filing_date).toLocaleString("en-IN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <div className="glass-panel rounded-xl p-4 border border-slate-800/80 bg-slate-950/40 hover:border-slate-700/60 transition-all opacity-85 hover:opacity-100">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectTicker(item.ticker)}
            className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-900 text-slate-400 hover:text-emerald-400 border border-slate-800 transition-colors"
          >
            {item.ticker}
          </button>
          <span className="text-xs font-medium text-slate-300">
            {item.company_name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800/80 text-rose-300/80 border border-slate-700/60 flex items-center gap-1">
            <EyeOff className="w-3 h-3 text-rose-400" />
            <span>DROPPED NOISE</span>
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            {formattedDate}
          </span>
        </div>
      </div>

      {/* Raw Event Title */}
      <h4 className="text-xs text-slate-400 line-through decoration-slate-600 mb-1">
        {item.raw_headline || item.summary_text}
      </h4>

      {/* Why the engine dropped this */}
      <div className="mt-2.5 p-2.5 rounded bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
        <ShieldOff className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
        <div>
          <span className="font-semibold text-amber-300 font-mono text-[11px] uppercase mr-1">
            [{item.drop_code || "SUPPRESSED"}]:
          </span>
          <span>{item.filter_reason || item.noise_reason}</span>
        </div>
      </div>
    </div>
  );
}
