import React from 'react';
import BlogListPage from '@theme/BlogListPage';

export default function NewsListPage(props) {
  // Filter posts that have news: true in frontmatter
  const newsItems = props.items.filter(
    item => item.content.frontMatter.news === true
  );

  // Sort by date descending
  const sortedNewsItems = newsItems.sort((a, b) => {
    const dateA = new Date(a.content.metadata.date);
    const dateB = new Date(b.content.metadata.date);
    return dateB - dateA;
  });

  // Create modified metadata for news list
  const newsMetadata = {
    ...props.metadata,
    blogTitle: 'News',
    blogDescription: 'Latest news and announcements from EloqData',
  };

  // Remove BlogPostProvider as it's not needed for list page
  return (
    <BlogListPage {...props} items={sortedNewsItems} metadata={newsMetadata} />
  );
}
