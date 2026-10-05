import assert from "node:assert";
import { NoiseFilterEngine } from "../src/engine/noiseFilter.js";
import { NotificationDispatcher } from "../src/engine/dispatcher.js";
import { INITIAL_DISCLOSURES } from "../src/data/mockFilings.js";

console.log("=== Running KAVACH-NSE Stock Alert Engine Test Suite ===\n");

const engine = new NoiseFilterEngine();
const dispatcher = new NotificationDispatcher();

// Test 1: Verify noise events are dropped
console.log("Test 1: Dropping ephemeral intraday and gossip noise...");

const intradayNoiseEvent = {
  id: "TEST-01",
  company_name: "Reliance Industries",
  ticker: "RELIANCE.NS",
  event_type: "intraday price movement",
  category: "MARKET_NOISE",
  raw_headline: "Stock spikes 3.5% on heavy option block deal",
  summary_text: "Intraday momentum trade."
};

const res1 = engine.evaluateFiling(intradayNoiseEvent);
assert.strictEqual(res1.passed_filter, false, "Intraday price movement should be dropped");
assert.strictEqual(res1.drop_code, "INTRADAY_VOLATILITY_NOISE");
console.log("  ✓ Intraday price movement successfully dropped.");

const whisperNoiseEvent = {
  id: "TEST-02",
  company_name: "HDFC Bank",
  ticker: "HDFCBANK.NS",
  event_type: "earnings whisper",
  category: "MARKET_NOISE",
  raw_headline: "Rumor of NIM expansion",
  summary_text: "Dealer desk whisper circulating on chat."
};

const res2 = engine.evaluateFiling(whisperNoiseEvent);
assert.strictEqual(res2.passed_filter, false, "Earnings whisper should be dropped");
assert.strictEqual(res2.drop_code, "EARNINGS_WHISPER_NOISE");
console.log("  ✓ Earnings whisper rumor successfully dropped.");

const volumeNoiseEvent = {
  id: "TEST-03",
  company_name: "Infosys",
  ticker: "INFY.NS",
  event_type: "routine volume spike",
  category: "MARKET_NOISE",
  raw_headline: "Surveillance query on volume",
  summary_text: "Routine volume spike."
};

const res3 = engine.evaluateFiling(volumeNoiseEvent);
assert.strictEqual(res3.passed_filter, false, "Volume spike should be dropped");
assert.strictEqual(res3.drop_code, "ROUTINE_VOLUME_NOISE");
console.log("  ✓ Routine volume spike successfully dropped.");

// Test 2: Verify high-impact structural signals pass
console.log("\nTest 2: Elevating high-impact fundamental signals...");

const pledgeEvent = {
  id: "TEST-04",
  company_name: "Vedanta Limited",
  ticker: "VEDL.NS",
  event_type: "Promoter Pledging Change",
  category: "CAPITAL_STRUCTURE",
  raw_headline: "Pledge of 4.85% shares",
  summary_text: "Promoter pledges 4.85% for debt covenant.",
  fundamental_metrics: {
    pledge_delta_pct: 4.85,
    total_pledged_pct: 43.05
  }
};

const res4 = engine.evaluateFiling(pledgeEvent);
assert.strictEqual(res4.passed_filter, true, "Promoter pledge spike must pass");
assert.strictEqual(res4.severity, "CRITICAL", "High pledge should be CRITICAL");
assert.ok(res4.telegram_dispatch.includes("VEDL.NS"), "Telegram dispatch should contain ticker");
assert.ok(res4.whatsapp_dispatch.includes("VEDL.NS"), "WhatsApp dispatch should contain ticker");
console.log("  ✓ Promoter pledging spike passed with CRITICAL severity.");

const auditorEvent = {
  id: "TEST-05",
  company_name: "Polycab India",
  ticker: "POLYCAB.NS",
  event_type: "Auditor Resignation",
  category: "GOVERNANCE_INTEGRITY",
  raw_headline: "Statutory Auditor Resigns immediately",
  summary_text: "Auditor resigns over unreconciled trade vendor balances."
};

const res5 = engine.evaluateFiling(auditorEvent);
assert.strictEqual(res5.passed_filter, true, "Auditor resignation must pass");
assert.strictEqual(res5.severity, "CRITICAL", "Auditor resignation must be CRITICAL");
console.log("  ✓ Auditor resignation elevated as CRITICAL governance flag.");

// Test 3: Simulated Dispatcher
console.log("\nTest 3: Dispatcher multi-channel delivery...");
const dispatchRes = dispatcher.dispatch(res4);
assert.ok(dispatchRes !== null, "Dispatch result should not be null");
assert.strictEqual(dispatchRes.channels.length, 3, "Should dispatch across Telegram, WhatsApp, and Webhook");
assert.strictEqual(dispatchRes.channels[0].status, "DELIVERED");
assert.strictEqual(dispatchRes.channels[1].status, "DELIVERED");
console.log("  ✓ Simulated delivery logged across WhatsApp, Telegram, and Webhook.");

// Test 4: Initial Disclosures Filter Stats
console.log("\nTest 4: Initial Mock Dataset Noise Ratio...");
let passedCount = 0;
let droppedCount = 0;

for (const filing of INITIAL_DISCLOSURES) {
  const ev = engine.evaluateFiling(filing);
  if (ev.passed_filter) passedCount++;
  else droppedCount++;
}

console.log(`  Processed ${INITIAL_DISCLOSURES.length} disclosures: ${passedCount} passed, ${droppedCount} dropped.`);
assert.ok(droppedCount >= 6, "At least 6 noisy events should be suppressed");
assert.ok(passedCount >= 6, "At least 6 structural events should pass");
console.log("  ✓ Noise reduction ratio successfully validated.");

console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY! The Noise Filter Engine is robust and operational.");
