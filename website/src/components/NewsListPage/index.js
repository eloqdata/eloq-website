import React from 'react';
import BlogListPage from '@theme/BlogListPage';

export default function NewsListPage(props) {
  const {items} = props;

  // Filter for news posts only (has news: true tag)
  const newsPosts = items.filter(
    post => post.content.frontMatter.news === true
  );

  // Filter featured and non-featured news
  const featuredNews = newsPosts.filter(
    post => post.content.frontMatter.newsFeatured
  );
  const regularNews = newsPosts.filter(
    post => !post.content.frontMatter.newsFeatured
  );

  // Get main featured news and other featured news
  const mainFeaturedNews = featuredNews.find(
    post => post.content.frontMatter.newsFeatureMain
  );
  const otherFeaturedNews = featuredNews.filter(
    post => !post.content.frontMatter.newsFeatureMain
  );

  // Sort by date descending
  const sortedNewsItems = newsPosts.sort((a, b) => {
    const dateA = new Date(a.content.metadata.date);
    const dateB = new Date(b.content.metadata.date);
    return dateB - dateA;
  });

  // Create modified metadata for news list
  const newsMetadata = {
    ...props.metadata,
    blogTitle: 'News',
    blogDescription: 'Latest news and announcements from EloqData',
    allBlogText: 'All News',
  };

  // Modify the items to use newsFeatureMain and newsFeatured instead of featuredMain and featured
  const modifiedItems = sortedNewsItems.map(item => ({
    ...item,
    content: {
      ...item.content,
      frontMatter: {
        ...item.content.frontMatter,
        featuredMain: item.content.frontMatter.newsFeatureMain,
        featured: item.content.frontMatter.newsFeatured,
      },
    },
  }));

  return (
    <BlogListPage {...props} items={modifiedItems} metadata={newsMetadata} />
  );
}
