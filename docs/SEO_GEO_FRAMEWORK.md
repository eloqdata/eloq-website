# EloqData SEO and AI discovery framework

Owner: marketing, with engineering review. Confirmed first-90-day audience: developers evaluating Redis alternatives and EloqKV. Validate topic priorities against pipeline and Search Console data in week one. This is an operating plan, not a claim that rankings, citations, or leads are already improving.

## Business objective and positioning

Attract engineers with a real database evaluation problem and help them progress from evidence to a reproducible test to a conversation. Use EloqKV's Redis-compatible interface and NVMe-backed architecture as the first acquisition focus. EloqDoc, EloqSQL, and the broader Data Substrate architecture remain supporting topics with their own product and documentation destinations.

SEO covers discovery in conventional search. GEO here covers discovery, understanding, and citation by AI answer engines and agents. The shared foundation is publicly accessible HTML, clear entities and URLs, useful answers, attributable evidence, and understandable limitations. Google's [AI search guidance](https://developers.google.com/search/docs/appearance/ai-features) says normal SEO practices apply and special AI markup is not required. `llms.txt` and the generated content index are convenience resources for tools; they are not ranking signals or guarantees of inclusion.

## The framework

| Layer | Implementation and editorial practice | Success check |
| --- | --- | --- |
| Discovery | Production canonical URLs, sitemap, crawlable HTML, archive/topic links, RSS, preview noindex | Priority pages pass the rendered SEO audit; inspect indexing in webmaster tools |
| Understanding | Article schema, accurate bylines and dates, breadcrumbs, concise summaries, consistent product names | Markup matches visible content; no duplicate article entities |
| Evidence | Link claims to documentation, benchmark methods and dated pricing assumptions | Engineering reviewer can reproduce or qualify each material claim |
| Content | One page per intent; answer first, then prerequisites, steps, tradeoffs and next action | Relevant query coverage without competing near-duplicate pages |
| Conversion | Route readers to installation, compatibility checks, calculator, or contact according to intent | Qualified evaluation starts and inquiries by landing page |
| Operations | Versioned briefs, daily draft/refresh job, review, validation, normal deployment | Traceable changes, stable URLs, and manageable review backlog |
| Measurement | Search Console, Bing Webmaster Tools, existing GA4, repeatable AI citation sampling | Weekly evidence of visibility, qualified engagement and pipeline |

## Content ownership and site structure

Keep current URLs. `/blog` is engineering explanation, experiments, and practitioner perspectives. `/post` is evergreen evaluation and decision guidance. `/news` is dated, verifiable releases, events, partnerships, or company announcements. Do not generate company news unless an approved event or release source exists. Documentation remains the authoritative location for supported commands and operational instructions.

Every new page should have a unique title and intent, a useful description, an accountable author, a publication date, a stable slug, a small set of relevant topics, a short direct answer, and a next step. Use a real share image when available; the existing brand image is an acceptable fallback. Summaries and key takeaways must appear on the page. Use `last_update.date` only for a substantive reviewed update, while retaining the original publication date and URL.

Store working drafts and review evidence outside the published collections. Existing historical content can be improved incrementally; it does not need artificial date changes or a bulk rewrite.

## Priority search and answer clusters

These are hypotheses based on the product and repository, not paid keyword-volume research. Confirm language and priority using sales calls and query data.

| Intent / example question | Destination / supporting content | Evidence and next step |
| --- | --- | --- |
| Evaluation: “Redis alternative for a dataset larger than RAM” | EloqKV product page; decision guide covering compatibility, storage and operational constraints | Command support and workload fit → install and test |
| Economics: “How do Redis and EloqKV costs compare?” | Existing `/post/redis-vs-eloqkv-cost-breakdown-at-scale`; calculator explainer | Dated region, instance, durability, replica and pricing assumptions → calculator or sizing conversation |
| Migration: “How do I migrate Redis to EloqKV?” | Existing April 2026 migration guide; compatibility and rollback checklist | Supported commands, version constraints, verification and cutover risks → compatibility docs |
| Performance: “Can NVMe serve Redis workloads?” | Existing EloqStore benchmarks; benchmark reproduction guide | Hardware, dataset, workload distribution, tail latency, persistence and client setup → reproduce a benchmark |
| Operations: “How do I run durable EloqKV?” | Durability, recovery, deployment and scaling documentation; operational walkthroughs | Version-specific behavior and tested failure procedures → deployment docs |
| Architecture: “When should compute and storage scale separately?” | Data Substrate series and multi-model product pages | Explain tradeoffs and when the architecture is unsuitable → relevant product/docs |

Refresh the cost and migration pages early: their broad savings and zero-downtime language needs engineering verification and explicit assumptions. Do not promote a specific savings percentage or latency number as a universal product property. Link to the experiment and its conditions whenever reusing a result.

## Daily and weekly operating rhythm

Confirmed publishing policy: generate daily drafts for team review. The automation cannot publish directly.

The daily automation selects an approved brief or refresh candidate and prepares one reviewable draft. Run this every day; publication depends on having a useful, checked contribution. The queue intentionally stops when briefs or review capacity run out. Google's [generative content guidance](https://developers.google.com/search/docs/fundamentals/using-gen-ai-content) emphasizes accuracy and added value; producing large numbers of low-value pages can violate its spam policy.

Suggested weekly mix: Monday migration/help content, Tuesday existing-page refresh, Wednesday architecture explanation, Thursday benchmark or technical FAQ, Friday evaluation/use-case guidance. Weekend runs may prepare drafts for Monday; publish news only when a real announcement exists. Start with two or three substantial publications per week and use remaining runs to improve existing pages. Increase only when engineering review and reader value support it.

Marketing owns intent, briefs, linking and conversion paths. A product engineer owns correctness of commands, benchmark interpretation, compatibility and product availability. The release owner merges the reviewed publication change using the existing deployment process. The AI service is a drafting assistant, not the source of product truth.

See [CONTENT_WORKFLOW.md](CONTENT_WORKFLOW.md) for commands, setup, review, and publishing. The workflow uses selected repository sources rather than unsupervised trend scraping. A dated external-source excerpt must be verified and added to the brief when a topic requires current external facts.

## First 90 days

| Period | Deliverables | Exit criteria |
| --- | --- | --- |
| Days 1–14 | Deploy technical changes; verify Google/Bing ownership and sitemap; configure draft automation; baseline traffic and conversions; review top cost/migration claims | Priority pages are crawlable; daily draft job runs once; one editor can publish a reviewed article |
| Days 15–30 | Refresh the three highest-intent existing pages; publish migration/benchmark reproduction guides; link supporting pages to product and docs | Each page has evidence, an owner and a measurable next step; no competing pages for the same intent |
| Days 31–60 | Expand the best-performing cluster; publish one original engineering experiment; improve pages with impressions but weak engagement | Cluster-level data informs briefs; experiment has reproducible methods |
| Days 61–90 | Review assisted pipeline, query coverage and citation samples; consolidate weak duplicates; broaden to another product if demand supports it | Document which topics bring qualified evaluations; fund the next quarter using measured outcomes |

## Measurement without vanity scores

Use [seo-measurement-template.csv](seo-measurement-template.csv) for the weekly record. Establish the first 28 days as a baseline before setting growth targets. Business KPIs are qualified demo/contact submissions and database evaluation starts; search impressions and citations are diagnostic signals. Confirm the existing GA4 property (`G-1321W6Q1MZ`) belongs to the intended production account before changing tracking.

Record non-brand clicks and impressions by cluster, indexed priority URLs, organic landing-page engagement, successful download/evaluation actions, and qualified inquiries. Track form success rather than submit-button clicks. Attribute first-touch and assisted conversions separately where the analytics setup supports it. Do not assume a download is a qualified lead.

For AI discovery, keep a fixed sample of approximately 20 buyer questions covering the clusters above. Weekly, record the engine, model/mode when shown, date, locale, exact prompt, cited URLs, product accuracy, and whether an answer was returned. Run clean sessions and retain the evidence. Citation observations vary by context and cannot be treated as a population-wide ranking. AI referrals are an incomplete proxy because many answers do not generate a click. Google reports AI-feature traffic within its overall Search reporting; do not label all organic traffic as AI traffic.

Suggested operational targets: all priority URLs pass the build audit; every new factual comparison cites its evidence; every publication has one accountable reviewer; no fabricated fresh dates; one business-oriented performance review each week. Set traffic and pipeline targets after baseline measurement, not from invented forecasts.

## Resources needed to operate

1. A repository administrator to enable GitHub Actions PR creation, configure the model/API secret and budget, and enable the daily job. Store credentials in GitHub secrets, never in articles or chat.
2. A content owner and an engineering reviewer, initially about two hours each per week; adjust after observing draft volume and review time.
3. Read access to Google Search Console, Bing Webmaster Tools, GA4 and relevant conversion reporting to establish baselines and validate results.
4. Approved product facts, benchmark methods, release notes, support boundaries and customer permissions for stories. Real customer examples and original experiments will make stronger content than extra automated volume.
5. The deployment owner to release these changes and verify production headers/CDN access. A local build cannot prove that production firewalls permit search crawlers.

No paid SEO platform or external CMS is necessary to start. Add keyword research tooling or a browser editor only if the team's workflow and observed gaps justify it.
