import React from 'react';
import {PageMetadata} from '@docusaurus/theme-common';
import {useLocation} from '@docusaurus/router';
import {getCollectionName} from '@site/src/components/ContentListPage/collection';
import OriginalBlogTagsListPage from '@theme-original/BlogTagsListPage';

export default function BlogTagsListPage(props) {
  const {pathname} = useLocation();
  const blogTitle = getCollectionName(pathname);
  return (
    <>
      <OriginalBlogTagsListPage {...props} />
      <PageMetadata
        title={`${blogTitle} Topics`}
        description={`Explore the topics covered in ${blogTitle}, with links to related database engineering guides, benchmarks, and product updates.`}
      />
    </>
  );
}
