import React from 'react';
import OriginalBlogPostPage from '@theme-original/BlogPostPage';
import StructuredData from '@site/src/components/StructuredData';
import structuredData from '@site/src/data/structuredData';

const {getStructuredDataForPath} = structuredData;

export default function BlogPostPage(props) {
  const permalink =
    props.content?.metadata?.permalink ??
    props.content?.default?.metadata?.permalink;
  const schemas = getStructuredDataForPath(permalink);

  return (
    <>
      <StructuredData schemas={schemas} />
      <OriginalBlogPostPage {...props} />
    </>
  );
}
