import React, { useState, useEffect } from "react";
import { Send, Smartphone, CheckCheck, RefreshCw, Radio, Terminal, ExternalLink } from "lucide-react";

export function DispatchLogsView({ onOpenNotification }) {
  const [logs, setLogs] = useState([]);
  const [channels, setChannels] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLogs = () => {
    setLoading(true);
    fetch("/api/dispatch/logs")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLogs(data.logs);
          setChannels(data.channels);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-4">
      {/* Channels Status Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="glass-panel rounded-xl p-3.5 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">WhatsApp Business API</div>
              <div className="text-[11px] text-slate-400 font-mono">Status: Connected (200)</div>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>

        <div className="glass-panel rounded-xl p-3.5 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Telegram Alerts Bot</div>
              <div className="text-[11px] text-slate-400 font-mono">1,420 Active Subscribers</div>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
        </div>

        <div className="glass-panel rounded-xl p-3.5 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Portfolio Core Webhook</div>
              <div className="text-[11px] text-slate-400 font-mono">JSON Event Bus Active</div>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
        </div>
      </div>

      {/* Dispatch Audit Log Table */}
      <div className="glass-panel rounded-xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Automated Dispatch Activity Feed</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {logs.length} Delivered
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Log of filtered high-impact signals routed to WhatsApp, Telegram & Webhooks
            </p>
          </div>
          <button
            onClick={fetchLogs}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Refresh dispatch logs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-800/80 max-h-[500px] overflow-y-auto">
          {logs.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No dispatch logs recorded yet. Ingest a high-impact filing to trigger alerts.
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.dispatch_id} className="p-4 hover:bg-slate-900/30 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-xs font-bold text-emerald-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {log.ticker}
                    </span>
                    <span className="text-xs text-white font-sans font-semibold">
                      {log.company_name}
                    </span>
                    <span className="text-[10px] uppercase px-2 py-0.5 rounded-full badge-high">
                      {log.severity}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400">
                    {new Date(log.dispatched_at).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit"
                    })}
                  </span>
                </div>

                <div className="text-xs text-slate-300 font-mono mb-2">
                  [{log.event_type}]
                </div>

                {/* Delivered Channels Status */}
                <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                  {log.channels.map((ch, idx) => (
                    <div
                      key={idx}
                      className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5"
                    >
                      <CheckCheck className="w-3 h-3 text-emerald-400" />
                      <span className="text-slate-400">{ch.type}:</span>
                      <span className="text-emerald-300">{ch.status}</span>
                      <span className="text-slate-500">({ch.latency_ms}ms)</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
