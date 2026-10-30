# Research data model

The core relationship is:

`Issuer → Offer document → Object of issue → Reporting period → Utilisation → Evidence`

Related records capture selling shareholders and visible changes between document versions.

## Illustrative issuer record

```json
{
  "id": "issuer-ipo-year",
  "company_name": "Exact issuer legal name",
  "board": "mainboard",
  "issue_status": "listed",
  "last_checked": "YYYY-MM-DD",
  "documents": [
    {
      "id": "rhp",
      "type": "RHP",
      "date": "YYYY-MM-DD",
      "url": "https://official-source",
      "source_id": "SEBI",
      "title": "Exact document title"
    }
  ],
  "objects_of_issue": [
    {
      "id": "capex",
      "name": "Exact wording from the offer document",
      "baseline_allocation_inr": 25,
      "baseline_document_id": "rhp",
      "baseline_page": 85,
      "schedule": {"status": "not_disclosed", "milestones": []},
      "revisions": [],
      "reports": []
    }
  ],
  "sellers": [],
  "document_changes": []
}
```

All values above are schema examples, not real issuer data.

## Evidence

Each material figure should link to document ID, printed page, filing date, source institution and URL, source unit, conversion method where applicable, and review date.

## Utilisation

Keep the original offer-document allocation immutable. Store each reporting period separately with cumulative utilisation, unspent balance, deviation wording, agency comments, board comments and evidence. A decrease in cumulative utilisation requires a documented explanation and supporting revision.

## Selling shareholders

Capture seller name and type, shares offered, disclosed weighted-average acquisition cost, calculation basis and caveats. Derived ratios must be labelled as calculations, not issuer-disclosed valuation measures.

## Document comparison

Store the field compared, earlier and later document types, values, exact page references and reviewer notes. Record visible differences only; do not infer why a disclosure changed.

## Units and missingness

Preserve source units. Convert to ₹ crore only with an explicit conversion and retain the original value. Shares remain integer counts. Unknown information uses explicit missingness states rather than zero.
