# IPO Reality Lab — Complete A–K Product Build

**Understand the IPO. Decode the company. Follow the money.**

A professional Indian IPO research and investor-education platform for two audiences: beginners learning IPO mechanics and informed retail users analysing offer documents, financial statements, risks and post-IPO deployment of proceeds.

## Product coverage

- **A — IPO Information Platform:** company search, board/status filters, official SEBI/NSE/BSE starting points and source registry.
- **B1 — Money Trail:** fresh issue vs OFS and use-of-proceeds concept.
- **B2 / K1 — Promise vs Proof:** immutable RHP baseline model, quarterly utilisation, unspent balances, revisions and evidence trail.
- **B3 — Cash Reality Test:** interactive ratio calculator with transparent formulas and no universal good/bad ranges.
- **B4 — Sentiment vs Fundamentals:** historical-only design; educational market-price data disabled until permission and SEBI checks pass.
- **C — IPO Academy:** 24 topics plus P0-a/b/c monitoring-agency lessons, with plain-language explanation, Indian example, diagram, formula, inference limits, quiz and source links.
- **D1–D6:** Money Flow, Book Building, Financial Health, Due Diligence Checklist, Spot the Scam and Learning Quiz.
- **E — Case Study Library:** 11 approved case candidates, each explicitly marked as a research queue until its primary documents and dated data are verified.
- **F — Investor Protection:** seven scam/FOMO patterns, safer actions and official reporting channels.
- **G — Before Applying Checklist:** 17 explainable RHP inspection points.
- **H — Design Quality:** dark-first neon fintech identity, electric-violet/cyan/hot-pink accents, responsive layout, optional light mode and visible keyboard focus.
- **I — Audit and Feasibility:** competitor snapshot, official-source registry and data-access restrictions.
- **J — Build and Quality:** reproducible data workflow, validation checks, tests and GitHub Pages workflow.
- **K — Four differentiating lenses:** K1 Promise vs Proof, K2 Proceeds Clock, K3 Seller's Lens and K4 Draft-to-Final Diff.

## Important distinction: product completeness vs research-data completeness

The application shell, interactive education modules and data architecture are implemented. The research database now contains one source-reviewed example — Western Carriers (India) Limited — with its prospectus and first CRISIL monitoring-report data. Its original RHP page-level cross-check remains pending, and the Phase 1 target of 10 IPOs is not complete. No other real IPO figures have been fabricated.

The 11 case cards are a research queue, not completed factual case reports. Each case needs original offer documents, financial inputs, risk disclosures, listing-day records, later dated data where permitted, corporate-action adjustments and page-level verification.

This is therefore a complete A–K functional product foundation — **not yet a fully populated and independently audited IPO research database**. Portfolio claims must preserve that distinction.

## Run locally

On Windows, extract the ZIP and double-click `run-local.bat`; it starts a local HTTP server and opens the browser. Full instructions are in `docs/run-and-deploy.md`.


Requirements: Python 3.10+ and a modern browser.

```bash
python -m pip install -r requirements.txt
python scripts/validate_data.py
python -m pytest -q
python -m http.server 8000
```

Open `http://localhost:8000`. Do not open `index.html` directly as a `file://` URL because the app loads local JSON files.

## Official-source integration

The source registry has structured entries and official URLs:

- **SEBI:** regulations, circulars, public issue filings, investor education and grievance information.
- **NSE:** offer documents, public issue advertisements, IPO bid verification and disclosures.
- **BSE:** public issue information and issuer/exchange disclosures.

The present integration is official-source linking plus a manually verified ingestion workflow, not an authenticated live API connection. NSE's terms prohibit systematic/automated collection including scraping, extraction and harvesting without permission. BSE automation is disabled until its applicable terms and permissions are confirmed. Any API/feed requires written authorisation or licence terms, permitted purposes, retention/redistribution limits and an audit trail.

Offer documents are linked rather than mirrored unless legal review confirms redistribution rights.

## SEBI educational price-data rule

The app records SEBI Circular `HO/47/17/12(11)2025-MRD-POD3/I/11107/2026`, dated 8 May 2026: a 30-day lag for sharing and usage of market price data for educational and awareness activities, effective 1 July 2026. The circular also provides safeguards around monetary incentives, legal agreements, due diligence and audit trails. The one-day simulation-lab exception is for NISM only; IPO Reality Lab does not claim it.

This 30-day lag concerns market-price data. It is not a blanket delay on RHPs, prospectuses or other offer documents. Market-price data is disabled by default and live GMP is not part of the core product. Obtain legal review before public launch; this software is not a legal opinion.

## Competitor position

See `docs/competitor-audit.md` and the source-level audit of the first issuer sample in `docs/source-verified-western-carriers.md`. The most important finding is that BeaconCaps publicly describes prospectus research and an accountability tracker covering post-IPO progress and use of proceeds. Therefore K1/K2 must not be marketed as unique. The proposed product distinction is standardised cross-IPO object/quarter data, preserved RHP baselines, exact source-page evidence, validation and clear missing-data states. This claim also needs ongoing competitor testing.

Trendlyne has substantial overlap with basic IPO tracking; CredoNomics publishes an IPO scoring methodology. IPO Reality Lab deliberately displays raw formulas and evidence rather than a black-box score.

## Data workflow

1. Obtain the dated source document through an authorised official channel.
2. Keep the internal working copy under the project's document-control procedure; publish an official source link by default.
3. Extract key fields independently twice.
4. Compare values, units, page references, object mappings, dates and revisions.
5. Resolve every mismatch manually against the PDF.
6. Add records to `data/ipo_records.json`.
7. Run validator and tests; a fact without a document and page fails.
8. Obtain human sign-off and record the last-checked date before publishing.

## Project structure

```text
.
├── index.html
├── styles.css
├── app.js
├── data/
│   ├── academy.json
│   ├── ipo_records.json
│   ├── ipo_record.schema.json
│   ├── demo_scenario.json
│   ├── cases.json
│   ├── scams.json
│   ├── checklist.json
│   ├── source_registry.json
│   ├── regulatory_policy.json
│   └── competitor_matrix.json
├── scripts/validate_data.py
├── tests/
└── docs/
```

## Portfolio description

**IPO Reality Lab** is an evidence-first Indian IPO research and investor education platform. It combines a 24-topic IPO Academy, interactive book-building and financial simulators, investor-protection learning and a source-linked research model for tracking fresh-issue proceeds from original RHP allocations to later utilisation disclosures. It emphasises transparent formulas, page-level traceability, regulatory safeguards and reproducible data validation — without investment recommendations.

## Required page disclaimer

**Educational information from public filings. Not investment advice or a recommendation.**

## GitHub Pages deployment

See `docs/run-and-deploy.md`. The included GitHub Actions workflow validates data and tests before deployment.

## Visual direction

The default UI is now a dark-first Gen-Z fintech visual system: midnight navy surfaces, electric violet primary actions, cyan data highlights, hot-pink OFS accents and restrained glow. The theme control switches to the light theme; the default choice is dark unless the browser has an explicit light-theme preference saved. Important financial tables retain high-contrast text and source references.

## Visual direction

The default is a dark-first Gen-Z fintech theme: midnight navy, electric violet, neon cyan and hot-pink accents. Light mode remains available through the theme toggle. Glow is restrained, while financial tables and evidence references remain high-contrast and easy to scan. See `docs/design-system.md` for the colour tokens and interaction rules.
