import React, { useState, useEffect } from "react";
import { X, Building2, CheckCircle2, ShieldOff, AlertTriangle, ShieldCheck, History, ExternalLink } from "lucide-react";

export function TickerAuditModal({ symbol, onClose, onOpenNotification }) {
  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!symbol) return;
    setLoading(true);
    fetch(`/api/tickers/${symbol}/history`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setHistoryData(data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [symbol]);

  if (!symbol) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="glass-panel-elevated rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 font-mono font-bold">
              {symbol.slice(0, 3)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-mono">{symbol}</h3>
                <span className="text-xs text-slate-400 font-sans">
                  {historyData?.stock?.name || symbol}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span>{historyData?.stock?.sector || "NSE Equity"}</span>
                <span>•</span>
                <span className="font-mono text-emerald-400">{historyData?.stock?.mcap_category || "Tracked Stock"}</span>
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audit Stats Banner */}
        {historyData && (
          <div className="grid grid-cols-3 divide-x divide-slate-800 border-b border-slate-800 bg-slate-950/40 text-center py-3">
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Structural Alerts</div>
              <div className="text-lg font-bold font-mono text-amber-400">{historyData.alerts_passed}</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Noise Filtered</div>
              <div className="text-lg font-bold font-mono text-emerald-400">{historyData.noise_dropped}</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Noise Ratio</div>
              <div className="text-lg font-bold font-mono text-slate-200">
                {historyData.total_events > 0 
                  ? `${((historyData.noise_dropped / historyData.total_events) * 100).toFixed(0)}%` 
                  : "0%"}
              </div>
            </div>
          </div>
        )}

        {/* Historical Events Stream */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3 bg-slate-950/70">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-medium">
              <History className="w-3.5 h-3.5 text-cyan-400" />
              Historical Corporate Disclosure Audit Trail
            </span>
            <span className="text-[11px] font-mono">Sorted Newest First</span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-slate-500 font-mono">
              Loading historical filings for {symbol}...
            </div>
          ) : historyData?.events?.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No historical events recorded for this stock yet.
            </div>
          ) : (
            historyData?.events?.map((ev) => (
              <div 
                key={ev.id} 
                className={`p-3.5 rounded-xl border transition-all ${
                  ev.passed_filter 
                    ? "bg-slate-900/80 border-slate-700/80 hover:border-emerald-500/40" 
                    : "bg-slate-950/50 border-slate-800/60 opacity-75"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    {ev.passed_filter ? (
                      <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                        ev.severity === 'CRITICAL' ? 'badge-critical' : 'badge-high'
                      }`}>
                        {ev.severity} ALERT
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full badge-noise flex items-center gap-1">
                        <ShieldOff className="w-3 h-3 text-slate-400" />
                        NOISE SUPPRESSED
                      </span>
                    )}

                    <span className="text-xs font-semibold text-slate-300">
                      {ev.event_type}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400">
                    {new Date(ev.filing_date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-2">
                  {ev.summary_text}
                </p>

                {/* Filter Decision Note */}
                <div className="text-[11px] font-sans p-2 rounded bg-slate-950/80 border border-slate-800/80 text-slate-400 flex items-start gap-1.5">
                  <span className="font-mono text-emerald-400 font-semibold uppercase">Engine Note:</span>
                  <span>{ev.filter_reason || ev.noise_reason}</span>
                </div>

                {ev.passed_filter && (
                  <div className="mt-2.5 flex justify-end">
                    <button
                      onClick={() => onOpenNotification(ev)}
                      className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                    >
                      <span>Preview Alert Dispatch</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
