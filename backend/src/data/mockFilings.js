// Mock corporate disclosures and market feed for NSE/BSE listed equities
// Includes both high-impact structural signals and noisy intraday/administrative events

export const INITIAL_DISCLOSURES = [
  {
    id: "NSE-DISC-20261001-001",
    company_name: "Vedanta Limited",
    ticker: "VEDL.NS",
    exchange: "NSE",
    sector: "Metals & Mining",
    event_type: "Promoter Pledging Change",
    category: "CAPITAL_STRUCTURE",
    filing_date: "2026-10-01T09:15:00Z",
    raw_headline: "Disclosure under Regulation 31(1) and 31(2) of SEBI (SAST) Regulations - Creation of fresh pledge",
    summary_text: "Promoter Group Finsider International has pledged an additional 4.85% of total paid-up equity (representing ₹4,200 Cr value) to secure offshore term-loan covenants. Total promoter pledged stake increases from 38.2% to 43.05%.",
    source_url: "https://www.nseindia.com/corporate-disclosures/filing/vedl-pledge-oct26",
    impact_score: "High",
    is_noise: false,
    fundamental_metrics: {
      promoter_holding_pct: 63.7,
      total_pledged_pct: 43.05,
      pledge_delta_pct: 4.85,
      debt_covenant_risk: "Elevated"
    }
  },
  {
    id: "NSE-DISC-20261001-002",
    company_name: "Reliance Industries Limited",
    ticker: "RELIANCE.NS",
    exchange: "NSE",
    sector: "Oil, Gas & Conglomerate",
    event_type: "intraday price movement",
    category: "MARKET_NOISE",
    filing_date: "2026-10-01T11:42:00Z",
    raw_headline: "Market Movement Alert: Reliance surges 2.8% on intraday heavy volume across option strikes",
    summary_text: "Stock spikes ₹75 in morning trade following speculative chatter about global refinery margins. Total intraday turnover exceeded ₹1,100 Cr with 1-minute RSI crossing 78.",
    source_url: "https://www.nseindia.com/market-activity/intraday-moves/reliance",
    impact_score: "Low",
    is_noise: true,
    noise_reason: "Ephemeral intraday price fluctuation driven by derivatives positioning; zero change to balance sheet, cash flows, or moats."
  },
  {
    id: "NSE-DISC-20261002-003",
    company_name: "Tata Motors Limited",
    ticker: "TATAMOTORS.NS",
    exchange: "NSE",
    sector: "Automotive",
    event_type: "Demerger & Capital Allocation",
    category: "STRUCTURAL_RESTRUCTURING",
    filing_date: "2026-10-02T08:30:00Z",
    raw_headline: "Scheme of Arrangement for Demerger of Commercial Vehicles and Passenger Vehicles into two independent listed entities",
    summary_text: "Board formally passes NCLT-sanctioned scheme splitting Tata Motors into: (1) Commercial Vehicles & allied investments, and (2) Passenger Vehicles (Electric Vehicles, Jaguar Land Rover). Ratio fixed at 1:1 entitlement. Completely ring-fences balance sheets and distinct capital allocations.",
    source_url: "https://www.nseindia.com/corporate-disclosures/filing/tatamotors-demerger-oct26",
    impact_score: "High",
    is_noise: false,
    fundamental_metrics: {
      strategic_shift: "Full Pure-Play Separation",
      debt_allocation_ratio: "45% CV : 55% PV/JLR",
      valuation_unlocking_thesis: "Multiple rerating for pure EV/Luxury arm"
    }
  },
  {
    id: "NSE-DISC-20261002-004",
    company_name: "Tata Consultancy Services Ltd",
    ticker: "TCS.NS",
    exchange: "NSE",
    sector: "Information Technology",
    event_type: "routine CSR announcement",
    category: "ADMINISTRATIVE_NOISE",
    filing_date: "2026-10-02T10:15:00Z",
    raw_headline: "Press Release: TCS extends STEM education outreach to 50 rural districts across Odisha",
    summary_text: "Company undertakes rural skill workshops under scheduled mandatory CSR obligations for FY27, committing ₹8.5 Cr expenditure.",
    source_url: "https://www.nseindia.com/corporate-disclosures/filing/tcs-csr-rural",
    impact_score: "Low",
    is_noise: true,
    noise_reason: "Routine statutory Corporate Social Responsibility compliance; immaterial financial materiality (<0.01% of annual net profit)."
  },
  {
    id: "NSE-DISC-20261002-005",
    company_name: "Polycab India Limited",
    ticker: "POLYCAB.NS",
    exchange: "NSE",
    sector: "Electricals & Cables",
    event_type: "Auditor Resignation & Disclaimer",
    category: "GOVERNANCE_INTEGRITY",
    filing_date: "2026-10-02T18:45:00Z",
    raw_headline: "Resignation of Statutory Auditor pursuant to Regulation 30 read with SEBI Circular CIR/CFD/CMD1/114/2019",
    summary_text: "Statutory Auditor BSR & Associates LLP tenders resignation with immediate effect, noting inability to verify third-party vendor invoices and channel distributor discounts totaling ₹410 Cr during interim review.",
    source_url: "https://www.nseindia.com/corporate-disclosures/filing/polycab-auditor-exit",
    impact_score: "High",
    is_noise: false,
    fundamental_metrics: {
      governance_flag: "CRITICAL",
      unreconciled_discrepancy_inr_cr: 410,
      auditor_tenure_remaining_months: 28
    }
  },
  {
    id: "NSE-DISC-20261003-006",
    company_name: "HDFC Bank Limited",
    ticker: "HDFCBANK.NS",
    exchange: "NSE",
    sector: "Banking & Financial Services",
    event_type: "earnings whisper",
    category: "MARKET_NOISE",
    filing_date: "2026-10-03T09:20:00Z",
    raw_headline: "Market Rumor: Unconfirmed dealer desk whisper indicates Q2 Net Interest Margin to expand by 14 bps",
    summary_text: "Social media and unsourced desk notes suggest credit-deposit ratio normalising faster than anticipated. Trading volume up 1.4x 30-day average.",
    source_url: "https://www.nseindia.com/market-activity/unconfirmed-notes/hdfc-whisper",
    impact_score: "Low",
    is_noise: true,
    noise_reason: "Unsubstantiated dealer desk rumor & pre-earnings speculation; filter drops all unverified non-SEBI channel check noise."
  },
  {
    id: "NSE-DISC-20261003-007",
    company_name: "Adani Enterprises Limited",
    ticker: "ADANIENT.NS",
    exchange: "NSE",
    sector: "Infrastructure & Conglomerate",
    event_type: "Major Capital Allocation & Debt Sizing",
    category: "CAPITAL_STRUCTURE",
    filing_date: "2026-10-03T11:00:00Z",
    raw_headline: "Outcome of Board Meeting: Approval of ₹18,000 Cr qualified institutional placement (QIP) for airport and solar capex",
    summary_text: "Board formally approves raising up to ₹18,000 Cr via QIP of equity shares. Proceeds earmarked for Navi Mumbai International Airport Phase-2 commissioning and polysilicon green hydrogen capex, restructuring intermediate debt obligations.",
    source_url: "https://www.nseindia.com/corporate-disclosures/filing/adanient-qip-oct26",
    impact_score: "High",
    is_noise: false,
    fundamental_metrics: {
      dilution_risk: "Estimated 4.2% equity dilution",
      leverage_shift: "Expected Net Debt/EBITDA reduction from 3.1x to 2.3x",
      capex_commitment_inr_cr: 18000
    }
  },
  {
    id: "NSE-DISC-20261003-008",
    company_name: "Infosys Limited",
    ticker: "INFY.NS",
    exchange: "NSE",
    sector: "Information Technology",
    event_type: "routine volume spike",
    category: "MARKET_NOISE",
    filing_date: "2026-10-03T14:10:00Z",
    raw_headline: "Exchange Volume Query: Surveillance measure triggers on 1.8x volume surge in INFY cash segment",
    summary_text: "Exchange issued routine clarification request regarding sudden volume spike. Company replied that no unpublished price sensitive information (UPSI) is pending disclosure.",
    source_url: "https://www.nseindia.com/corporate-disclosures/filing/infy-clarification-volume",
    impact_score: "Low",
    is_noise: true,
    noise_reason: "Routine trading volume anomaly with official confirmation of zero pending corporate fundamental catalysts."
  },
  {
    id: "NSE-DISC-20261004-009",
    company_name: "Bajaj Finance Limited",
    ticker: "BAJFINANCE.NS",
    exchange: "NSE",
    sector: "Non-Banking Financials (NBFC)",
    event_type: "Regulatory Sanction & Lending Freeze",
    category: "REGULATORY_GOVERNANCE",
    filing_date: "2026-10-04T17:30:00Z",
    raw_headline: "RBI directive under Section 45L(1)(b) of the Reserve Bank of India Act, 1934 - Temporary embargo on digital EMI lending",
    summary_text: "Reserve Bank of India directs Bajaj Finance to immediately halt sanction and disbursal of loans under its two instant-lending products ('e-COM' and 'Insta EMI Card') due to non-adherence of Digital Lending Guidelines regarding key fact statements (KFS).",
    source_url: "https://www.nseindia.com/corporate-disclosures/filing/bajfinance-rbi-action-oct26",
    impact_score: "High",
    is_noise: false,
    fundamental_metrics: {
      aum_impact_pct: "Estimated 11% of quarterly incremental disbursement run-rate",
      compliance_overhaul_required: true,
      margin_compression_risk: "High on unsecured customer acquisition funnel"
    }
  },
  {
    id: "NSE-DISC-20261004-010",
    company_name: "ITC Limited",
    ticker: "ITC.NS",
    exchange: "NSE",
    sector: "FMCG & Hotels",
    event_type: "brokerage target price update",
    category: "MARKET_NOISE",
    filing_date: "2026-10-04T12:00:00Z",
    raw_headline: "Analyst Note: Foreign institutional brokerage raises target price from ₹510 to ₹545 with 'Overweight' stance",
    summary_text: "Sell-side analyst reports optimistic outlook on leaf tobacco exports and cigarette volume growth trajectory for upcoming festive season.",
    source_url: "https://www.nseindia.com/market-reports/itc-target-update",
    impact_score: "Low",
    is_noise: true,
    noise_reason: "Sell-side price target revisions and broker opinions represent subjective secondary sentiment, not primary structural filings."
  },
  {
    id: "NSE-DISC-20261004-011",
    company_name: "One97 Communications (Paytm)",
    ticker: "PAYTM.NS",
    exchange: "NSE",
    sector: "Fintech",
    event_type: "CFO & Executive Resignation",
    category: "GOVERNANCE_INTEGRITY",
    filing_date: "2026-10-04T20:10:00Z",
    raw_headline: "Change in Senior Management Personnel under Regulation 30: Resignation of Chief Financial Officer",
    summary_text: "Company intimates the sudden resignation of Group CFO effective immediately citing personal reasons. This marks the third senior finance leadership departure within an 18-month regulatory review window.",
    source_url: "https://www.nseindia.com/corporate-disclosures/filing/paytm-cfo-resignation",
    impact_score: "High",
    is_noise: false,
    fundamental_metrics: {
      leadership_stability: "Severely Compromised",
      turnover_in_18m: "3 key finance heads",
      internal_controls_flag: "Elevated Audit Scrutiny"
    }
  },
  {
    id: "NSE-DISC-20261005-012",
    company_name: "Tata Consultancy Services Ltd",
    ticker: "TCS.NS",
    exchange: "NSE",
    sector: "Information Technology",
    event_type: "minor ESOP allotment",
    category: "ADMINISTRATIVE_NOISE",
    filing_date: "2026-10-05T09:40:00Z",
    raw_headline: "Allotment of 4,320 equity shares under TCS Employee Stock Purchase Scheme (ESPS)",
    summary_text: "Nomination & Remuneration Committee approved allotment of 4,320 equity shares of face value ₹1 each upon exercise of employee options.",
    source_url: "https://www.nseindia.com/corporate-disclosures/filing/tcs-esop-allotment",
    impact_score: "Low",
    is_noise: true,
    noise_reason: "Micro-allotment of ESOP shares resulting in <0.0001% equity dilution; standard administrative filing."
  },
  {
    id: "NSE-DISC-20261005-013",
    company_name: "Suzlon Energy Limited",
    ticker: "SUZLON.NS",
    exchange: "NSE",
    sector: "Renewable Energy",
    event_type: "Debt Restructuring & De-leveraging",
    category: "CAPITAL_STRUCTURE",
    filing_date: "2026-10-05T13:20:00Z",
    raw_headline: "Complete Redemption of Non-Convertible Debentures and Attainment of Net Debt-Zero Balance Sheet",
    summary_text: "Suzlon concludes full prepayment and extinguishment of remaining ₹1,900 Cr term debt ahead of maturity schedule using operational cash generation and rights issue proceeds, resulting in total release of all consortium lender liens on manufacturing assets.",
    source_url: "https://www.nseindia.com/corporate-disclosures/filing/suzlon-debt-zero-oct26",
    impact_score: "High",
    is_noise: false,
    fundamental_metrics: {
      net_debt_inr_cr: 0,
      interest_coverage_jump: "From 1.8x to >12x",
      pledge_release: "100% of promoter shares unencumbered"
    }
  },
  {
    id: "NSE-DISC-20261005-014",
    company_name: "Reliance Industries Limited",
    ticker: "RELIANCE.NS",
    exchange: "NSE",
    sector: "Oil, Gas & Conglomerate",
    event_type: "Major Capital Allocation & Capex Pivot",
    category: "CAPITAL_STRUCTURE",
    filing_date: "2026-10-05T16:00:00Z",
    raw_headline: "Strategic Board Decision: Reallocation of ₹75,000 Cr Capex pipeline towards Integrated Solar Giga-factory & Green Hydrogen",
    summary_text: "RIL announces major capital expenditure pivot transferring ₹75,000 Cr over 3 years from traditional refining debottlenecking directly into Jamnagar Green Energy Giga-complex, including polysilicon, cell module, and 10GW electrolyser manufacturing facilities.",
    source_url: "https://www.nseindia.com/corporate-disclosures/filing/reliance-green-capex-75k",
    impact_score: "High",
    is_noise: false,
    fundamental_metrics: {
      capex_commitment_inr_cr: 75000,
      long_term_margin_impact: "Transformation into integrated clean-energy operator",
      roe_transition_horizon: "3-5 years"
    }
  },
  {
    id: "NSE-DISC-20261005-015",
    company_name: "Zomato Limited",
    ticker: "ZOMATO.NS",
    exchange: "NSE",
    sector: "Internet & Consumer Services",
    event_type: "routine marketing award",
    category: "ADMINISTRATIVE_NOISE",
    filing_date: "2026-10-05T16:45:00Z",
    raw_headline: "Corporate Announcement: Zomato bags Brand of the Year award at Indian Digital Commerce Conclave",
    summary_text: "General corporate release highlighting award recognition for delivery speed and branding campaign.",
    source_url: "https://www.nseindia.com/corporate-disclosures/filing/zomato-award",
    impact_score: "Low",
    is_noise: true,
    noise_reason: "Marketing press release with zero economic significance or structural business model shift."
  }
];

export const INDIAN_STOCK_UNIVERSE = [
  { symbol: "RELIANCE.NS", name: "Reliance Industries Ltd", sector: "Oil, Gas & Conglomerate", mcap_category: "Large Cap", tracked_since: "2024-01-01" },
  { symbol: "TCS.NS", name: "Tata Consultancy Services Ltd", sector: "Information Technology", mcap_category: "Large Cap", tracked_since: "2024-01-01" },
  { symbol: "TATAMOTORS.NS", name: "Tata Motors Ltd", sector: "Automotive", mcap_category: "Large Cap", tracked_since: "2024-01-01" },
  { symbol: "HDFCBANK.NS", name: "HDFC Bank Ltd", sector: "Banking & Financials", mcap_category: "Large Cap", tracked_since: "2024-01-01" },
  { symbol: "INFY.NS", name: "Infosys Ltd", sector: "Information Technology", mcap_category: "Large Cap", tracked_since: "2024-01-01" },
  { symbol: "ITC.NS", name: "ITC Ltd", sector: "FMCG", mcap_category: "Large Cap", tracked_since: "2024-01-01" },
  { symbol: "VEDL.NS", name: "Vedanta Ltd", sector: "Metals & Mining", mcap_category: "Mid Cap", tracked_since: "2024-01-01" },
  { symbol: "ADANIENT.NS", name: "Adani Enterprises Ltd", sector: "Infrastructure", mcap_category: "Large Cap", tracked_since: "2024-01-01" },
  { symbol: "BAJFINANCE.NS", name: "Bajaj Finance Ltd", sector: "Financial Services", mcap_category: "Large Cap", tracked_since: "2024-01-01" },
  { symbol: "POLYCAB.NS", name: "Polycab India Ltd", sector: "Capital Goods / Electricals", mcap_category: "Mid Cap", tracked_since: "2024-01-01" },
  { symbol: "PAYTM.NS", name: "One97 Communications Ltd", sector: "Fintech", mcap_category: "Small Cap", tracked_since: "2024-01-01" },
  { symbol: "SUZLON.NS", name: "Suzlon Energy Ltd", sector: "Renewable Energy", mcap_category: "Small/Mid Cap", tracked_since: "2024-01-01" },
  { symbol: "ZOMATO.NS", name: "Zomato Ltd", sector: "Consumer Tech", mcap_category: "Large Cap", tracked_since: "2024-01-01" }
];

// Pool of dynamic random events that can be simulated in real-time
export const RANDOM_EVENT_TEMPLATES = [
  {
    company_name: "Vedanta Limited",
    ticker: "VEDL.NS",
    sector: "Metals & Mining",
    event_type: "Promoter Pledging Change",
    category: "CAPITAL_STRUCTURE",
    raw_headline: "SEBI SAST Disclosure: Additional 3.2% shares pledged by Twin Star Holdings for collateral cover",
    summary_text: "Promoter entity pledges 3.2% more shares due to international zinc price drop and debt margin call, increasing total pledged ratio to 46.25%.",
    impact_score: "High",
    is_noise: false,
    fundamental_metrics: {
      pledge_delta_pct: 3.2,
      total_pledged_pct: 46.25,
      risk_level: "High Risk Covenant Breach"
    }
  },
  {
    company_name: "Tata Motors Limited",
    ticker: "TATAMOTORS.NS",
    sector: "Automotive",
    event_type: "intraday price movement",
    category: "MARKET_NOISE",
    raw_headline: "Intraday Momentum: Tata Motors drops 2.1% in late trading session on EU tariff rumors",
    summary_text: "Stock slides 2% during European trading hours on social media gossip regarding hypothetical UK EV tariff reviews.",
    impact_score: "Low",
    is_noise: true,
    noise_reason: "Ephemeral intraday price noise based on speculative overseas social media channels."
  },
  {
    company_name: "HDFC Bank Limited",
    ticker: "HDFCBANK.NS",
    sector: "Banking & Financial Services",
    event_type: "Auditor Resignation",
    category: "GOVERNANCE_INTEGRITY",
    raw_headline: "Sub-Auditor Transition: Independent branch auditor flags loan classification irregularity",
    summary_text: "Regional branch auditor issues qualified opinion over MSME restructured book and steps down before scheduled tenure completion.",
    impact_score: "High",
    is_noise: false,
    fundamental_metrics: {
      governance_flag: "CRITICAL",
      sector_systemic_risk: "Moderate",
      provisioning_impact: "Requires Special Scrutiny"
    }
  },
  {
    company_name: "Infosys Limited",
    ticker: "INFY.NS",
    sector: "Information Technology",
    event_type: "routine volume spike",
    category: "MARKET_NOISE",
    raw_headline: "Volume Breakout: 450,000 shares traded in 5-minute window without corporate announcement",
    summary_text: "Algorithmic basket trade triggered high intraday churn across IT index components.",
    impact_score: "Low",
    is_noise: true,
    noise_reason: "Pure algorithmic execution flow; no filing or structural business development."
  },
  {
    company_name: "Reliance Industries Limited",
    ticker: "RELIANCE.NS",
    sector: "Oil, Gas & Conglomerate",
    event_type: "Capital Allocation & Major Capex",
    category: "CAPITAL_STRUCTURE",
    raw_headline: "Corporate Announcement: Final Investment Decision taken on 10GW Battery Storage Giga-Factory",
    summary_text: "RIL commits ₹14,000 Cr equity funding to commercialize sodium-ion energy storage systems, aiming for commercial production within 24 months.",
    impact_score: "High",
    is_noise: false,
    fundamental_metrics: {
      capex_commitment_inr_cr: 14000,
      strategic_pivot: "Battery Storage Scaling",
      funding_source: "Internal cash accruals"
    }
  },
  {
    company_name: "ITC Limited",
    ticker: "ITC.NS",
    sector: "FMCG",
    event_type: "earnings whisper",
    category: "MARKET_NOISE",
    raw_headline: "Desk Speculation: Telegram channel claims ITC may consider hotel demerger swap ratio revision",
    summary_text: "Unverified anonymous social media claims of shareholder activist pressure on hotel demerger terms.",
    impact_score: "Low",
    is_noise: true,
    noise_reason: "Social media and messaging channel rumor unsupported by official exchange filings."
  }
];
