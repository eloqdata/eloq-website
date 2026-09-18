import React from 'react';
import Head from '@docusaurus/Head';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import OriginalMetadata from '@theme-original/BlogPostPage/Metadata';
import structuredData from '@site/src/data/structuredData';

export default function BlogPostPageMetadata() {
  const {metadata} = useBlogPost();
  const {modified} = structuredData.getEditorialDetails(metadata.frontMatter);
  return (
    <>
      <OriginalMetadata />
      {modified && <Head><meta property="article:modified_time" content={modified} /></Head>}
    </>
  );
}
