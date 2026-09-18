import React from 'react';
import {
  useBlogPost,
  useBlogPostStructuredData,
} from '@docusaurus/plugin-content-blog/client';
import StructuredData from '@site/src/components/StructuredData';
import structuredData from '@site/src/data/structuredData';

const {buildArticleStructuredData, getArticleBreadcrumbs} = structuredData;

// Replace Docusaurus's one article schema instead of adding a second one.
// Keep its resolved image assets and canonical URL, then enrich editorial data.
export default function BlogPostPageStructuredData() {
  const {metadata} = useBlogPost();
  const article = buildArticleStructuredData(useBlogPostStructuredData(), metadata);
  return <StructuredData schemas={[article, getArticleBreadcrumbs(metadata)]} />;
}
