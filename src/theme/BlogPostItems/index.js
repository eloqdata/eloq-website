import React from 'react';
import {BlogPostProvider} from '@docusaurus/plugin-content-blog/client';
import BlogPostItem from '@theme/BlogPostItem';
import {normalizeBlogPostModule} from '@site/src/utils/normalizeBlogPostModule';

export default function BlogPostItems({
  items,
  component: BlogPostItemComponent = BlogPostItem,
}) {
  return (
    <>
      {items.map(({content: rawContent}) => {
        const BlogPostContent = normalizeBlogPostModule(rawContent);
        return (
          <BlogPostProvider
            key={BlogPostContent.metadata.permalink}
            content={BlogPostContent}>
            <BlogPostItemComponent>
              <BlogPostContent />
            </BlogPostItemComponent>
          </BlogPostProvider>
        );
      })}
    </>
  );
}
