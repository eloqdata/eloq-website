import React from 'react';
import BlogPostPage from '@theme/BlogPostPage';
import {normalizeBlogPostModule} from '@site/src/utils/normalizeBlogPostModule';

export default function NewsPostPage(props) {
  const content = normalizeBlogPostModule(props.content);
  return <BlogPostPage {...props} content={content} />;
}
