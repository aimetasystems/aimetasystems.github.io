# AIM Lab — Local Website Draft

Static website draft for **AIM Lab (A.I. integrated Metasystems Lab)**, Department of Optical System Engineering, Kumoh National Institute of Technology.

> Status: local draft only. This project has not been pushed to GitHub, and GitHub Pages has not been enabled.

## Run locally

The JSON-driven sections require a local HTTP server. From this directory:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

Stop with `Ctrl+C` in the same terminal.

## Structure

```text
.
├── index.html
├── research/index.html
├── members/index.html
├── publications/index.html
├── contact/index.html
├── assets/
│   ├── css/style.css
│   ├── js/main.js
│   ├── js/publications.js
│   ├── js/members.js
│   ├── js/news.js
│   ├── images/placeholders/
│   ├── logo/
│   └── favicon.svg
└── data/
    ├── publications.json
    ├── members.json
    └── news.json
```

## Editing content

- **Logo:** Put the approved PNG at `assets/logo/aim-lab-logo.png`. The header uses a text placeholder until that file exists.
- **Members:** Update `data/members.json`. Empty categories are not rendered; missing images fall back to a local SVG placeholder.
- **News:** Update `data/news.json`. The Home page automatically renders only the latest three valid dated entries.
- **Publications:** Update `data/publications.json`. The Home and Publications pages render items marked `featured: true` (up to three). All entries currently included are explicitly marked sample data and must be replaced with verified bibliographic data.
- **Contact details:** The site contact email is `jbnoh30@kumoh.ac.kr`. Confirm the official office and laboratory location before launch.

## Publication data policy

This draft deliberately does **not** include fabricated real publications. Actual Google Scholar and bibliographic data should be reviewed and approved before replacing the sample entries. Citation counts must include `lastUpdated`; no live Scholar crawling is performed by the site.

## Technical notes

- HTML, CSS, and vanilla JavaScript only; no external framework or library.
- Designed for GitHub Pages static hosting.
- No passwords, tokens, API keys, external image hotlinks, or form submission endpoint.
- Uses semantic landmarks, keyboard-accessible navigation, descriptive placeholder alt text, `loading="lazy"` on deferred images, and `prefers-reduced-motion` support.

## Before public deployment

1. Replace all sample and placeholder content.
2. Verify official URLs, address, room number, contact email, and map embed/location.
3. Verify publication metadata from Google Scholar plus publisher/Crossref sources, then choose three featured works.
4. Provide approved people photographs and research/publication visuals with appropriate permission.
5. Review page copy and accessibility with final assets in place.
