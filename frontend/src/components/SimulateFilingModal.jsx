import React, { useState } from "react";
import { X, Zap, Building2, Sparkles, AlertCircle } from "lucide-react";

const PRESET_TEMPLATES = [
  {
    label: "🚨 Promoter Pledging Spike (+4.5%)",
    company_name: "Vedanta Limited",
    ticker: "VEDL.NS",
    event_type: "Promoter Pledging Change",
    category: "CAPITAL_STRUCTURE",
    headline: "Fresh Pledge Creation under Regulation 31 of SEBI SAST Regulations",
    summary: "Promoter group entity Finsider International pledges 4.5% equity to raise $350M collateral for offshore debt repayment.",
    pledge_delta: 4.5,
    total_pledged: 44.5
  },
  {
    label: "🚨 Auditor Sudden Resignation",
    company_name: "Polycab India Limited",
    ticker: "POLYCAB.NS",
    event_type: "Auditor Resignation",
    category: "GOVERNANCE_INTEGRITY",
    headline: "Statutory Auditor Resignation with immediate effect",
    summary: "Statutory Auditor resigns stating inability to obtain sufficient appropriate audit evidence on vendor balances totaling ₹380 Cr.",
    pledge_delta: 0,
    total_pledged: 0
  },
  {
    label: "🛡️ Intraday Price Surge +3.8% (Noise)",
    company_name: "Reliance Industries Limited",
    ticker: "RELIANCE.NS",
    event_type: "intraday price movement",
    category: "MARKET_NOISE",
    headline: "Reliance surges 3.8% in afternoon trade on derivative strike rollover",
    summary: "Heavy intraday option volume on 3,000 Call strike triggers fast price spike. Zero corporate fundamental announcements pending.",
    pledge_delta: 0,
    total_pledged: 0
  },
  {
    label: "🛡️ Routine Volume Spike (Noise)",
    company_name: "Infosys Limited",
    ticker: "INFY.NS",
    event_type: "routine volume spike",
    category: "MARKET_NOISE",
    headline: "Exchange Query on 2.4x volume surge in INFY cash shares",
    summary: "Company officially clarifies to BSE and NSE that no undisclosed events or corporate material developments exist.",
    pledge_delta: 0,
    total_pledged: 0
  },
  {
    label: "🚨 Demerger & Clean Separation",
    company_name: "Tata Motors Limited",
    ticker: "TATAMOTORS.NS",
    event_type: "Demerger & Capital Allocation",
    category: "STRUCTURAL_RESTRUCTURING",
    headline: "Sanction of Scheme of Arrangement for Demerger of Passenger & Commercial Vehicles",
    summary: "NCLT approval received. Creates independent listed pure-play EV/Luxury entity and pure-play commercial vehicle entity.",
    pledge_delta: 0,
    total_pledged: 0
  }
];

export function SimulateFilingModal({ onClose, onFilingCreated }) {
  const [ticker, setTicker] = useState("TATAMOTORS.NS");
  const [companyName, setCompanyName] = useState("Tata Motors Limited");
  const [eventType, setEventType] = useState("Demerger & Capital Allocation");
  const [category, setCategory] = useState("STRUCTURAL_RESTRUCTURING");
  const [headline, setHeadline] = useState("");
  const [summary, setSummary] = useState("");
  const [pledgeDelta, setPledgeDelta] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evalResult, setEvalResult] = useState(null);

  const applyTemplate = (t) => {
    setTicker(t.ticker);
    setCompanyName(t.company_name);
    setEventType(t.event_type);
    setCategory(t.category);
    setHeadline(t.headline);
    setSummary(t.summary);
    setPledgeDelta(t.pledge_delta);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setEvalResult(null);

    const payload = {
      ticker,
      company_name: companyName,
      event_type: eventType,
      category,
      raw_headline: headline || `${eventType} announced by ${companyName}`,
      summary_text: summary || `Exchange disclosure by ${companyName} regarding ${eventType}.`,
      fundamental_metrics: pledgeDelta > 0 ? { pledge_delta_pct: Number(pledgeDelta) } : {}
    };

    try {
      const res = await fetch("/api/simulate/filing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setEvalResult(data.result);
        if (onFilingCreated) {
          onFilingCreated(data.result);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="glass-panel-elevated rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Simulate Custom Corporate Filing</h3>
              <p className="text-xs text-slate-400">Inject event directly into the live noise-canceling filter engine</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="p-3 bg-slate-950/80 border-b border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>Load Quick Scenario Preset:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_TEMPLATES.map((t, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyTemplate(t)}
                className="text-[11px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-all font-sans"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3.5 bg-slate-950/70">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">NSE Ticker (.NS)</label>
              <input
                type="text"
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                required
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-emerald-400 font-mono focus:outline-none focus:border-emerald-500 uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">Event Type Category</label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-sans"
            >
              <option value="Promoter Pledging Change">Promoter Pledging Change (Structural)</option>
              <option value="Auditor Resignation">Auditor Resignation (Critical Governance)</option>
              <option value="Demerger & Capital Allocation">Demerger & Capital Allocation (Structural)</option>
              <option value="Regulatory Sanction & Lending Freeze">Regulatory Sanction / RBI / SEBI (Critical)</option>
              <option value="CFO & Executive Resignation">CFO Sudden Exit (Governance)</option>
              <option value="intraday price movement">Intraday Price Movement (Market Noise)</option>
              <option value="routine volume spike">Routine Volume Spike (Market Noise)</option>
              <option value="earnings whisper">Earnings Whisper / Rumor (Market Noise)</option>
              <option value="routine CSR announcement">Routine CSR Announcement (Administrative)</option>
              <option value="minor ESOP allotment">Minor ESOP Allotment (Administrative)</option>
            </select>
          </div>

          {eventType.includes("Pledg") && (
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                Promoter Pledge Delta % (+{pledgeDelta}%)
              </label>
              <input
                type="range"
                min="0.1"
                max="15.0"
                step="0.1"
                value={pledgeDelta}
                onChange={(e) => setPledgeDelta(parseFloat(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">Filing Headline / Exchange Intimation</label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Disclosure under Regulation 30 of SEBI (LODR) Regulations"
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">Event Summary & Disclosure Details</label>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Detailed summary of the disclosure..."
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 leading-relaxed"
            />
          </div>

          {/* Instant Evaluation Feedback Result */}
          {evalResult && (
            <div className={`p-3.5 rounded-xl border text-xs font-sans animate-in fade-in duration-200 ${
              evalResult.passed_filter 
                ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-200" 
                : "bg-slate-900 border-slate-800 text-slate-300"
            }`}>
              <div className="flex items-center gap-2 font-bold mb-1">
                {evalResult.passed_filter ? (
                  <span className="text-emerald-400 font-mono flex items-center gap-1">
                    ✅ PASSED NOISE FILTER → [{evalResult.severity} ALERT]
                  </span>
                ) : (
                  <span className="text-rose-400 font-mono flex items-center gap-1">
                    🛡️ DROPPED AS NOISE → [{evalResult.drop_code}]
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {evalResult.filter_reason}
              </p>
            </div>
          )}

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Evaluating..." : "Run Through Filter Engine"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
