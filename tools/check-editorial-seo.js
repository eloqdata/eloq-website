const assert = require('node:assert/strict');
const {
  buildArticleStructuredData,
  getArticleBreadcrumbs,
  getEditorialDetails,
} = require('../src/data/structuredData');
const {collectPublicArticles, createLlmsText} = require('./seo-plugin');

const metadata = {
  title: 'A database article',
  permalink: '/blog/a-database-article',
  date: '2026-04-01T00:00:00.000Z',
  description: 'An article description.',
  authors: [{name: 'EloqData'}],
  tags: [{label: 'Architecture'}],
  frontMatter: {},
};
const baseSchema = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  url: 'https://www.eloqdata.com/blog/a-database-article',
  datePublished: metadata.date,
  dateModified: '2026-09-17T00:00:00.000Z',
  image: {url: 'https://www.eloqdata.com/img/article.png'},
  author: {'@type': 'Person', name: 'EloqData'},
};

const schema = buildArticleStructuredData(baseSchema, metadata);
assert.equal(schema.dateModified, undefined, 'Build or git dates must not create false freshness');
assert.equal(schema.datePublished, metadata.date);
assert.equal(schema.author['@type'], 'Organization');
assert.equal(schema.publisher.name, 'EloqData');
assert.deepEqual(schema.image, baseSchema.image, 'Keep resolved Docusaurus image asset');
assert.equal(buildArticleStructuredData(baseSchema, {...metadata, permalink: '/news/launch'})['@type'], 'NewsArticle');
assert.equal(buildArticleStructuredData(baseSchema, {...metadata, permalink: '/post/analysis'})['@type'], 'Article');
assert.equal(buildArticleStructuredData(baseSchema, {...metadata, authors: [{name: 'Named Expert', url: 'https://example.org/expert'}]}).author['@type'], 'Person');

const updated = {
  ...metadata,
  frontMatter: {
    summary: 'A concise, sourced answer.',
    key_takeaways: ['A supported takeaway.'],
    sources: [{title: 'Documentation', url: 'https://www.eloqdata.com/eloqkv/introduction'}],
    last_update: {date: '2026-05-02', author: 'Named Expert'},
    last_reviewed: '2026-05-02',
    reviewed_by: 'Named Expert',
  },
};
const updatedSchema = buildArticleStructuredData(baseSchema, updated);
assert.equal(updatedSchema.dateModified, '2026-05-02T00:00:00.000Z');
assert.equal(updatedSchema.abstract, updated.frontMatter.summary);
assert.equal(updatedSchema.citation[0].url, updated.frontMatter.sources[0].url);
const breadcrumb = getArticleBreadcrumbs({...metadata, permalink: '/news/launch'});
assert.deepEqual(breadcrumb.itemListElement.map(item => item.name), ['Home', 'News', metadata.title]);
assert.equal(breadcrumb.itemListElement.at(-1).item, 'https://www.eloqdata.com/news/launch');
assert.deepEqual(getEditorialDetails({sources: [{title: 'Unsafe', url: 'javascript:alert(1)'}]}).sources, []);
assert.equal(getEditorialDetails({last_update: {date: 'invalid'}}).modified, undefined);

const allContent = {
  'docusaurus-plugin-content-blog': {
    default: {blogPosts: [
      {metadata: updated},
      {metadata: {...metadata, permalink: '/blog/draft', frontMatter: {draft: true}}},
      {metadata: {...metadata, permalink: '/blog/unlisted', unlisted: true}},
      {metadata: {...metadata, permalink: '/blog/noindex'}},
      {metadata: {...metadata, permalink: '/blog/noindex-with-slash'}},
    ]},
    news: {blogPosts: [{metadata: {...metadata, permalink: '/news/launch', date: '2026-05-01'}}]},
  },
};
const articles = collectPublicArticles(allContent, {
  '/blog/noindex': {noIndex: true},
  '/blog/noindex-with-slash/': {noIndex: true},
});
assert.deepEqual(articles.map(article => article.path), ['/news/launch', '/blog/a-database-article']);
assert.deepEqual(collectPublicArticles(allContent, {}, true), [], 'Preview builds must not publish an article index');
assert.equal(articles[0].dateModified, undefined);
assert.equal(articles[1].lastReviewed, '2026-05-02T00:00:00.000Z');
const text = createLlmsText('# EloqData\n', articles.map(article => ({...article, url: `https://www.eloqdata.com${article.path}`})));
assert.match(text, /## Published technical blog posts/);
assert.match(text, /## Published news/);
assert.match(text, /https:\/\/www\.eloqdata\.com\/news\/launch/);
assert.doesNotMatch(text, /\/blog\/(draft|unlisted|noindex)/);

console.log('Editorial metadata and public discovery checks passed.');
