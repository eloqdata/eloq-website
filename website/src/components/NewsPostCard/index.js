import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export default function NewsPostCard({metadata, frontMatter}) {
  const {permalink, title, description, date} = metadata;
  const {image, tags} = frontMatter;

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className={styles.newsCard}>
      {image && (
        <Link to={permalink} className={styles.newsCardImage}>
          <img src={image} alt={title} />
        </Link>
      )}
      <div className={styles.newsCardContent}>
        <div className={styles.newsCardMeta}>
          {tags?.[0]} • {formattedDate}
        </div>
        <h2 className={styles.newsCardTitle}>
          <Link to={permalink}>{title}</Link>
        </h2>
        <p className={styles.newsCardDescription}>{description}</p>
      </div>
    </article>
  );
}
