# SEOCHO Website (tteon.github.io)

This repository hosts the official documentation and landing page for the [SEOCHO](https://github.com/tteon/seocho) project.

## Tech Stack
- **Framework**: [Astro](https://astro.build)
- **Docs Theme**: [Starlight](https://starlight.astro.build)
- **Styling**: Tailwind CSS + Custom Dark Theme
- **Deployment**: Automatic via GitHub Actions to GitHub Pages.

> **Note**: This repository is the *target* of an automated sync process.
> Do **NOT** edit documentation files (`src/content/docs/*`) directly in this repository if they originate from the main `seocho` repo. Changes should be made to `seocho/docs` and pushed there, which will trigger an Action to copy them here.

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```
