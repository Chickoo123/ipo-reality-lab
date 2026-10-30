# Portfolio case study — IPO Lab

## Overview

IPO Lab is an evidence-led Indian IPO research and investor-education platform. It connects original offer-document disclosures with company financial analysis, later reported proceeds utilisation and practical learning tools.

## Problem

Retail IPO information is often fragmented across calendars, subscription tables, offer documents, exchange disclosures and issuer reports. Users may see issue statistics without understanding how to read offer documents, where fresh-issue money is meant to go or what later utilisation reports actually say.

## Product

- Searchable issuer records with links to official offer documents and disclosures.
- Clear separation of fresh issue proceeds and Offer for Sale proceeds.
- Source-linked research on stated use of proceeds, later utilisation and disclosed revisions.
- Financial ratio tools with visible formulas and hypothetical inputs.
- Seller and offer-document disclosure analysis.
- Learning modules, interactive simulators, due-diligence guidance and scam-awareness scenarios.

## Data and analytics contribution

- Designed an issuer → offer document → object → reporting period → utilisation → evidence model.
- Preserved original offer-document allocations as baselines.
- Added validation for issue split, net proceeds, object allocations, report evidence, cumulative utilisation and documented revisions.
- Required page-level sources for material values.
- Distinguished missing, undisclosed and inapplicable information.
- Used transparent formula-based ratios rather than a black-box investment score.
- Established a two-pass extraction and human review process.

## Responsible product decisions

- No subscribe / avoid recommendations or personal investment advice.
- No listing-price predictions or guaranteed returns.
- No live unofficial GMP feed.
- No unauthorised automated exchange scraping.
- Educational market-price data remains disabled pending source permissions and compliance review.
- Simulated financial and book-building inputs are labelled hypothetical.

## Current implementation

- 27 learning modules.
- Six interactive educational tools.
- A 17-item offer-document review checklist.
- Seven investor-protection and scam-awareness patterns.
- Official-source registry for SEBI, NSE, BSE, issuers and reporting institutions.
- Python data validator and automated tests.
- GitHub Actions validation and static-site deployment workflow.

## Current coverage boundary

One initial Western Carriers (India) Limited example is recorded from its final prospectus and first monitoring-agency report. The original RHP page-level cross-check remains pending. This is not a complete issuer case study or broad IPO database. Additional issuer coverage, later quarters, browser testing and accessibility review remain outstanding.

## Portfolio description

Designed and built an evidence-led Indian IPO research and education platform with source-linked disclosure analysis, transparent financial tools, a 27-module academy and automated data-integrity checks for post-IPO proceeds research.
