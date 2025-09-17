import React from 'react';
import BlogPostPage from '@theme/BlogPostPage';

export default function NewsPostPage(props) {
  // Remove the filter and just render all posts
  return <BlogPostPage {...props} />;
}
