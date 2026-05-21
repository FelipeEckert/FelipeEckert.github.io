# Felipe Arthur Eckert | Portfolio

Modern React/Vite portfolio for Felipe Arthur Eckert, focused on Data Analytics,
Automation Engineering, Python tooling, and automotive data.

## Repository Type

This workspace was empty and not initialized as a git repository, so it has been
set up as a portfolio site. It now uses React with Vite for a more maintainable
component structure and lightweight interactivity.

## What Is Included

- `src/App.jsx`: portfolio sections, React components, project filtering,
  timeline, contact links, and animated vehicle-data hero canvas.
- `src/styles.css`: responsive visual system with clean spacing, cards, and a
  dark, professional data/automation look.
- `index.html`: Vite entry point.
- `vite.config.js`: Vite React configuration.
- `.github/workflows/deploy-pages.yml`: GitHub Pages deployment workflow.

## Local Preview

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Then visit:

```text
http://127.0.0.1:5173
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Publishing With GitHub Pages

This repository includes a GitHub Actions workflow that builds the Vite app and
publishes the `dist` folder to GitHub Pages.

1. Push the branch to GitHub.
2. Open a pull request and merge only after review.
3. In the repository settings, enable GitHub Pages with **GitHub Actions** as the
   source.
4. Push or merge into `main` to trigger the deployment workflow.

## Personal Links To Add

Email and LinkedIn are configured in `src/App.jsx`. The GitHub profile URL and
resume file are intentionally left empty until the real public links/files are
available.

## Electron Note

Electron is intentionally not included in the portfolio homepage. It is better
suited for a separate desktop dashboard or internal analytics tool, while this
repository should stay optimized for fast web publishing and recruiter review.
