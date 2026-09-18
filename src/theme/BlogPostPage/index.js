import React from 'react';
import OriginalBlogPostPage from '@theme-original/BlogPostPage';
import StructuredData from '@site/src/components/StructuredData';
import structuredData from '@site/src/data/structuredData';

const {getStructuredDataForPath} = structuredData;

export default function BlogPostPage(props) {
  const permalink =
    props.content?.metadata?.permalink ??
    props.content?.default?.metadata?.permalink;
  // The shared post schema component adds current breadcrumbs for every post.
  // Route-specific FAQ markup stays tied to the existing visible FAQ content.
  const schemas = getStructuredDataForPath(permalink).filter(
    schema => schema['@type'] !== 'BreadcrumbList'
  );

  return (
    <>
      <StructuredData schemas={schemas} />
      <OriginalBlogPostPage {...props} />
    </>
  );
}
