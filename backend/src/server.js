import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { INITIAL_DISCLOSURES, INDIAN_STOCK_UNIVERSE, RANDOM_EVENT_TEMPLATES } from "./data/mockFilings.js";
import { NoiseFilterEngine } from "./engine/noiseFilter.js";
import { NotificationDispatcher } from "./engine/dispatcher.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.resolve(__dirname, "../../frontend/dist");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.static(frontendDistPath));

// In-memory application state
const filterEngine = new NoiseFilterEngine();
const dispatcher = new NotificationDispatcher();

// Process initial disclosures through the noise filter
let allProcessedFilings = [];
let passedAlerts = [];
let suppressedNoise = [];

// SSE connected clients
let sseClients = [];

function initializeData() {
  allProcessedFilings = [];
  passedAlerts = [];
  suppressedNoise = [];

  for (const filing of INITIAL_DISCLOSURES) {
    const evaluated = filterEngine.evaluateFiling(filing);
    allProcessedFilings.push(evaluated);
    if (evaluated.passed_filter) {
      passedAlerts.push(evaluated);
      dispatcher.dispatch(evaluated);
    } else {
      suppressedNoise.push(evaluated);
    }
  }
}

initializeData();

// Broadcast event to all SSE subscribers
function broadcastSSE(eventType, data) {
  const payload = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach((client) => {
    try {
      client.res.write(payload);
    } catch {
      // Ignore write errors for disconnected clients
    }
  });
}

// -------------------------------------------------------------
// ROUTES
// -------------------------------------------------------------

// SSE stream endpoint
app.get("/api/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const clientId = Date.now();
  const newClient = { id: clientId, res };
  sseClients.push(newClient);

  // Send initial handshake
  res.write(`event: connected\ndata: ${JSON.stringify({ message: "Connected to NSE/BSE Long-Term Alert Engine Stream", clientId })}\n\n`);

  req.on("close", () => {
    sseClients = sseClients.filter((c) => c.id !== clientId);
  });
});

// 1. Get filtered high-impact signals
app.get("/api/alerts", (req, res) => {
  const { ticker, severity, category, search } = req.query;
  let results = [...passedAlerts];

  if (ticker && ticker !== "ALL") {
    results = results.filter((a) => a.ticker.toLowerCase() === ticker.toLowerCase());
  }

  if (severity && severity !== "ALL") {
    results = results.filter((a) => a.severity.toLowerCase() === severity.toLowerCase());
  }

  if (category && category !== "ALL") {
    results = results.filter((a) => a.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (a) =>
        a.company_name.toLowerCase().includes(q) ||
        a.ticker.toLowerCase().includes(q) ||
        a.event_type.toLowerCase().includes(q) ||
        a.summary_text.toLowerCase().includes(q)
    );
  }

  // Sort newest first
  results.sort((a, b) => new Date(b.filing_date) - new Date(a.filing_date));
  res.json({ success: true, count: results.length, data: results });
});

// 2. Get suppressed noise feed
app.get("/api/noise", (req, res) => {
  const { ticker, search } = req.query;
  let results = [...suppressedNoise];

  if (ticker && ticker !== "ALL") {
    results = results.filter((n) => n.ticker.toLowerCase() === ticker.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (n) =>
        n.company_name.toLowerCase().includes(q) ||
        n.ticker.toLowerCase().includes(q) ||
        n.event_type.toLowerCase().includes(q) ||
        n.summary_text.toLowerCase().includes(q) ||
        (n.filter_reason && n.filter_reason.toLowerCase().includes(q))
    );
  }

  results.sort((a, b) => new Date(b.filing_date) - new Date(a.filing_date));
  res.json({ success: true, count: results.length, data: results });
});

// 3. Engine Telemetry & Statistics
app.get("/api/stats", (req, res) => {
  const totalProcessed = allProcessedFilings.length;
  const passedCount = passedAlerts.length;
  const noiseCount = suppressedNoise.length;
  const noiseCancellationRate = totalProcessed > 0 ? ((noiseCount / totalProcessed) * 100).toFixed(1) : "0.0";

  // Breakdown of noise types dropped
  const noiseTypeBreakdown = suppressedNoise.reduce((acc, curr) => {
    const type = curr.drop_code || "GENERIC_NOISE";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  // Severity distribution
  const severityDistribution = passedAlerts.reduce((acc, curr) => {
    acc[curr.severity] = (acc[curr.severity] || 0) + 1;
    return acc;
  }, {});

  res.json({
    success: true,
    telemetry: {
      total_filings_processed: totalProcessed,
      high_impact_alerts_delivered: passedCount,
      intraday_noise_cancelled: noiseCount,
      noise_cancellation_pct: Number(noiseCancellationRate),
      estimated_hours_saved: (noiseCount * 0.25).toFixed(1), // ~15 min per noisy filing review
      noise_by_type: noiseTypeBreakdown,
      severity_distribution: severityDistribution
    }
  });
});

// 4. Tracked Indian Equities Universe
app.get("/api/tickers", (req, res) => {
  const universeWithStats = INDIAN_STOCK_UNIVERSE.map((stock) => {
    const stockAlerts = passedAlerts.filter((a) => a.ticker === stock.symbol);
    const stockNoise = suppressedNoise.filter((n) => n.ticker === stock.symbol);
    const criticalCount = stockAlerts.filter((a) => a.severity === "CRITICAL").length;

    let riskBadge = "STABLE";
    if (criticalCount > 0) riskBadge = "CRITICAL_ATTENTION";
    else if (stockAlerts.length > 1) riskBadge = "STRUCTURAL_SHIFT";

    return {
      ...stock,
      alerts_count: stockAlerts.length,
      noise_suppressed_count: stockNoise.length,
      risk_badge: riskBadge,
      last_event: stockAlerts[0]?.event_type || stockNoise[0]?.event_type || "No recent activity"
    };
  });

  res.json({ success: true, count: universeWithStats.length, data: universeWithStats });
});

// 5. Stock-specific complete historical audit trail
app.get("/api/tickers/:symbol/history", (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  const stockInfo = INDIAN_STOCK_UNIVERSE.find((s) => s.symbol.toUpperCase() === symbol);

  const history = allProcessedFilings
    .filter((f) => f.ticker.toUpperCase() === symbol)
    .sort((a, b) => new Date(b.filing_date) - new Date(a.filing_date));

  res.json({
    success: true,
    stock: stockInfo || { symbol, name: symbol },
    total_events: history.length,
    alerts_passed: history.filter((h) => h.passed_filter).length,
    noise_dropped: history.filter((h) => !h.passed_filter).length,
    events: history
  });
});

// 6. Ingest custom simulated filing
app.post("/api/simulate/filing", (req, res) => {
  const {
    company_name,
    ticker,
    event_type,
    category,
    raw_headline,
    summary_text,
    source_url,
    fundamental_metrics,
    is_noise
  } = req.body;

  if (!company_name || !ticker || !event_type) {
    return res.status(400).json({ success: false, error: "Missing required fields: company_name, ticker, event_type" });
  }

  const newFiling = {
    id: `NSE-SIM-${Date.now()}`,
    company_name,
    ticker: ticker.toUpperCase(),
    exchange: "NSE",
    sector: req.body.sector || "Indian Equities",
    event_type,
    category: category || "CORPORATE_DISCLOSURE",
    filing_date: new Date().toISOString(),
    raw_headline: raw_headline || `NSE Intimation: ${event_type}`,
    summary_text: summary_text || "Simulated exchange disclosure under Regulation 30/31.",
    source_url: source_url || `https://www.nseindia.com/corporate-disclosures/${ticker.toLowerCase()}`,
    fundamental_metrics: fundamental_metrics || {},
    is_noise: is_noise !== undefined ? is_noise : false
  };

  const evaluated = filterEngine.evaluateFiling(newFiling);
  allProcessedFilings.unshift(evaluated);

  let dispatchResult = null;
  if (evaluated.passed_filter) {
    passedAlerts.unshift(evaluated);
    dispatchResult = dispatcher.dispatch(evaluated);
    broadcastSSE("NEW_HIGH_IMPACT_ALERT", evaluated);
  } else {
    suppressedNoise.unshift(evaluated);
    broadcastSSE("NOISE_SUPPRESSED", evaluated);
  }

  res.json({
    success: true,
    result: evaluated,
    dispatched: dispatchResult
  });
});

// 7. Ingest random realistic Indian market filing
app.post("/api/simulate/random", (req, res) => {
  const randomIndex = Math.floor(Math.random() * RANDOM_EVENT_TEMPLATES.length);
  const template = RANDOM_EVENT_TEMPLATES[randomIndex];

  const simulatedFiling = {
    ...template,
    id: `NSE-RAND-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    exchange: "NSE",
    filing_date: new Date().toISOString(),
    source_url: `https://www.nseindia.com/corporate-disclosures/filing/${template.ticker.toLowerCase()}-stream`
  };

  const evaluated = filterEngine.evaluateFiling(simulatedFiling);
  allProcessedFilings.unshift(evaluated);

  let dispatchResult = null;
  if (evaluated.passed_filter) {
    passedAlerts.unshift(evaluated);
    dispatchResult = dispatcher.dispatch(evaluated);
    broadcastSSE("NEW_HIGH_IMPACT_ALERT", evaluated);
  } else {
    suppressedNoise.unshift(evaluated);
    broadcastSSE("NOISE_SUPPRESSED", evaluated);
  }

  res.json({
    success: true,
    template_used: template.event_type,
    result: evaluated,
    dispatched: dispatchResult
  });
});

// 8. Dispatcher logs & channels
app.get("/api/dispatch/logs", (req, res) => {
  res.json({
    success: true,
    channels: dispatcher.getChannelsInfo(),
    logs: dispatcher.getDispatchLogs()
  });
});

// 9. Dispatch a manual preview/test
app.post("/api/dispatch/test", (req, res) => {
  const { alert_id } = req.body;
  const alert = passedAlerts.find((a) => a.id === alert_id) || passedAlerts[0];

  if (!alert) {
    return res.status(404).json({ success: false, error: "No alert available to dispatch." });
  }

  const dispatchEntry = dispatcher.dispatch(alert);
  res.json({ success: true, dispatch: dispatchEntry });
});

// 10. Filter Engine Configuration
app.get("/api/config", (req, res) => {
  res.json({ success: true, config: filterEngine.getConfig() });
});

app.post("/api/config", (req, res) => {
  filterEngine.updateConfig(req.body);
  res.json({ success: true, updatedConfig: filterEngine.getConfig() });
});

// 11. Reset database to initial state
app.post("/api/reset", (req, res) => {
  initializeData();
  broadcastSSE("STATE_RESET", { message: "Dataset reset to initial state" });
  res.json({ success: true, message: "Engine state reset to initial mock disclosures" });
});

// Fallback for SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendDistPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`[NSE/BSE Long-Term Stock Alert Engine] Backend running on http://localhost:${PORT}`);
});
