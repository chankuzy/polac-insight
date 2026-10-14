# POLAC Insight

A polished React + TypeScript prototype for the research proposal **“Effectiveness of Social Media Usage on the Academic Performance of POLAC Cadets.”**

## Features
- Overview dashboard with key statistics, platform mix, and scatter plot.
- Cadet record management (create, search, edit, delete).
- Questionnaire data-entry form with validation.
- Pearson correlation analysis and a plain-language interpretation.
- Reports and CSV import/export.
- Local persistence with browser `localStorage`.
- Responsive desktop/mobile layout.

## Run locally
Requirements: Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Open the local URL Vite prints in your terminal.

For a production build:
```bash
npm run build
npm run preview
```

## Local data
The app uses `localStorage` only; it does not require a backend or transmit records anywhere. Use **Export CSV** to back up data before clearing browser data or changing browsers/devices. Records remain local to the browser profile.

Demo records are illustrative only and are not real POLAC data. Choose anonymized research IDs for actual research data.

## CSV format
Headers: `id,name,level,platform,hours,cgpa,purpose,notes`

Example:
```csv
id,name,level,platform,hours,cgpa,purpose,notes
POL-001,Cadet 001,100,WhatsApp,2.5,3.75,Academic,
POL-002,Cadet 002,200,Instagram,4,2.9,Entertainment,
```

## Research notes
- Pearson's r describes linear association, not causation.
- The prototype does not calculate p-values or statistical significance.
- CGPA validation assumes a 5.00 scale; change validation if your institution uses a different approved scale.
- Real deployment should add authentication, authorization, secure backups, and institutional approval before handling identifiable or sensitive records.
