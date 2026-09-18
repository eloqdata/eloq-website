# SEO Indexing Inventory

This inventory documents the crawl/indexing intent for the EloqData website after the technical SEO cleanup in issue #48.

## Indexed

These surfaces should remain crawlable and eligible for indexing.

- `/` - EloqData homepage.
- `/product/eloqkv` - primary EloqKV product page.
- `/product/eloqsql`, `/product/eloqdoc`, `/product/eloqconvergeddb` - product pages for adjacent EloqData products.
- `/eloqkv/` - EloqKV documentation, including introduction, installation, quick start, compatibility, deployment, and operations pages.
- `/eloqsql/`, `/eloqdoc/`, `/eloqcloud/`, `/operator/` - product and operator documentation.
- `/blog/` - EloqData blog posts.
- `/news/` - EloqData news and announcements.
- `/post/` - citation-oriented long-form articles, including Redis vs EloqKV cost comparison content.
- `/costsaving` - EloqKV cost saving calculator.
- `/product-comparison` - EloqData edition comparison.
- `/pricing`, `/aboutus`, `/contact`, `/download`, `/downloadwhitepaper`, `/request-paper` - public business and conversion pages. (`/downloadeloqctl` is retired; eloqctl install docs now live at `/eloqkv/install-eloqctl`.)
- Future `/faq/` and `/compare/` routes once implemented by follow-up roadmap issues.

## Noindexed

These pages should remain reachable for users but should not be indexed.

- `/contact/submitted` - form confirmation page.
- `/request-paper/submitted` - form confirmation page.
- `/cloud-stay-tuned` - temporary cloud availability notice.
- `/status` - client-side connectivity display, not an authoritative service status record.
- All deployment previews (`PREVIEW_DEPLOY=true` or `VERCEL_ENV=preview`) receive site-wide `noindex, nofollow` metadata and no sitemap.

## Removed

These pages and assets were obsolete sample or legacy surfaces and should not be emitted in the built site or sitemap.

- `/enlarge_pic` - an imported image helper, excluded from the pages plugin while remaining available to articles.
- Eleven empty EloqSQL legacy Markdown placeholders, explicitly listed in the docs plugin's `exclude` option. Enable each route only after writing its documentation.

- Legacy default Docusaurus `/docs` MonoSQL section.
- Docusaurus sample markdown page and sample blog posts from 2019 and 2021.
- React Native sample landing page, redirects, sidebars, showcase assets, static docs assets, and sample blog assets.
- Docusaurus sample images such as `docusaurus.png`, `docusaurus-social-card.jpg`, and `undraw_docusaurus_*`.

## Sitemap and Robots Rules

- Canonical URLs and sitemap entries should use `https://www.eloqdata.com`.
- `robots.txt` allows EloqKV growth surfaces and blocks admin, API, internal, and query-string URLs.
- Confirmation and utility pages are guarded by page-level `noindex` metadata and sitemap exclusion patterns.
- Working content in `content/` is outside Docusaurus's published collections. Drafts cannot enter the production sitemap or feeds through the daily generation job.
- `content-index.json` and the built `llms.txt` are generated from published collection metadata. They help tools discover canonical content; they do not guarantee search indexing or AI citations.

## Operating documents and checks

- [SEO/GEO framework](docs/SEO_GEO_FRAMEWORK.md): positioning, content clusters, ownership, 90-day rollout and measurement.
- [Content workflow](docs/CONTENT_WORKFLOW.md): daily drafting, refresh, review and publication.
- Run `npm run build` followed by `npm run seo:audit` and `npm run test:structured-data:build` to check rendered output. The audit writes `build/seo-audit.json`; existing documentation descriptions are reported separately as warnings.
- For a preview build, use `PREVIEW_DEPLOY=true npm run build -- --out-dir build-preview`, then `npm run seo:audit -- build-preview --preview`.
