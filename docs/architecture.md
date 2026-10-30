# Architecture overview

## Runtime

IPO Lab is a static website. The browser loads the page shell, styles and JavaScript, then fetches published JSON datasets from the same origin. A local HTTP server is required for development; opening the HTML file directly blocks data fetches in modern browsers.

## Main modules

| File | Responsibility |
|---|---|
| `index.html` | Navigation, page sections, forms and accessible structure |
| `styles.css` | Responsive layout, dark-first design system and theme variants |
| `app.js` | Data loading, rendering, filters, simulators and interactions |
| `data/academy.json` | Learning content and knowledge checks |
| `data/ipo_records.json` | Source-linked issuer records |
| `data/cases.json` | Published issuer research examples |
| `data/source_registry.json` | Official sources and access notes |
| `data/regulatory_policy.json` | Educational market-data controls |
| `scripts/validate_data.py` | Evidence and numerical consistency checks |
| `tests/test_project.py` | Automated regression and data-quality tests |

## Data flow

`Browser → app.js → JSON datasets → rendered UI`

The validator runs in development and CI. GitHub Actions blocks deployment if the dataset validator or automated tests fail.

## Deployment

The workflow creates a dedicated `_site` directory containing only website assets and JSON files required by the browser. Development documentation, tests and validation scripts remain in the source repository but are not copied into the deployed Pages artifact.

## Design and accessibility

The visual system uses a midnight background, violet and cyan highlights, high-contrast text and restrained glow. The theme toggle supports a light variant. Keyboard focus, clear labels, small-screen layout and reduced-motion behaviour should be included in release testing.
