// Noise-Canceling Corporate Filing Filter Engine for Long-Term Indian Equities

export class NoiseFilterEngine {
  constructor(config = {}) {
    this.config = {
      filter_earnings_whispers: true,
      filter_intraday_price_moves: true,
      filter_routine_volume_spikes: true,
      filter_routine_csr_and_pr: true,
      filter_brokerage_opinions: true,
      filter_micro_esops: true,
      min_promoter_pledge_increase_pct: 1.0, // Minimum % change to trigger alert
      min_capex_threshold_inr_cr: 1000,
      ...config
    };

    // Blacklisted keywords & event categories that represent ephemeral market noise
    this.noiseKeywords = [
      "earnings whisper",
      "routine volume spike",
      "intraday price movement",
      "intraday price surge",
      "volume surge",
      "routine csr",
      "brokerage target price",
      "analyst note",
      "micro esop",
      "brand award",
      "speculative chatter",
      "rumor",
      "channel check"
    ];

    // High-conviction structural fundamental event patterns
    this.structuralPatterns = [
      {
        type: "PROMOTER_PLEDGE_CHANGE",
        keywords: ["pledge", "pledging", "encumbrance", "sast regulation 31", "unpledged"],
        defaultSeverity: "HIGH",
        category: "CAPITAL_STRUCTURE"
      },
      {
        type: "AUDITOR_RESIGNATION",
        keywords: ["auditor resignation", "resignation of statutory auditor", "disclaimer of opinion", "qualified opinion", "bsr & associates", "deloitte"],
        defaultSeverity: "CRITICAL",
        category: "GOVERNANCE_INTEGRITY"
      },
      {
        type: "KEY_MANAGEMENT_EXIT",
        keywords: ["cfo resignation", "resignation of chief financial officer", "managing director resignation", "ceo exit", "whistleblower"],
        defaultSeverity: "HIGH",
        category: "GOVERNANCE_INTEGRITY"
      },
      {
        type: "CAPITAL_ALLOCATION_RESTRUCTURING",
        keywords: ["demerger", "scheme of arrangement", "capex pivot", "gigafactory", "qip", "debt zero", "redemption of ncd", "nclt", "restructuring"],
        defaultSeverity: "HIGH",
        category: "CAPITAL_STRUCTURE"
      },
      {
        type: "REGULATORY_SANCTION",
        keywords: ["rbi directive", "sebi order", "section 45l", "lending freeze", "embargo", "forensic audit", "show cause notice"],
        defaultSeverity: "CRITICAL",
        category: "REGULATORY_GOVERNANCE"
      }
    ];
  }

  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig() {
    return { ...this.config };
  }

  /**
   * Evaluates an incoming corporate event / filing disclosure
   * Returns a comprehensive evaluation: passed, severity, thesis impact, and notification previews.
   */
  evaluateFiling(filing) {
    const eventTypeLower = (filing.event_type || "").toLowerCase();
    const rawHeadlineLower = (filing.raw_headline || "").toLowerCase();
    const summaryLower = (filing.summary_text || "").toLowerCase();
    const categoryLower = (filing.category || "").toLowerCase();

    // 1. Direct noise category checks
    if (this.config.filter_intraday_price_moves && (
      eventTypeLower.includes("intraday price") ||
      categoryLower.includes("market_noise") && (eventTypeLower.includes("surge") || eventTypeLower.includes("drop") || eventTypeLower.includes("price"))
    )) {
      return this._dropEvent(filing, "INTRADAY_VOLATILITY_NOISE", "Suppressed: Intraday price volatility and short-term derivatives delta do not alter the underlying franchise valuation or structural cash flows.");
    }

    if (this.config.filter_routine_volume_spikes && (
      eventTypeLower.includes("volume spike") ||
      eventTypeLower.includes("volume surge") ||
      summaryLower.includes("routine volume spike") ||
      rawHeadlineLower.includes("surveillance measure triggers on")
    )) {
      return this._dropEvent(filing, "ROUTINE_VOLUME_NOISE", "Suppressed: Short-term liquidity/block-trade volume spikes without price-sensitive fundamental announcements are classified as market churn.");
    }

    if (this.config.filter_earnings_whispers && (
      eventTypeLower.includes("earnings whisper") ||
      summaryLower.includes("dealer desk whisper") ||
      summaryLower.includes("social media gossip")
    )) {
      return this._dropEvent(filing, "EARNINGS_WHISPER_NOISE", "Suppressed: Unverified channel checks and dealer rumors lack statutory filing backing and promote speculative whipsawing.");
    }

    if (this.config.filter_brokerage_opinions && (
      eventTypeLower.includes("brokerage target") ||
      categoryLower.includes("broker_opinion") ||
      rawHeadlineLower.includes("analyst note")
    )) {
      return this._dropEvent(filing, "BROKERAGE_SPECULATION_NOISE", "Suppressed: Sell-side broker target price changes represent secondary sentiment revisions, not corporate balance-sheet disclosures.");
    }

    if (this.config.filter_routine_csr_and_pr && (
      eventTypeLower.includes("routine csr") ||
      eventTypeLower.includes("marketing award") ||
      categoryLower.includes("administrative_noise")
    )) {
      return this._dropEvent(filing, "ADMINISTRATIVE_PR_NOISE", "Suppressed: Mandatory CSR compliance, branding laurels, and routine press releases have zero impact on long-term terminal value.");
    }

    if (this.config.filter_micro_esops && (
      eventTypeLower.includes("minor esop") ||
      eventTypeLower.includes("esop allotment")
    )) {
      return this._dropEvent(filing, "MICRO_DILUTION_NOISE", "Suppressed: Immaterial ESOP share exercise (<0.01% equity base) represents routine corporate administration.");
    }

    // 2. High-conviction structural signal evaluation
    // Check Promoter Pledging
    if (eventTypeLower.includes("pledge") || eventTypeLower.includes("promoter pledging")) {
      const pledgeDelta = filing.fundamental_metrics?.pledge_delta_pct || 0;
      const totalPledged = filing.fundamental_metrics?.total_pledged_pct || 0;

      if (pledgeDelta > 0 && pledgeDelta < this.config.min_promoter_pledge_increase_pct) {
        return this._dropEvent(filing, "SUB_THRESHOLD_PLEDGE", `Suppressed: Promoter pledge increase of ${pledgeDelta}% is below the critical alert threshold of ${this.config.min_promoter_pledge_increase_pct}%.`);
      }

      const severity = totalPledged > 40 || pledgeDelta >= 3.0 ? "CRITICAL" : "HIGH";
      return this._passEvent(filing, severity, "PROMOTER_COLLATERAL_RISK", {
        approval_reason: `Passed: Material promoter pledge change detected (Delta: +${pledgeDelta}%, Total Pledged: ${totalPledged}%). Signals potential leverage strain on controlling promoters.`,
        fundamental_thesis_impact: "Pledging shares for external corporate borrowings or personal guarantees exposes long-term equity holders to catastrophic margin call liquidations during broader market corrections.",
        action_checklist: [
          "Cross-examine quarterly promoter pledge trend on NSE/BSE",
          "Inspect debt repayment schedule of promoter holdcos",
          "Stress test company share price drop to evaluate margin-call trigger point"
        ]
      });
    }

    // Check Auditor Resignation
    if (eventTypeLower.includes("auditor") || summaryLower.includes("auditor resign")) {
      return this._passEvent(filing, "CRITICAL", "GOVERNANCE_AUDITOR_RED_FLAG", {
        approval_reason: "Passed: Premature statutory auditor resignation or disclaimer of audit opinion. Prime leading indicator of governance malfeasance.",
        fundamental_thesis_impact: "Independent auditor departure ahead of term indicates irreconcilable disagreements on revenue recognition, related-party transactions, or asset valuation integrity.",
        action_checklist: [
          "Scrutinize Annexure A resignation letter submitted to Stock Exchanges",
          "Check for pending qualified opinions or unverified distributor receivables",
          "Re-evaluate allocation sizing in portfolio immediately"
        ]
      });
    }

    // Check Demerger / Capital Allocation / Capex
    if (
      eventTypeLower.includes("demerger") ||
      eventTypeLower.includes("capital allocation") ||
      eventTypeLower.includes("debt restructuring") ||
      summaryLower.includes("scheme of arrangement") ||
      summaryLower.includes("net debt-zero")
    ) {
      return this._passEvent(filing, "HIGH", "STRUCTURAL_CAPITAL_ALLOCATION", {
        approval_reason: "Passed: Major corporate restructuring, balance sheet de-leveraging, or capital re-allocation event affecting long-term Return on Invested Capital (ROIC).",
        fundamental_thesis_impact: "Permanent shift in capital structure alters business reinvestment moats, cost of debt, and standalone valuation multiple for individual operating divisions.",
        action_checklist: [
          "Analyze swap ratio and debt division across demerged entities",
          "Calculate post-demerger ROE & ROIC estimates",
          "Verify tax neutrality of the transaction under Indian IT Act Sec 47"
        ]
      });
    }

    // Check Regulatory Enforcement / RBI / SEBI
    if (
      eventTypeLower.includes("regulatory") ||
      summaryLower.includes("rbi directive") ||
      summaryLower.includes("sebi order") ||
      summaryLower.includes("embargo")
    ) {
      return this._passEvent(filing, "CRITICAL", "REGULATORY_INTERVENTION", {
        approval_reason: "Passed: Direct regulatory restriction or disciplinary order by financial authorities (RBI/SEBI/CCI).",
        fundamental_thesis_impact: "Regulatory curbs directly limit addressable market expansion, inflict compliance penalties, and may enforce structural margin compression.",
        action_checklist: [
          "Quantify revenue share contributed by restricted business lines",
          "Estimate time to regulatory audit clearance & remediations",
          "Check if systemic licenses or banking clearances are jeopardized"
        ]
      });
    }

    // Check CFO / Key Management Exit
    if (
      eventTypeLower.includes("cfo") ||
      eventTypeLower.includes("executive resignation") ||
      summaryLower.includes("resignation of chief financial officer")
    ) {
      return this._passEvent(filing, "HIGH", "MANAGEMENT_STABILITY_FLAG", {
        approval_reason: "Passed: Abrupt resignation of key financial stewardship personnel (CFO/Internal Audit Head).",
        fundamental_thesis_impact: "Frequent finance leadership turnover often precedes accounting restatements, disclosure disputes, or liquidity tightness.",
        action_checklist: [
          "Check duration of outgoing CFO's tenure",
          "Review historical cash flow conversion vs reported EBITDA",
          "Monitor immediate successor appointment & credentials"
        ]
      });
    }

    // If explicit is_noise flag already in filing
    if (filing.is_noise) {
      return this._dropEvent(filing, "GENERIC_NOISE", filing.noise_reason || "Suppressed: Event deemed routine and structurally immaterial for long-term thesis.");
    }

    // Default fallback: pass as Medium fundamental event
    return this._passEvent(filing, "MEDIUM", "GENERAL_STRUCTURAL_UPDATE", {
      approval_reason: "Passed: Corporate disclosure with moderate fundamental relevance for long-term tracking.",
      fundamental_thesis_impact: "Routine fundamental event requiring periodic portfolio review.",
      action_checklist: ["Review subsequent quarterly investor presentation"]
    });
  }

  _dropEvent(filing, dropCode, reason) {
    return {
      ...filing,
      filtered_at: new Date().toISOString(),
      passed_filter: false,
      filter_decision: "DROPPED",
      drop_code: dropCode,
      filter_reason: reason,
      severity: "NOISE"
    };
  }

  _passEvent(filing, severity, signalCode, details) {
    const formattedAlert = {
      ...filing,
      filtered_at: new Date().toISOString(),
      passed_filter: true,
      filter_decision: "PASSED",
      signal_code: signalCode,
      severity: severity,
      filter_reason: details.approval_reason,
      fundamental_thesis_impact: details.fundamental_thesis_impact,
      action_checklist: details.action_checklist,
      telegram_dispatch: this.formatTelegramMessage(filing, severity, details),
      whatsapp_dispatch: this.formatWhatsAppMessage(filing, severity, details)
    };
    return formattedAlert;
  }

  formatTelegramMessage(filing, severity, details) {
    const icon = severity === "CRITICAL" ? "🚨🚨 [CRITICAL ALERT]" : "🚨 [LONG-TERM ALERT]";
    const company = filing.company_name;
    const ticker = filing.ticker;
    const event = filing.event_type;

    return `${icon} ${event.toUpperCase()} DETECTED FOR ${ticker} (${company})

🏢 Company: ${company} (${ticker})
⚡ Impact Level: ${severity}
📑 Event: ${event}

📌 Structural Summary:
${filing.summary_text}

💡 Why This Matters (Long-Term Thesis):
${details.fundamental_thesis_impact}

✅ Recommended Due Diligence:
${(details.action_checklist || []).map((step, idx) => `${idx + 1}. ${step}`).join("\n")}

🔗 Official Disclosure: ${filing.source_url}
⏰ Processed via NSE Noise-Canceling Engine at ${new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`;
  }

  formatWhatsAppMessage(filing, severity, details) {
    const icon = severity === "CRITICAL" ? "🔴 *CRITICAL LONG-TERM ALERT*" : "🟡 *STRUCTURAL ALERT*";
    const ticker = filing.ticker;
    const company = filing.company_name;

    return `${icon}
*${ticker}* • ${company}

*Event:* ${filing.event_type}
*Severity:* ${severity}

📝 *Summary:*
${filing.summary_text}

🔍 *Long-Term Impact:*
${details.fundamental_thesis_impact}

📋 *Action Checklist:*
${(details.action_checklist || []).map(step => `• ${step}`).join("\n")}

_Filtered via Automated NSE/BSE Long-Term Engine (Noise Dropped: 100%)_`;
  }
}
