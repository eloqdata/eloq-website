# EloqData editorial workflow

Confirmed operating policy: daily drafts for team review, focused on developers evaluating Redis alternatives and EloqKV. Publishing follows human review and the normal website merge process.

The repository is the editorial system of record. A brief selects a real customer question and evidence; a draft records its sources and claims; a named reviewer checks the final article; the publish command places it in the correct Docusaurus collection. Every command operates locally except AI generation and the optional GitHub workflow. Deployment continues through the website's normal Git review and hosting process.

## Start without an API key

Use Node 22 and the repository's locked dependencies:

```sh
yarn install --frozen-lockfile
npm run content:plan
npm run content -- scaffold --brief content/briefs/01-redis-compatibility-checklist.json
```

Edit `content/drafts/redis-compatibility-checklist/index.md`. Complete the description, opening answer, key takeaways, citations, and body. The scaffold is intentionally unfinished and fails validation until its placeholders are resolved. Add a small evidence ledger to `claims.json`:

```json
[
  {
    "claim": "The exact product statement supported by this evidence.",
    "source_url": "https://www.eloqdata.com/eloqkv/client_compatibility",
    "evidence": "A short, exact excerpt from the selected source file."
  }
]
```

The example strings above are placeholders; replace them with real claims and verbatim evidence. Check the full article against the source material, including statements beyond this ledger. Automated validation checks structure and evidence matching; it cannot prove that all prose is factual.

```sh
npm run content:validate
npm run content -- review --draft content/drafts/redis-compatibility-checklist --reviewer "Your name" --notes "Checked command support, citations, and application limitations against current docs."
npm run content -- publish --draft content/drafts/redis-compatibility-checklist
npm run build
npm run seo:audit
```

Review is an explicit human attestation. It records `reviewed_by` and `last_reviewed`, plus a hash of the approved article, brief, source manifest, and claim ledger. Changing any of those files requires another review. `publish` writes local website files; it does not push, merge, or deploy. Preview the article, inspect the diff, and submit or update a normal website PR.

## Choose the destination once

| Brief collection | Published directory | Public route |
| --- | --- | --- |
| `blog` | `blog/YYYY-MM-DD-slug/index.md` | `/blog/YYYY/MM/DD/slug` |
| `news` | `newsposts/YYYY-MM-DD-slug/index.md` | `/news/YYYY/MM/DD/slug` |
| `article` | `posts/slug/index.md` | `/post/slug` |

All drafts live under `content/drafts/`, outside Docusaurus's published collections. The filename and `draft: true` provide separate protection. News is for verified announcements and dated events; daily automation does not invent company news. Evergreen answer articles belong in `article`; technical explanations and engineering stories belong in `blog`.

New articles use `/img/logo-og.png` as the branded sharing-image fallback. Set `image` in the brief to a reviewed static `/img/` asset or public HTTPS image for a topic-specific visual. Refreshes keep the original image and sibling assets.

For a new topic, copy a JSON brief in `content/briefs/`, give it a unique `id` and `slug`, and set `title`, `audience`, `question`, `collection`, `tags`, `internal_links`, and `sources`. The three starter briefs are unapproved examples. Set `approved: true` only after a product expert confirms that the question and evidence are useful. Briefs run in filename order; use numeric prefixes for editorial priority. Keep the queue replenished with unique questions, not keyword variations of existing answers.

Each source requires a `path`, `title`, and public HTTPS `url`. Allowed source directories are `eloqkv`, `eloqdoc`, `eloqsql`, `eloqcloud`, `operator`, `blog`, `newsposts`, `posts`, and `content/sources`. For outside sources, save a concise, verified excerpt in `content/sources/` and link its original URL. URLs are citations, not requests to crawl a page. Review source freshness yourself; a historical article does not establish today's price or product capabilities. Only explicitly selected source files and the article being refreshed are sent for generation; each file is limited to 60 KB and the selected source total to 160 KB. Never select confidential material.

## Optional AI assistance

Set `OPENAI_API_KEY` and `OPENAI_CONTENT_MODEL` in your shell or secret manager. Do not commit credentials. The tool deliberately has no implicit model default: choose an available model that supports the Responses API and Structured Outputs, then set a project spending limit appropriate for the editorial budget.

```sh
export OPENAI_CONTENT_MODEL='your-approved-model-id'
# Supply OPENAI_API_KEY using your secret manager or local shell environment.
npm run content -- generate --brief content/briefs/01-redis-compatibility-checklist.json
```

Generation makes one request to `https://api.openai.com/v1/responses`, uses Structured Outputs, requests `store: false`, caps output at 6,500 tokens, and times out after two minutes. It performs no browsing or automatic retries. An unavailable model, incomplete response, refusal, unmatched source quote, or failed article validation stops without writing a draft. The official [Structured Outputs documentation](https://developers.openai.com/api/docs/guides/structured-outputs) describes the response format. `store: false` disables response storage; it is not a promise of zero data retention.

The output includes a source manifest with file hashes, a claim ledger, generator review notes, and usage metadata. The prompt prohibits fabricated customer claims, benchmarks, prices, certification, and unsupported product assertions. An engineer still verifies them before publishing. Existing files are never overwritten by generation: edit the draft directly, or create a new brief id when you need to generate a replacement. The tool has been tested with mocked API responses; configure credentials and perform a reviewed pilot before enabling the daily schedule.

## Refresh existing content

Use a brief with `operation: "refresh"` and `article` set to the existing `index.md` or `index.mdx`, as shown in `03-refresh-eloqkv-storage-explainer.json`. Select evidence that can support the intended update. Use `refresh` for AI assistance or `scaffold` for an offline rewrite:

```sh
npm run content -- refresh --brief content/briefs/03-refresh-eloqkv-storage-explainer.json
```

The original stays untouched until review and publish. Refresh keeps the original publication date, directory, custom slug, and image metadata. It sets `last_update` only when the reviewed update is published. Existing sibling assets remain in place. Imported `metadata.json` keeps its identity and publication date, receives the new title, description, and update date, and drops stale precomputed structured data so current schema can be generated from frontmatter.

If the original article or its imported metadata changes during review, publish stops to protect the concurrent edit. If selected source files change, validation stops: make a new brief id and regenerate against the new evidence. Retire an obsolete draft by removing its unpublished draft directory in a reviewed change; keep published manifests as the editorial audit trail. Refreshes should correct, clarify, or add substantive evidence. Do not manufacture freshness by changing dates alone.

## Enable daily drafts in GitHub

Configure these repository settings after a reviewed pilot:

| Setting | Location | Purpose |
| --- | --- | --- |
| `OPENAI_API_KEY` | Actions secret | Project API key used only by the generation step |
| `OPENAI_CONTENT_MODEL` | Actions variable | Explicit available model ID |
| `CONTENT_AUTOMATION_ENABLED=true` | Actions variable | Enables the daily job |
| Allow GitHub Actions to create pull requests | Actions repository permissions | Lets the bot open a draft PR |

Approve selected briefs in `content/briefs/`. Assign a marketing editor and an engineer who can review claims. The workflow runs at 14:23 UTC daily and supports manual dispatch. It checks credentials, the JSON queue, unpublished drafts, and outstanding automation PRs before installing dependencies or generating. It selects at most one approved, unused brief, and pauses when an unpublished draft exists. A single draft branch per UTC day prevents rerun duplicates. Closing a draft PR discards that day's queue attempt; a later day can retry the still-unused brief. If a push succeeds but PR creation fails, open a PR from the existing branch before rerunning.

The bot commits **only `content/drafts/`** to a new `automation/content-YYYY-MM-DD` branch and opens a **draft PR**. It never publishes, pushes to the production branch, or changes an existing public article. On that PR branch, a human edits, reviews, and runs `publish`, then pushes the public-file diff for the normal site preview and merge process. Merging a draft-only PR stores editorial work but does not publish it; the schedule pauses until that draft is published or removed.

GitHub's default workflow token may not trigger downstream PR workflows for a bot-created PR. Run `Content and SEO checks` manually against the draft branch or push the reviewed changes as a human before merging. No API secret is used in PR validation. Keep branch protection and hosting preview checks required for publication.

Daily means a daily opportunity to create or refresh useful content, not a requirement to publish an article regardless of evidence. Review quality, uniqueness, and source readiness determine the publishing cadence. To stop generation, set `CONTENT_AUTOMATION_ENABLED=false`.

## Checks and limits

`npm run test:content` tests publishing destinations, review invalidation, refresh URL/date preservation, concurrent edits, selected evidence, duplicate prevention, path traversal, symlinks, and API failure handling without network access. `content:validate` checks pending drafts only; historical published content remains subject to the full production build and SEO audits. Review notes are private to the repository, while approved metadata and cited sources are visible on the public article.

This is a Git-based editorial workflow. It does not provide a browser CMS, automatically verify every factual claim, fetch live external sources, create images, configure search-engine accounts, or deploy content. Those integrations can be added after the first editorial cycle establishes the team's ownership and publishing needs.
