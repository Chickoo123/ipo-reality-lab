# IPO Lab

**Understand the issue. Research the issuer. Follow the proceeds.**

IPO Lab is an evidence-led Indian IPO research and investor-education platform. It brings together official offer-document links, company fundamentals, issue structure, source-linked proceeds utilisation and practical learning tools. The goal is to help readers understand what an IPO actually discloses — not to tell them whether to apply.

## What the platform includes

- **IPO discovery:** searchable issuer records with board, status and official document links.
- **Offer structure:** a clear explanation of fresh issues, offers for sale and where proceeds go.
- **Proceeds research:** compare stated objects of the issue with later reported utilisation, unspent amounts, revisions and disclosed comments.
- **Financial analysis:** transparent ratio calculations with editable hypothetical inputs and visible formulas.
- **Seller disclosures:** review selling shareholders, share quantities and weighted-average acquisition-cost disclosures with their stated basis.
- **Document comparison:** inspect visible differences between draft and final offer documents with source-page references.
- **IPO Academy:** 27 learning modules, from basic IPO mechanics to monitoring-agency reports.
- **Interactive learning:** six educational tools covering issue proceeds, book building, financial ratios, due diligence, scam awareness and knowledge checks.
- **Investor protection:** practical red flags and links to official grievance and cybercrime reporting resources.

## Official sources

- [SEBI — public issue filings](https://www.sebi.gov.in/filings/public-issues.html)
- [NSE — offer documents](https://www.nseindia.com/companies-listing/corporate-filings-offer-documents)
- [BSE — public issues](https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx?id=1&Type=p)

The current product uses official-source links and manually reviewed records. It does **not** claim authenticated live NSE or BSE API connectivity.

## Research transparency

The database currently contains one initial evidence-linked issuer example: Western Carriers (India) Limited. Its final prospectus and first monitoring-agency report have been transcribed with document references. The original RHP page-level cross-check remains outstanding, and this is not a complete issuer history.

Other companies are not presented as completed case studies until their original offer documents, financial data and relevant later disclosures have been checked. Unknown values remain unknown. A monitoring-agency report is not automatically an audit of project outcomes.

## Regulatory and data-access safeguards

SEBI's circular dated 8 May 2026 prescribes a 30-day lag for sharing and usage of market-price data for educational and awareness purposes, effective 1 July 2026. The one-day simulation-lab exception is specific to NISM and is not claimed by this project. This is not a blanket delay on offer documents.

Market-price data and live unofficial GMP are disabled. Automated exchange collection is not attempted. Public access to a webpage does not automatically grant bulk collection, storage or redistribution rights. See [source-access-and-regulatory.md](docs/source-access-and-regulatory.md).

## Technology

HTML5, CSS3, vanilla JavaScript, JSON data files, a Python data-integrity validator, pytest and GitHub Actions.

## Run locally

Requirements: Python 3.10+ and a modern browser.

**Windows:** double-click `run-local.bat` from the repository root.

**Any platform:**
```bash
python -m pip install -r requirements.txt
python scripts/validate_data.py
python -m pytest -q
node --check app.js
python serve_local.py
```

Open `http://localhost:8000`. Do not open `index.html` directly with a `file://` URL; JSON loading requires an HTTP server.

## Deployment

GitHub Actions validates issuer data and tests before publishing the static site. The deployment artifact includes only the website files and the JSON data required by the browser.

One-time setup: open **Settings → Pages** and select **GitHub Actions** under “Build and deployment → Source”. Then pushes to `main` trigger deployment. See [run-and-deploy.md](docs/run-and-deploy.md).

## Independent review

The [technical audit brief](docs/technical-audit-brief.md) explains the architecture, functional scope, supported claims, known limitations and reproducible checks for an independent code review.

Browser testing, accessibility review, broader issuer coverage and the original RHP cross-check are still release tasks.

## Disclaimer

IPO Lab is an educational research project. It does not provide investment advice, recommendations, subscribe/avoid calls, listing predictions or guaranteed outcomes.
