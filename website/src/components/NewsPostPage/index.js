import React from 'react';
import BlogPostPage from '@theme/BlogPostPage';

export default function NewsPostPage(props) {
  // Only render if the post has news tag
  if (!props.content.frontMatter.news) {
    return null;
  }

  // Remove BlogPostProvider as it's handled by BlogPostPage
  return <BlogPostPage {...props} />;
}
