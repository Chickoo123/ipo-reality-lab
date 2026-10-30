# Contributing

Thank you for helping improve IPO Lab.

## Before proposing changes

- Read the research methodology and source-access safeguards.
- Do not add issuer figures from memory, social media or an unverified secondary source.
- Do not add API credentials, personal financial information or private working documents.
- Keep educational examples clearly marked as hypothetical.

## Data contributions

For every material issuer figure, include the original document, filing date, source URL, printed page, source unit and review date. Preserve the original offer-document allocation and record revisions separately. A reviewer must resolve extraction mismatches against the source document.

## Code contributions

Run the following before committing:

```bash
python scripts/validate_data.py
python -m pytest -q
node --check app.js
```

Keep changes focused, accessible and mobile-friendly. Do not describe a manual source link as a live API integration.

## Pull requests

Describe the user-visible change, files affected, tests run and any data / regulatory implications. Include screenshots for UI changes where practical.
