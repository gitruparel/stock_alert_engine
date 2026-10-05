import React, { useState, useEffect } from "react";
import { X, Sliders, CheckCircle2, ShieldCheck, RefreshCw } from "lucide-react";

export function ConfigDrawer({ onClose, onConfigSaved }) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/config")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setConfig(data.config);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = (key) => {
    setConfig((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSliderChange = (e) => {
    setConfig((prev) => ({ ...prev, min_promoter_pledge_increase_pct: parseFloat(e.target.value) }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config)
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        if (onConfigSaved) onConfigSaved(data.updatedConfig);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!config) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="glass-panel-elevated rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Noise Filter Engine Rules</h3>
              <p className="text-xs text-slate-400">Fine-tune automated rejection criteria for NSE corporate stream</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 bg-slate-950/70 text-xs">
          {/* Rules Toggles */}
          <div className="space-y-3">
            {[
              {
                key: "filter_intraday_price_moves",
                title: "Drop Intraday Price Surges & Dips",
                desc: "Suppresses ±2% to ±8% daily price spikes lacking corporate balance sheet filings."
              },
              {
                key: "filter_routine_volume_spikes",
                title: "Drop Routine Volume & Block Deals",
                desc: "Filters out exchange surveillance queries triggered by ordinary churn without news."
              },
              {
                key: "filter_earnings_whispers",
                title: "Drop Earnings Whispers & Desk Rumors",
                desc: "Eliminates unconfirmed social media channel checks and unverified dealer notes."
              },
              {
                key: "filter_brokerage_opinions",
                title: "Drop Brokerage Target Price Revisions",
                desc: "Ignores sell-side broker targets, upgrades/downgrades that reflect secondary sentiment."
              },
              {
                key: "filter_routine_csr_and_pr",
                title: "Drop Routine CSR & Marketing Laurels",
                desc: "Discards mandatory corporate CSR expenditures and industry awards."
              },
              {
                key: "filter_micro_esops",
                title: "Drop Immaterial ESOP Allotments",
                desc: "Drops routine equity allotment filings representing <0.01% dilution."
              }
            ].map((rule) => (
              <label 
                key={rule.key} 
                className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
              >
                <div>
                  <div className="font-semibold text-slate-200">{rule.title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{rule.desc}</div>
                </div>
                <input
                  type="checkbox"
                  checked={config[rule.key]}
                  onChange={() => handleToggle(rule.key)}
                  className="mt-1 w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                />
              </label>
            ))}
          </div>

          {/* Slider for Promoter Pledging */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-slate-200">
                Minimum Promoter Pledge Delta Threshold
              </span>
              <span className="font-mono text-emerald-400 font-bold">
                +{config.min_promoter_pledge_increase_pct}%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2">
              Any pledge creation below this percentage will be suppressed as routine minor collateral movement.
            </p>
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.5"
              value={config.min_promoter_pledge_increase_pct}
              onChange={handleSliderChange}
              className="w-full accent-emerald-500"
            />
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            {saved ? "✅ Settings Saved & Active" : "Changes apply to subsequent filings"}
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="btn-primary px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Save Rules</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
