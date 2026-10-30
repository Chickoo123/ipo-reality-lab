# Independent technical audit brief

This brief is for an independent reviewer or code-audit assistant. It describes the application as it exists today and separates confirmed functionality from future work.

## Objective

Assess whether IPO Lab is reliable, understandable, accessible and safe to publish as an educational research website. Do not assume a feature is live merely because a card or label exists.

## Architecture

- Static client: `index.html`, `styles.css`, `app.js`.
- Data layer: JSON files in `data/`, fetched by the browser at runtime.
- Research validation: `scripts/validate_data.py`.
- Automated tests: `tests/test_project.py`.
- Local server: `serve_local.py` and `run-local.bat`.
- Deployment: GitHub Actions workflow in `.github/workflows/pages.yml`.

There is no server-side database, login system, exchange API credential or personal financial account integration in this version.

## Functional scope to test

1. IPO search, board/status filters and document links.
2. Proceeds breakdown between fresh issue and Offer for Sale.
3. Source-linked issuer research detail panels.
4. Lesson filtering, detail, references and knowledge checks.
5. All six interactive learning tools.
6. Due-diligence checklist persistence and reset.
7. Scam-awareness scenarios and official help links.
8. Source registry links.
9. Dark-first theme and light-mode toggle.
10. Desktop, tablet and mobile layout; keyboard and screen-reader behaviour.

## Data integrity scope

Review issue proceeds reconciliation, net proceeds against object allocations, evidence document IDs and printed page references, units and currency conversions, cumulative utilisation, approved revisions, schedule disclosures, seller disclosure basis and explicit missing-data handling.

Current issuer data: one initial Western Carriers (India) Limited example. The final prospectus and first monitoring-agency report are transcribed. The original RHP page-level cross-check remains pending. Do not describe this as a complete or independently audited company history.

## External source and regulatory boundaries

- SEBI, NSE and BSE are linked as official source destinations.
- No authenticated live exchange API connection is implemented.
- No automated exchange scraping is implemented.
- Live unofficial GMP and market-price data are disabled.
- SEBI's 8 May 2026 circular on educational market-price data is documented in `docs/source-access-and-regulatory.md`.

Verify that public wording does not imply endorsement, sponsorship or API integration by SEBI, NSE or BSE.

## Known limitations

- Issuer coverage is very limited.
- The first issuer's original RHP page-level cross-check is pending.
- Companies without completed source review are not shown as completed case studies.
- The book-building tool is a simplified teaching model, not an exchange allotment algorithm.
- Financial calculator values are hypothetical unless explicitly sourced.
- Browser end-to-end, cross-browser and accessibility audits remain required before claiming production readiness.

## Reproducible commands

```bash
python -m pip install -r requirements.txt
python scripts/validate_data.py
python -m pytest -q
node --check app.js
python serve_local.py
```

## Required audit output

For each issue, report severity, file and line, reproducible steps, user impact, proposed correction, and whether the finding is confirmed or needs more testing. Do not modify files during the audit. Do not invent an API, data source, dataset or functionality.
