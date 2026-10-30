# IPO Reality Lab — Neon Night design system

## Direction

Dark-first, energetic fintech UI for a younger retail-investor audience. The visual identity uses deep midnight surfaces and a limited set of vivid accents. Glow is reserved for primary actions, focus states and decorative emphasis; tables and source references remain high-contrast and quiet.

## Core palette

| Token | Hex | Purpose |
|---|---|---|
| Midnight background | `#080A16` | Page background |
| Panel surface | `#12172B` | Cards and research panels |
| Elevated surface | `#1A2038` | Inputs, quiz choices and data cells |
| Electric violet | `#A78BFA` | Primary brand/action accent |
| Neon cyan | `#22D3EE` | Secondary accent and evidence links |
| Hot pink | `#F472B6` | OFS / seller emphasis and warning accents |
| Lime | `#BEF264` | Positive simulator/status emphasis |
| Main text | `#F3F5FF` | Headings and primary labels |
| Muted text | `#A0A9C2` | Explanatory text and metadata |

## Data semantics

- Fresh issue / proceeds to company: cyan and violet.
- OFS / proceeds to selling shareholders: pink.
- Evidence links and source references: cyan.
- Needs review / caution: pink or neutral warning surface; never rely on colour alone.
- Positive simulator values: lime / cyan, with labels and values still written in text.

## Interaction

- Dark mode is the default on first visit. The theme control switches to the light theme and remembers the user's choice in local browser storage.
- Focus outlines remain visible for keyboard navigation.
- Reduced-motion preference disables transitions and smooth scrolling.
- Cards use subtle lift and border emphasis, not constant pulsing animations.
- Financial tables retain readable text and visible row boundaries; no glow is applied to dense numeric content.

## Design restraint

The intention is “premium night-mode fintech with neon accents”, not a gaming dashboard. Avoid full-screen gradients, animated backgrounds, flashing text or rainbow charts. Keep the primary data hierarchy and source traceability more prominent than decoration.
