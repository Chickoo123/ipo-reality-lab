# Data model

The model follows `IPO → Object → Report → Utilisation → Evidence`, with `sellers[]` supporting K3 and `document_changes[]` supporting K4.

## IPO record outline (illustrative only)
```json
{
  "id": "issuer-ipo-year",
  "company_name": "Exact issuer legal name",
  "board": "mainboard",
  "issue_status": "listed",
  "last_checked": "YYYY-MM-DD",
  "documents": [
    {"id":"rhp","type":"RHP","date":"YYYY-MM-DD","url":"https://official-source","source_id":"SEBI","title":"Exact title"}
  ],
  "figures": [
    {"id":"fresh-issue","label":"Fresh issue","value":100,"unit":"INR_crore","evidence":{"document_id":"rhp","page":42}}
  ],
  "money_flow": {
    "gross_proceeds_inr_crore":100,"fresh_issue_inr_crore":70,
    "ofs_inr_crore":30,"net_proceeds_inr_crore":66,
    "evidence":{"document_id":"rhp","page":41}
  },
  "objects_of_issue": [
    {
      "id":"capex","name":"Exact RHP object wording","baseline_allocation_inr":25,
      "baseline_document_id":"rhp","baseline_page":85,
      "schedule":{"status":"disclosed","milestones":[{"due_date":"YYYY-MM-DD","planned_cumulative_inr":10,"evidence":{"document_id":"rhp","page":85}}]},
      "revisions":[],
      "reports":[{"quarter":"YYYY-Q1","filing_date":"YYYY-MM-DD","document_id":"monitor-q1",
        "utilisation":{"cumulative_used_inr":7,"unspent_inr":18,"evidence":{"document_id":"monitor-q1","page":3}},
        "deviation":{"status":"none_reported","note":""},"agency_comments":"","board_comments":""}]
    }
  ],
  "sellers":[],
  "document_changes":[]
}
```
All values/dates above are schema examples, not real IPO data. The actual `data/ipo_records.json` contains one initial Western Carriers example. Its baseline currently cites the final prospectus pending original RHP page-level cross-check.

## K3
Record seller name/type, shares offered, WACA, WACA basis, issue-price/WACA multiple where valid, caveats and evidence document/page.

## K4
Record field name, earlier and later values, document version/type on each side, both page references, relevant table/paragraph context and reviewer decision. Never infer the reason for a change.

## Units and missingness
Preserve original source units. Convert to ₹ crore only with an explicit conversion and retain source value/unit. Shares remain integer counts. Unknowns must use explicit missingness labels rather than zero.
