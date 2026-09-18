const fs = require('node:fs/promises');
const path = require('node:path');
const {getArticleSection, getEditorialDetails} = require('../../src/data/structuredData');

function collectPublicArticles(allContent, routesBuildMetadata = {}, noIndex = false) {
  if (noIndex) return [];
  const plugins = Object.values(allContent['docusaurus-plugin-content-blog'] || {});
  const articles = plugins.flatMap(content => (content.blogPosts || []).map(post => post.metadata))
    .filter(metadata => {
      const frontMatter = metadata.frontMatter || {};
      const route = routesBuildMetadata[metadata.permalink] ||
        routesBuildMetadata[`${metadata.permalink.replace(/\/$/, '')}/`];
      return !metadata.unlisted && !frontMatter.draft && !frontMatter.unlisted &&
        !frontMatter.noindex && !frontMatter.noIndex && !route?.noIndex;
    })
    .map(metadata => {
      const editorial = getEditorialDetails(metadata.frontMatter);
      return {
        type: getArticleSection(metadata.permalink).type,
        title: metadata.title,
        path: metadata.permalink,
        description: metadata.description,
        datePublished: new Date(metadata.date).toISOString(),
        ...(editorial.modified ? {dateModified: editorial.modified} : {}),
        authors: (metadata.authors || []).map(author => ({name: author.name, ...(author.url ? {url: author.url} : {})})),
        tags: (metadata.tags || []).map(tag => tag.label),
        ...(editorial.summary ? {summary: editorial.summary} : {}),
        ...(editorial.takeaways.length ? {keyTakeaways: editorial.takeaways} : {}),
        ...(editorial.sources.length ? {sources: editorial.sources} : {}),
        ...(editorial.reviewed && editorial.reviewer ? {
          lastReviewed: editorial.reviewed, reviewedBy: editorial.reviewer,
        } : {}),
      };
    });
  return articles.sort((a, b) => b.datePublished.localeCompare(a.datePublished) || a.path.localeCompare(b.path));
}

function markdownText(value) {
  return String(value || '').replace(/[\r\n]+/g, ' ').replace(/[\[\]<>]/g, '');
}

function createLlmsText(baseText, articles) {
  const sections = [
    ['BlogPosting', 'Published technical blog posts'],
    ['Article', 'Published articles'],
    ['NewsArticle', 'Published news'],
  ];
  return `${baseText.trim()}\n${sections.map(([type, title]) => {
    const entries = articles.filter(article => article.type === type);
    if (!entries.length) return '';
    return `\n## ${title}\n\n${entries.map(article =>
      `- [${markdownText(article.title)}](${article.url}): ${article.datePublished.slice(0, 10)}. ${markdownText(article.summary || article.description)}`
    ).join('\n')}\n`;
  }).join('')}`;
}

module.exports = function seoDiscoveryPlugin(context) {
  let allContent = {};
  return {
    name: 'eloqdata-seo-discovery',
    allContentLoaded(args) {
      allContent = args.allContent;
    },
    async postBuild({outDir, routesBuildMetadata, siteConfig}) {
      const articles = collectPublicArticles(allContent, routesBuildMetadata, siteConfig.noIndex)
        .map(({path: permalink, ...article}) => ({
          ...article,
          url: new URL(permalink, siteConfig.url).href,
        }));
      const index = {schemaVersion: 1, site: siteConfig.url, articles};
      const base = await fs.readFile(path.join(context.siteDir, 'static/llms.txt'), 'utf8');
      await fs.writeFile(path.join(outDir, 'content-index.json'), `${JSON.stringify(index, null, 2)}\n`);
      await fs.writeFile(path.join(outDir, 'llms.txt'), siteConfig.noIndex
        ? '# EloqData preview\n\nThis preview is not an indexable publication.\n'
        : createLlmsText(base, articles));
    },
  };
};

module.exports.collectPublicArticles = collectPublicArticles;
module.exports.createLlmsText = createLlmsText;
