# Portfolio case study — IPO Reality Lab

## One-line description
An evidence-first Indian IPO research and investor-education platform that connects offer-document disclosures to post-listing proceeds utilisation, while teaching IPO mechanics through interactive tools.

## Problem
Most retail IPO discovery products concentrate on calendars, subscription, allotment and unofficial GMP. These are useful but do not, by themselves, teach a user how to read an RHP or follow the company's stated use of fresh-issue proceeds after listing. Generic financial education is also disconnected from a repeatable document-level data model.

## Product approach
Build three connected experiences:
1. **Track:** factual IPO information and links to original offer documents and exchange disclosures.
2. **Research:** Money Trail, Cash Reality Test and source-linked Promise vs Proof / Proceeds Clock data views.
3. **Learn:** a 24-topic IPO Academy, knowledge checks, simulators, case-study research queue and investor-protection learning.

## Data / analytics contribution
- Designed an IPO → RHP object → quarterly report → utilisation → evidence data model.
- Preserved the original RHP object allocation as an immutable baseline.
- Defined quarter-to-quarter validation for cumulative utilisation, approved revisions and allocation reconciliation.
- Made every material fact require a document ID and page reference.
- Separated unavailable, not disclosed and not applicable values rather than encoding unknowns as zero.
- Added formula-led financial analysis instead of a black-box investment score.
- Designed two-pass extraction and human review before publication.

## Responsible product decisions
- No Subscribe/Avoid recommendations, listing predictions or best-IPO ranking.
- No live GMP feed.
- No unauthorised automated scraping of exchange websites.
- SEBI education price-data policy is centralised and market-price data is disabled until licensing / legal review.
- Simulated inputs are visibly labelled; one Western Carriers source-backed proceeds record is present, and the wider issuer dataset is being populated only after source verification.

## Current implementation evidence
- 27 Academy lessons (24 core modules + 3 monitoring-agency P0 lessons).
- Six interactive learning tools (D1–D6).
- 17-point due-diligence checklist.
- Seven investor-protection / scam-awareness patterns.
- Eleven case-study research candidates.
- Official-source registry for SEBI, NSE and BSE.
- Data validator and automated test suite.

## Honest completion boundary
The application and learning interactions are implemented. One initial issuer record has been source-reviewed, with the RHP page-level cross-check still pending. This is not yet a fully populated IPO research database. The 11 case cards remain research candidates. Western Carriers has an initial proceeds snapshot with prospectus and monitoring-report page references; its RHP cross-check and full business / valuation / listing-journey case write-up remain pending. Browser end-to-end QA and public deployment are still release tasks.

## Resume / portfolio bullet (use only with this status)
Designed and built an evidence-first Indian IPO research and education platform with a 27-module learning academy, six interactive simulators, official-source registry, source-page data model and automated validation rules for tracking IPO proceeds — with no investment recommendations and no fabricated issuer data.
