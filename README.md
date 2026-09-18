# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Content and growth operations

- [SEO/GEO framework](docs/SEO_GEO_FRAMEWORK.md): strategy, content priorities, 90-day rollout, measurement, and ownership.
- [Publishing workflow](docs/CONTENT_WORKFLOW.md): create or refresh a draft, review it, publish locally, and configure daily automation.
- [Indexing policy](SEO_INDEXING.md): public pages, preview protection, and machine discovery.

```bash
npm run content:plan
npm run content -- help
npm run test:content
npm run test:editorial-seo
npm run build
npm run test:structured-data:build
npm run seo:audit
```

Blog posts live in `blog/`, company news in `newsposts/`, and evergreen articles in `posts/`. Working briefs and drafts live in `content/` and are not published by the website build. The daily job produces a review PR; publishing uses the normal website merge and deployment process. No external CMS is required.

## Installation

```bash
yarn
```

## Local Development

```bash
yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

Using SSH:

```bash
USE_SSH=true yarn deploy
```

Not using SSH:

```bash
GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
