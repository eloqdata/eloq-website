import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {
  HtmlClassNameProvider,
  PageMetadata,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import BlogLayout from '@theme/BlogLayout';
import BlogListPaginator from '@theme/BlogListPaginator';
import BlogListPageStructuredData from '@theme/BlogListPage/StructuredData';
import SearchMetadata from '@theme/SearchMetadata';
import ContentCard from '../ContentCard';
import {normalizeBlogPostModule} from '@site/src/utils/normalizeBlogPostModule';
import styles from './styles.module.css';

const sections = [
  {id: 'blog', label: 'Blog', path: '/blog', heading: 'Ideas from the engineering team'},
  {id: 'news', label: 'News', path: '/news', heading: 'The latest from EloqData'},
  {id: 'articles', label: 'Articles', path: '/post', heading: 'Go deeper on your data infrastructure'},
];

export default function ContentListPage({items, metadata, section = 'blog', ...props}) {
  const currentSection = sections.find(item => item.id === section) || sections[0];
  const feedUrl = useBaseUrl(`${currentSection.path}/rss.xml`);
  const posts = items.map(item => ({
    ...item,
    content: normalizeBlogPostModule(item.content),
  }));
  // Featuring a post changes placement only. Every post supplied by Docusaurus
  // remains visible exactly once, including extra featured and featuredMain posts.
  const featuredPost = section === 'blog'
    ? posts.find(post => post.content.frontMatter?.featuredMain)
      || posts.find(post => post.content.frontMatter?.featured)
    : undefined;
  const remainingPosts = posts.filter(post => post !== featuredPost);
  const pageTitle = metadata.page > 1
    ? `${metadata.blogTitle} – Page ${metadata.page}`
    : metadata.blogTitle;

  return (
    <HtmlClassNameProvider
      className={clsx(ThemeClassNames.wrapper.blogPages, ThemeClassNames.page.blogListPage)}>
      <PageMetadata title={pageTitle} description={metadata.blogDescription} />
      <SearchMetadata tag="blog_posts_list" />
      <BlogListPageStructuredData {...props} items={posts} metadata={metadata} />
      <BlogLayout isBlogListPage>
        <div className={styles.resources}>
          <header className={styles.header}>
            <p className={styles.eyebrow}>EloqData resources / {currentSection.label}</p>
            <h1>{currentSection.heading}</h1>
            <p className={styles.description}>{metadata.blogDescription}</p>
          </header>
          <div className={styles.navigation}>
            <nav className={styles.sections} aria-label="Resource sections">
              {sections.map(item => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={clsx(styles.sectionLink, item.id === section && styles.active)}
                  aria-current={item.id === section ? 'page' : undefined}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className={styles.utilities}>
              <Link to={`${currentSection.path}/tags`}>Browse topics</Link>
              <a href={feedUrl}>RSS feed</a>
            </div>
          </div>
          {featuredPost && (
            <div className={styles.featured}>
              <ContentCard {...featuredPost.content} featured />
            </div>
          )}
          {posts.length > 0 ? (
            <>
              <div className={styles.listHeading}>
                <p className={styles.listLabel}>
                  {featuredPost && remainingPosts.length > 0 ? 'More from the blog' : currentSection.label}
                </p>
                <p className={styles.count}>
                  {metadata.totalCount} {metadata.totalCount === 1 ? 'publication' : 'publications'}
                  {metadata.totalPages > 1 && ` · Page ${metadata.page} of ${metadata.totalPages}`}
                </p>
              </div>
              <div className={styles.grid}>
                {remainingPosts.map(post => (
                  <ContentCard key={post.content.metadata.permalink} {...post.content} />
                ))}
              </div>
            </>
          ) : (
            <div className={styles.empty}>
              <h2>More to come</h2>
              <p>Explore the other resource sections for engineering insights and company updates.</p>
            </div>
          )}
          {(metadata.previousPage || metadata.nextPage) && (
            <div className={styles.pagination}>
              <BlogListPaginator metadata={metadata} />
            </div>
          )}
        </div>
      </BlogLayout>
    </HtmlClassNameProvider>
  );
}
