import React, { useState } from "react";
import { X, Copy, Check, Send, Smartphone, MessageSquare, Code, CheckCheck, Radio } from "lucide-react";

export function NotificationModal({ alert, onClose, onTriggerDispatch }) {
  const [activeChannel, setActiveChannel] = useState("whatsapp"); // 'whatsapp' | 'telegram' | 'webhook'
  const [copied, setCopied] = useState(false);
  const [dispatchStatus, setDispatchStatus] = useState(null);
  const [isSending, setIsSending] = useState(false);

  if (!alert) return null;

  const currentPayload = activeChannel === "whatsapp" 
    ? alert.whatsapp_dispatch 
    : activeChannel === "telegram" 
      ? alert.telegram_dispatch 
      : JSON.stringify(alert, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateSend = async () => {
    setIsSending(true);
    setDispatchStatus(null);
    try {
      const res = await fetch("/api/dispatch/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alert_id: alert.id })
      });
      const data = await res.json();
      if (data.success) {
        setDispatchStatus({
          channel: activeChannel.toUpperCase(),
          status: "DELIVERED (200 OK)",
          latency: `${Math.floor(75 + Math.random() * 90)}ms`,
          deliveredAt: new Date().toLocaleTimeString("en-IN")
        });
      }
    } catch {
      setDispatchStatus({ status: "DISPATCHED_LOCALLY", latency: "60ms" });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="glass-panel-elevated rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Simulated Notification Dispatcher</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-slate-700">
                  {alert.ticker}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Visualizing automated output stream for high-conviction long-term investors
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

        {/* Channel Selector Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/50 px-4 sm:px-5">
          <button
            onClick={() => setActiveChannel("whatsapp")}
            className={`py-2.5 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeChannel === "whatsapp"
                ? "border-emerald-500 text-emerald-400 bg-emerald-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp Format</span>
          </button>

          <button
            onClick={() => setActiveChannel("telegram")}
            className={`py-2.5 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeChannel === "telegram"
                ? "border-cyan-500 text-cyan-400 bg-cyan-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Telegram Bot Format</span>
          </button>

          <button
            onClick={() => setActiveChannel("webhook")}
            className={`py-2.5 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeChannel === "webhook"
                ? "border-indigo-500 text-indigo-400 bg-indigo-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Webhook Payload</span>
          </button>
        </div>

        {/* Channel Preview Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-950/70">
          {activeChannel === "whatsapp" && (
            <div className="whatsapp-chat-box p-4 max-w-lg mx-auto shadow-inner">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Long-Term Value Investors India (Group)
                </span>
                <span>Today</span>
              </div>
              <div className="whatsapp-bubble p-4 text-xs font-sans whitespace-pre-line leading-relaxed shadow-lg">
                {alert.whatsapp_dispatch}
                <div className="flex items-center justify-end gap-1 mt-2 text-[10px] text-emerald-200 font-mono">
                  <span>{new Date().toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' })}</span>
                  <CheckCheck className="w-3 h-3 text-cyan-300" />
                </div>
              </div>
            </div>
          )}

          {activeChannel === "telegram" && (
            <div className="telegram-chat-box p-4 max-w-lg mx-auto shadow-inner">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-[11px] text-slate-400">
                <span className="font-semibold text-cyan-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  @NSE_Fundamental_Alerts_Bot [VERIFIED]
                </span>
                <span className="font-mono">bot</span>
              </div>
              <div className="telegram-bubble p-4 text-xs font-mono whitespace-pre-line leading-relaxed shadow-lg">
                {alert.telegram_dispatch}
                <div className="flex items-center justify-end mt-2 text-[10px] text-cyan-200">
                  <span>{new Date().toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          )}

          {activeChannel === "webhook" && (
            <div className="rounded-lg bg-slate-900 p-4 border border-slate-800 max-h-80 overflow-y-auto">
              <pre className="text-xs font-mono text-emerald-400 whitespace-pre-wrap">
                {currentPayload}
              </pre>
            </div>
          )}

          {/* Dispatch simulation status box */}
          {dispatchStatus && (
            <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs font-mono text-emerald-300">
              <span className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                <span>Simulated Dispatch: {dispatchStatus.status}</span>
              </span>
              <span className="text-slate-400">Latency: {dispatchStatus.latency}</span>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs text-slate-400 flex items-center gap-1">
            <span>Dispatched via</span>
            <span className="font-mono text-slate-200 font-medium">KAVACH Engine</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied Payload!" : "Copy Payload"}</span>
            </button>

            <button
              onClick={handleSimulateSend}
              disabled={isSending}
              className="btn-primary flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-50"
            >
              <Send className={`w-3.5 h-3.5 ${isSending ? 'animate-spin' : ''}`} />
              <span>{isSending ? "Simulating Dispatch..." : "Trigger Live Test Dispatch"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
