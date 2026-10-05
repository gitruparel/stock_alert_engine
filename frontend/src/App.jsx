import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { TelemetryBar } from "./components/TelemetryBar";
import { AlertCard } from "./components/AlertCard";
import { NoiseCard } from "./components/NoiseCard";
import { NotificationModal } from "./components/NotificationModal";
import { TickerAuditModal } from "./components/TickerAuditModal";
import { SimulateFilingModal } from "./components/SimulateFilingModal";
import { ConfigDrawer } from "./components/ConfigDrawer";
import { DispatchLogsView } from "./components/DispatchLogsView";
import { 
  Search, 
  ShieldCheck, 
  ShieldOff, 
  Activity, 
  Smartphone, 
  Building2, 
  Filter, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink
} from "lucide-react";

export default function App() {
  const [alerts, setAlerts] = useState([]);
  const [noise, setNoise] = useState([]);
  const [telemetry, setTelemetry] = useState(null);
  const [tickers, setTickers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Tabs
  const [activeTab, setActiveTab] = useState("ALERTS"); // 'ALERTS' | 'NOISE' | 'TICKERS' | 'DISPATCH'
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [quickTickerFilter, setQuickTickerFilter] = useState("ALL");

  // Modals state
  const [notificationAlert, setNotificationAlert] = useState(null);
  const [auditTicker, setAuditTicker] = useState(null);
  const [showSimulateModal, setShowSimulateModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);

  // SSE & simulation states
  const [sseConnected, setSseConnected] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Fetch initial data
  const loadData = async () => {
    try {
      const [alertsRes, noiseRes, statsRes, tickersRes] = await Promise.all([
        fetch("/api/alerts"),
        fetch("/api/noise"),
        fetch("/api/stats"),
        fetch("/api/tickers")
      ]);

      const [alertsData, noiseData, statsData, tickersData] = await Promise.all([
        alertsRes.json(),
        noiseRes.json(),
        statsRes.json(),
        tickersRes.json()
      ]);

      if (alertsData.success) setAlerts(alertsData.data);
      if (noiseData.success) setNoise(noiseData.data);
      if (statsData.success) setTelemetry(statsData.telemetry);
      if (tickersData.success) setTickers(tickersData.data);
    } catch (err) {
      console.error("Error loading stock alert engine data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Setup SSE connection
    const eventSource = new EventSource("/api/stream");

    eventSource.onopen = () => {
      setSseConnected(true);
    };

    eventSource.addEventListener("connected", (e) => {
      setSseConnected(true);
    });

    eventSource.addEventListener("NEW_HIGH_IMPACT_ALERT", (e) => {
      const newAlert = JSON.parse(e.data);
      setAlerts((prev) => [newAlert, ...prev]);
      showToast(`🚨 High-Impact Signal: ${newAlert.ticker} - ${newAlert.event_type}`, "emerald");
      // Refresh telemetry
      fetch("/api/stats").then(r => r.json()).then(d => d.success && setTelemetry(d.telemetry));
    });

    eventSource.addEventListener("NOISE_SUPPRESSED", (e) => {
      const noiseItem = JSON.parse(e.data);
      setNoise((prev) => [noiseItem, ...prev]);
      showToast(`🛡️ Noise Dropped: ${noiseItem.ticker} - ${noiseItem.event_type}`, "slate");
      // Refresh telemetry
      fetch("/api/stats").then(r => r.json()).then(d => d.success && setTelemetry(d.telemetry));
    });

    eventSource.addEventListener("STATE_RESET", () => {
      loadData();
      showToast("Engine state reset to initial mock disclosures.", "blue");
    });

    eventSource.onerror = () => {
      setSseConnected(false);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const showToast = (message, color = "emerald") => {
    setToastMessage({ message, color });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleSimulateRandom = async () => {
    setIsSimulating(true);
    try {
      const res = await fetch("/api/simulate/random", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        if (data.result.passed_filter) {
          showToast(`🚨 New Structural Signal Ingested: ${data.result.ticker}`, "emerald");
        } else {
          showToast(`🛡️ Routine Intraday Noise Blocked: ${data.result.ticker}`, "slate");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleResetData = async () => {
    try {
      await fetch("/api/reset", { method: "POST" });
      await loadData();
      showToast("Reset to default disclosures", "emerald");
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered alerts
  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      searchTerm === "" ||
      alert.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.event_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.summary_text.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity =
      selectedSeverity === "ALL" || alert.severity.toUpperCase() === selectedSeverity;

    const matchesCategory =
      selectedCategory === "ALL" || alert.category === selectedCategory;

    const matchesTicker =
      quickTickerFilter === "ALL" || alert.ticker === quickTickerFilter;

    return matchesSearch && matchesSeverity && matchesCategory && matchesTicker;
  });

  // Filtered noise
  const filteredNoise = noise.filter((item) => {
    const matchesSearch =
      searchTerm === "" ||
      item.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.event_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.filter_reason && item.filter_reason.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesTicker =
      quickTickerFilter === "ALL" || item.ticker === quickTickerFilter;

    return matchesSearch && matchesTicker;
  });

  // Top stocks for quick filter chips
  const quickTickers = ["ALL", "RELIANCE.NS", "TATAMOTORS.NS", "VEDL.NS", "POLYCAB.NS", "HDFCBANK.NS", "BAJFINANCE.NS", "SUZLON.NS"];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Navbar */}
      <Navbar
        sseConnected={sseConnected}
        onSimulateRandom={handleSimulateRandom}
        onOpenSimulateModal={() => setShowSimulateModal(true)}
        onOpenConfigModal={() => setShowConfigModal(true)}
        onResetData={handleResetData}
        isSimulating={isSimulating}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-4 lg:px-8 py-6 flex-1">
        {/* Telemetry Bar */}
        <TelemetryBar telemetry={telemetry} />

        {/* Search & Navigation Bar */}
        <div className="glass-panel rounded-2xl p-4 mb-6 border border-slate-800 space-y-3.5">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Indian stocks (e.g. Reliance, Tata Motors, VEDL, HDFC Bank, Polycab...)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-sans"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Severity Filter Pills (when on ALERTS tab) */}
            {activeTab === "ALERTS" && (
              <div className="flex items-center gap-1.5 self-start md:self-auto overflow-x-auto pb-1 md:pb-0">
                {["ALL", "CRITICAL", "HIGH", "MEDIUM"].map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setSelectedSeverity(sev)}
                    className={`text-[11px] font-mono px-3 py-1.5 rounded-lg border transition-all ${
                      selectedSeverity === sev
                        ? sev === "CRITICAL"
                          ? "bg-rose-500/20 text-rose-300 border-rose-500/50"
                          : sev === "HIGH"
                            ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                            : "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-semibold"
                        : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    {sev === "ALL" ? "All Severities" : `${sev}`}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Ticker Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 flex-shrink-0">
              <Filter className="w-3 h-3 text-emerald-400" />
              <span>Ticker:</span>
            </span>
            {quickTickers.map((tick) => (
              <button
                key={tick}
                onClick={() => setQuickTickerFilter(tick)}
                className={`font-mono text-[11px] px-2.5 py-1 rounded-md transition-all flex-shrink-0 ${
                  quickTickerFilter === tick
                    ? "bg-emerald-500 text-slate-950 font-bold shadow-sm"
                    : "bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                {tick}
              </button>
            ))}
          </div>

          {/* Main Tab Switcher */}
          <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 flex-wrap gap-2">
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setActiveTab("ALERTS")}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  activeTab === "ALERTS"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>High-Impact Signals ({filteredAlerts.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("NOISE")}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  activeTab === "NOISE"
                    ? "bg-slate-800 text-slate-200 border border-slate-700"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <ShieldOff className="w-3.5 h-3.5 text-slate-400" />
                <span>Suppressed Noise ({filteredNoise.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("TICKERS")}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  activeTab === "TICKERS"
                    ? "bg-slate-800 text-slate-200 border border-slate-700"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Tracked Stocks ({tickers.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("DISPATCH")}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  activeTab === "DISPATCH"
                    ? "bg-slate-800 text-slate-200 border border-slate-700"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Dispatcher Logs</span>
              </button>
            </div>

            <span className="text-[11px] font-mono text-slate-500">
              Noise Cancellation Active
            </span>
          </div>
        </div>

        {/* Content Stream according to activeTab */}
        {activeTab === "ALERTS" && (
          <div className="space-y-4">
            {loading ? (
              <div className="py-20 text-center text-xs font-mono text-slate-500">
                Loading filtered alerts...
              </div>
            ) : filteredAlerts.length === 0 ? (
              <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800">
                <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto mb-3 opacity-80" />
                <h3 className="text-sm font-bold text-white mb-1">No alerts match current filter</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                  No structural events found matching your search. Try resetting filters or simulate a corporate filing.
                </p>
                <button
                  onClick={() => { setSearchTerm(""); setSelectedSeverity("ALL"); setQuickTickerFilter("ALL"); }}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onOpenNotification={(a) => setNotificationAlert(a)}
                  onSelectTicker={(t) => setAuditTicker(t)}
                />
              ))
            )}
          </div>
        )}

        {activeTab === "NOISE" && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span>Showing corporate noise suppressed by automated filter engine</span>
              <span className="font-mono text-emerald-400">{filteredNoise.length} items dropped</span>
            </div>
            {filteredNoise.map((item) => (
              <NoiseCard
                key={item.id}
                item={item}
                onSelectTicker={(t) => setAuditTicker(t)}
              />
            ))}
          </div>
        )}

        {activeTab === "TICKERS" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {tickers.map((stock) => (
              <div
                key={stock.symbol}
                className="glass-panel rounded-xl p-4 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="font-mono text-sm font-bold text-emerald-400">
                        {stock.symbol}
                      </div>
                      <div className="text-xs font-semibold text-white">
                        {stock.name}
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      stock.risk_badge === 'CRITICAL_ATTENTION'
                        ? 'badge-critical'
                        : stock.risk_badge === 'STRUCTURAL_SHIFT'
                          ? 'badge-high'
                          : 'badge-live'
                    }`}>
                      {stock.risk_badge}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 mb-3">
                    {stock.sector} • <span className="text-slate-300">{stock.mcap_category}</span>
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span className="text-amber-400">{stock.alerts_count} Alerts</span>
                    <span className="text-slate-400">{stock.noise_suppressed_count} Noise</span>
                  </div>
                  <button
                    onClick={() => setAuditTicker(stock.symbol)}
                    className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                  >
                    <span>Audit History</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "DISPATCH" && (
          <DispatchLogsView onOpenNotification={(a) => setNotificationAlert(a)} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>KAVACH Automated Stock Alert Engine • Designed for Long-Term Indian Value Investors</span>
          <span className="font-mono text-[11px] text-slate-400">NSE / BSE SEBI Disclosure Intelligence</span>
        </div>
      </footer>

      {/* Floating Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 glass-panel-elevated p-3.5 rounded-xl border border-slate-700 shadow-2xl flex items-center gap-2.5 text-xs animate-in slide-in-from-bottom duration-200">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-white font-medium">{toastMessage.message}</span>
        </div>
      )}

      {/* Modals */}
      {notificationAlert && (
        <NotificationModal
          alert={notificationAlert}
          onClose={() => setNotificationAlert(null)}
        />
      )}

      {auditTicker && (
        <TickerAuditModal
          symbol={auditTicker}
          onClose={() => setAuditTicker(null)}
          onOpenNotification={(a) => {
            setAuditTicker(null);
            setNotificationAlert(a);
          }}
        />
      )}

      {showSimulateModal && (
        <SimulateFilingModal
          onClose={() => setShowSimulateModal(false)}
          onFilingCreated={() => {
            loadData();
          }}
        />
      )}

      {showConfigModal && (
        <ConfigDrawer
          onClose={() => setShowConfigModal(false)}
          onConfigSaved={() => {
            loadData();
          }}
        />
      )}
    </div>
  );
}
