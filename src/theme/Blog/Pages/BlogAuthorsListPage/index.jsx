import React from 'react';
import {PageMetadata} from '@docusaurus/theme-common';
import {useLocation} from '@docusaurus/router';
import {getCollectionName} from '@site/src/components/ContentListPage/collection';
import OriginalBlogAuthorsListPage from '@theme-original/Blog/Pages/BlogAuthorsListPage';

export default function BlogAuthorsListPage(props) {
  const {pathname} = useLocation();
  const blogTitle = getCollectionName(pathname);
  return (
    <>
      <OriginalBlogAuthorsListPage {...props} />
      <PageMetadata
        title={`${blogTitle} Authors`}
        description={`Meet the contributors to ${blogTitle}. Browse their articles and insights on EloqData databases, engineering, and product developments.`}
      />
    </>
  );
}
