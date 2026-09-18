import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {createDraft, generateResponse, loadSources, markdown, parseMarkdown, plan, publishDraft, reviewDraft, safePath, validateArticle, validateBrief, validateDraft} from './lib.mjs';

const sourceText = 'EloqKV supports Redis clients. Check command compatibility before migrating a workload.';
const source = {title: 'Client compatibility', path: 'eloqkv/compatibility.md', url: 'https://www.eloqdata.com/eloqkv/compatibility'};
const makeBrief = overrides => ({id: 'client-guide', slug: 'client-guide', operation: 'create', collection: 'blog', title: 'Evaluate client compatibility', audience: 'Database engineers', question: 'How should engineers evaluate clients?', approved: true, sources: [source], ...overrides});
const paragraph = 'Evaluate the commands used by the application and record their expected behavior before moving a production workload. A compatibility check should cover normal requests, error handling, reconnect behavior, timeouts, and the operational assumptions of the existing deployment. Run representative application tests and inspect the results with an engineer who understands the workload. Document any gaps instead of assuming that every supported client provides every feature needed by an application.';
const generated = {
  title: 'Evaluate Redis client compatibility',
  description: 'Learn how to evaluate Redis client behavior, command requirements, and application tests before planning an EloqKV migration.',
  summary: 'Check client behavior and required commands before planning a migration.',
  key_takeaways: ['Check the required commands.', 'Validate representative application behavior.'],
  body: `Check client behavior before migrating. [Compatibility source](${source.url}).\n\n<!-- truncate -->\n\n## Prepare a useful evaluation\n\n${paragraph}\n\n## Test your workload\n\n${paragraph}\n\n## Understand limitations\n\n${paragraph}\n\nRead the [product documentation](/eloqkv/introduction).`,
  claims: [{claim: 'EloqKV supports Redis clients.', source_url: source.url, evidence: 'EloqKV supports Redis clients.'}],
  review_notes: ['Validate the exact application command set.'],
};

async function fixture(t) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'eloq-content-test-'));
  t.after(() => fs.rm(root, {recursive: true, force: true}));
  for (const directory of ['eloqkv', 'blog', 'newsposts', 'posts', 'content/briefs', 'content/drafts']) await fs.mkdir(path.join(root, directory), {recursive: true});
  await fs.writeFile(path.join(root, source.path), sourceText);
  await fs.writeFile(path.join(root, 'content/briefs/01-guide.json'), JSON.stringify(makeBrief()));
  return root;
}
const mockedResponse = value => async () => ({ok: true, json: async () => ({status: 'completed', id: 'response-test', output: [{type: 'message', content: [{type: 'output_text', text: JSON.stringify(value)}]}]})});
async function draft(root, brief = makeBrief()) {
  return createDraft(root, brief, {ai: true, apiKey: 'test-not-a-real-key', model: 'configured-model', fetchImpl: mockedResponse(generated), date: '2026-09-17'});
}

test('offline scaffold creates isolated, unpublished files and exposes placeholders', async t => {
  const root = await fixture(t);
  const result = await createDraft(root, makeBrief(), {date: '2026-09-17'});
  assert.equal(result.target, 'blog/2026-09-17-client-guide/index.md');
  assert.deepEqual(await fs.readdir(path.join(root, 'blog')), []);
  const checked = await validateDraft(root, result.draft);
  assert.ok(checked.errors.some(error => /placeholders/.test(error)));
  assert.ok(checked.errors.some(error => /checked claim/.test(error)));
  await assert.rejects(() => publishDraft(root, result.draft), /180 words|placeholders/);
});

test('reviewed generation publishes into each collection without a draft flag', async t => {
  for (const collection of ['blog', 'news', 'article']) {
    const root = await fixture(t);
    const result = await draft(root, makeBrief({collection}));
    await assert.rejects(() => publishDraft(root, result.draft), /Run review/);
    await reviewDraft(root, result.draft, 'Product reviewer', 'Checked claims and workload limitations.', '2026-09-17');
    const publication = await publishDraft(root, result.draft, '2026-09-17');
    const {data} = parseMarkdown(await fs.readFile(path.join(root, publication.target), 'utf8'));
    assert.equal(data.draft, undefined);
    assert.equal(data.reviewed_by, 'Product reviewer');
    assert.equal(data.date, '2026-09-17');
    if (collection === 'article') assert.equal(publication.target, 'posts/client-guide/index.md');
    await assert.rejects(() => publishDraft(root, result.draft), /Run review/);
  }
});

test('editing content or evidence after review invalidates approval', async t => {
  const root = await fixture(t);
  const result = await draft(root);
  await reviewDraft(root, result.draft, 'Engineer', 'Reviewed.', '2026-09-17');
  await fs.appendFile(path.join(root, result.draft, 'index.md'), '\nAn added sentence.\n');
  await assert.rejects(() => publishDraft(root, result.draft), /changed after review/);
  await reviewDraft(root, result.draft, 'Engineer', 'Reviewed the added sentence.', '2026-09-17');
  await fs.appendFile(path.join(root, result.draft, 'claims.json'), '\n');
  await assert.rejects(() => publishDraft(root, result.draft), /changed after review/);
});

test('refresh retains original date and custom slug, updates modification date, and preserves assets', async t => {
  const root = await fixture(t);
  const article = 'blog/2025-04-01-original/index.md';
  const directory = path.dirname(path.join(root, article));
  await fs.mkdir(directory);
  await fs.writeFile(path.join(directory, 'chart.png'), 'existing asset');
  await fs.writeFile(path.join(root, article), markdown({title: 'Old article', date: '2025-04-01', slug: 'keep-this-url', image: './chart.png'}, 'Old content.'));
  await fs.writeFile(path.join(directory, 'metadata.json'), JSON.stringify({id: 'keep', published_at: '2025-04-01T00:00:00Z', structured_data: {name: 'Old article'}}));
  const result = await draft(root, makeBrief({operation: 'refresh', article}));
  await reviewDraft(root, result.draft, 'Engineer', 'Verified meaningful updates.', '2026-09-17');
  await publishDraft(root, result.draft, '2026-09-17');
  const {data} = parseMarkdown(await fs.readFile(path.join(root, article), 'utf8'));
  assert.equal(data.date, '2025-04-01');
  assert.equal(data.slug, 'keep-this-url');
  assert.equal(data.image, './chart.png');
  assert.deepEqual(data.last_update, {date: '2026-09-17', author: 'Engineer'});
  assert.equal(await fs.readFile(path.join(directory, 'chart.png'), 'utf8'), 'existing asset');
  const metadata = JSON.parse(await fs.readFile(path.join(directory, 'metadata.json'), 'utf8'));
  assert.equal(metadata.id, 'keep');
  assert.equal(metadata.structured_data, undefined);
});

test('refresh refuses to overwrite changes made to the published original', async t => {
  const root = await fixture(t);
  const article = 'blog/2025-04-01-original/index.md';
  await fs.mkdir(path.dirname(path.join(root, article)));
  await fs.writeFile(path.join(root, article), markdown({title: 'Old article', date: '2025-04-01'}, 'Old content.'));
  const result = await draft(root, makeBrief({operation: 'refresh', article}));
  await reviewDraft(root, result.draft, 'Engineer', 'Verified updates.', '2026-09-17');
  await fs.appendFile(path.join(root, article), '\nA concurrent editor changed this.');
  await assert.rejects(() => publishDraft(root, result.draft), /Published article changed/);
});

test('source changes invalidate drafts and pending work prevents another generation', async t => {
  const root = await fixture(t);
  assert.equal((await plan(root)).next.id, 'client-guide');
  const result = await draft(root);
  assert.equal((await plan(root)).next, null);
  await assert.rejects(() => draft(root), /Draft already exists/);
  await fs.appendFile(path.join(root, source.path), ' Updated requirements.');
  await assert.rejects(() => reviewDraft(root, result.draft, 'Engineer', 'Reviewed.'), /Source changed/);
});

test('path traversal, symlink evidence, and destination tampering are rejected', async t => {
  const root = await fixture(t);
  await assert.rejects(() => safePath(root, 'content/../package.json', ['content']), /Unsafe path/);
  await fs.symlink(path.join(root, source.path), path.join(root, 'eloqkv/linked.md'));
  await assert.rejects(() => loadSources(root, makeBrief({sources: [{...source, path: 'eloqkv/linked.md'}]})), /Symlinks/);
  const result = await draft(root);
  const file = path.join(root, result.draft, 'manifest.json');
  const manifest = JSON.parse(await fs.readFile(file, 'utf8'));
  manifest.target = 'blog/arbitrary/index.md';
  await fs.writeFile(file, JSON.stringify(manifest));
  await assert.rejects(() => validateDraft(root, result.draft), /destination does not match/);
});

test('Responses request uses explicit model and bounded selected evidence; incomplete, refusal, and fabricated evidence fail', async () => {
  const sources = [{...source, text: sourceText}];
  await assert.rejects(() => generateResponse(makeBrief(), sources, null), /OPENAI_API_KEY/);
  const options = {apiKey: 'test', model: 'chosen-model'};
  await generateResponse(makeBrief(), sources, null, {...options, fetchImpl: async (url, request) => {
    assert.equal(url, 'https://api.openai.com/v1/responses');
    const body = JSON.parse(request.body);
    assert.equal(body.model, 'chosen-model');
    assert.equal(body.store, false);
    assert.equal(body.text.format.strict, true);
    assert.equal(body.max_output_tokens, 6500);
    return mockedResponse(generated)();
  }});
  await assert.rejects(() => generateResponse(makeBrief(), sources, null, {...options, fetchImpl: async () => ({ok: true, json: async () => ({status: 'incomplete'})})}), /incomplete/);
  await assert.rejects(() => generateResponse(makeBrief(), sources, null, {...options, fetchImpl: async () => ({ok: true, json: async () => ({status: 'completed', output: [{content: [{type: 'refusal'}]}]})})}), /declined/);
  await assert.rejects(() => generateResponse(makeBrief(), sources, null, {...options, fetchImpl: mockedResponse({...generated, claims: [{claim: 'Invented', source_url: source.url, evidence: 'Unsupported numbers.'}]})}), /evidence does not match/);
});

test('bad dates and executable content are rejected without crashing date parsing', () => {
  assert.throws(() => validateBrief(makeBrief({publish_date: '2026-99-99'})), /publish_date/);
  const text = markdown({title: generated.title, description: generated.description, summary: generated.summary, date: '2026-99-99', authors: 'eloq', tags: ['EloqKV'], key_takeaways: generated.key_takeaways, sources: [source]}, `${generated.body}\n\nimport Component from 'danger';`);
  const errors = validateArticle(text, [source]);
  assert.ok(errors.some(error => /date must/.test(error)));
  assert.ok(errors.some(error => /executable/.test(error)));
  assert.throws(() => validateBrief(makeBrief({sources: {bad: true}})), /Select between/);
  const malformed = markdown({title: generated.title, date: '2026-09-17', sources: {bad: true}}, generated.body);
  assert.ok(validateArticle(malformed).some(error => /citations are required/.test(error)));
});

test('existing destinations, future dates, and malformed claim evidence cannot be published', async t => {
  const root = await fixture(t);
  const result = await draft(root, makeBrief({publish_date: '2026-10-01'}));
  await reviewDraft(root, result.draft, 'Engineer', 'Reviewed.', '2026-09-17');
  await assert.rejects(() => publishDraft(root, result.draft, '2026-09-17'), /in the future/);
  await fs.mkdir(path.join(root, 'blog/2026-10-01-client-guide'));
  await assert.rejects(() => publishDraft(root, result.draft, '2026-10-01'), /already exists/);
  const claimFile = path.join(root, result.draft, 'claims.json');
  await fs.writeFile(claimFile, JSON.stringify([{claim: 'Unsupported', source_url: source.url, evidence: 'Not found.'}]));
  await assert.rejects(() => reviewDraft(root, result.draft, 'Engineer', 'Reviewed.'), /quote the selected/);
});
