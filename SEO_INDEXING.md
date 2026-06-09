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
- `/pricing`, `/aboutus`, `/contact`, `/download`, `/downloadeloqctl`, `/downloadwhitepaper`, `/request-paper` - public business and conversion pages.
- Future `/faq/` and `/compare/` routes once implemented by follow-up roadmap issues.

## Noindexed

These pages should remain reachable for users but should not be indexed.

- `/contact/submitted` - form confirmation page.
- `/request-paper/submitted` - form confirmation page.

## Removed

These pages and assets were obsolete sample or legacy surfaces and should not be emitted in the built site or sitemap.

- Legacy default Docusaurus `/docs` MonoSQL section.
- Docusaurus sample markdown page and sample blog posts from 2019 and 2021.
- React Native sample landing page, redirects, sidebars, showcase assets, static docs assets, and sample blog assets.
- Docusaurus sample images such as `docusaurus.png`, `docusaurus-social-card.jpg`, and `undraw_docusaurus_*`.

## Sitemap and Robots Rules

- Canonical URLs and sitemap entries should use `https://www.eloqdata.com`.
- `robots.txt` allows EloqKV growth surfaces and blocks admin, API, internal, and query-string URLs.
- Submitted confirmation pages are guarded by both page-level `noindex` metadata and sitemap exclusion patterns.
