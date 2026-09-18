import React from 'react';
import Link from '@docusaurus/Link';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import OriginalContent from '@theme-original/BlogPostItem/Content';
import structuredData from '@site/src/data/structuredData';
import styles from './styles.module.css';

function EditorialDate({value}) {
  return <time dateTime={value}>{new Date(value).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
  })}</time>;
}

export default function BlogPostItemContent({children, ...props}) {
  const {metadata, isBlogPostPage} = useBlogPost();
  if (!isBlogPostPage) return <OriginalContent {...props}>{children}</OriginalContent>;
  const section = structuredData.getArticleSection(metadata.permalink);
  const {summary, takeaways, sources, modified, reviewed, reviewer} =
    structuredData.getEditorialDetails(metadata.frontMatter);

  return (
    <OriginalContent {...props}>
      <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
        <ol>
          <li><Link to="/">Home</Link></li>
          <li><Link to={section.path}>{section.name}</Link></li>
          <li aria-current="page">{metadata.title}</li>
        </ol>
      </nav>
      {(summary || takeaways.length > 0) && (
        <section className={styles.summary} aria-label="Article summary">
          {summary && <><h2>At a glance</h2><p>{summary}</p></>}
          {takeaways.length > 0 && <>
            <h2>Key takeaways</h2>
            <ul>{takeaways.map((takeaway, i) => <li key={i}>{takeaway}</li>)}</ul>
          </>}
        </section>
      )}
      {children}
      {sources.length > 0 && <section className={styles.sources} aria-label="Sources">
        <h2 id="article-sources">Sources</h2>
        <ul>{sources.map((source, i) => <li key={i}>
          <a href={source.url}>{source.title}</a>
        </li>)}</ul>
      </section>}
      {(modified || (reviewed && reviewer)) && <div className={styles.review}>
        {modified && <p>Updated <EditorialDate value={modified} /></p>}
        {reviewed && reviewer && <p>Reviewed by {reviewer} on <EditorialDate value={reviewed} /></p>}
      </div>}
    </OriginalContent>
  );
}
