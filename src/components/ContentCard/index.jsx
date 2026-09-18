import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

export default function ContentCard({
  metadata,
  frontMatter = {},
  assets = {},
  featured = false,
}) {
  const {permalink, title, description, date, readingTime, tags = []} = metadata;
  const image = assets.image ?? frontMatter.image;
  const imageUrl = useBaseUrl(image || '/img/logo-og.png');
  const publishedDate = new Date(date);
  const hasDate = !Number.isNaN(publishedDate.getTime());
  const authors = (metadata.authors || []).map(author => author.name).filter(Boolean);

  return (
    <article className={clsx(styles.card, featured && styles.featured, !image && styles.noImage)}>
      {image && (
        <Link to={permalink} className={styles.imageLink} aria-hidden="true" tabIndex={-1}>
          <img
            src={imageUrl}
            alt=""
            width="800"
            height="450"
            loading={featured ? 'eager' : 'lazy'}
            decoding="async"
          />
        </Link>
      )}
      <div className={styles.content}>
        {(featured || frontMatter.featured || frontMatter.featuredMain) && (
          <span className={styles.featuredLabel}>Featured</span>
        )}
        <div className={styles.meta}>
          {hasDate && (
            <time dateTime={publishedDate.toISOString()}>
              {publishedDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                timeZone: 'UTC',
              })}
            </time>
          )}
          {typeof readingTime === 'number' && readingTime > 0 && (
            <span>{Math.max(1, Math.ceil(readingTime))} min read</span>
          )}
        </div>
        <h2 className={styles.title}>
          <Link to={permalink}>{title}</Link>
        </h2>
        {description && <p className={styles.description}>{description}</p>}
        {authors.length > 0 && <p className={styles.authors}>By {authors.join(', ')}</p>}
        {tags.length > 0 && (
          <ul className={styles.tags} aria-label={`Topics for ${title}`}>
            {tags.map(tag => (
              <li key={tag.permalink}>
                <Link to={tag.permalink}>{tag.label}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
