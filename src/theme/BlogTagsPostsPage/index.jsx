import React from 'react';
import {useLocation} from '@docusaurus/router';
import {getCollectionName} from '@site/src/components/ContentListPage/collection';
import OriginalBlogTagsPostsPage from '@theme-original/BlogTagsPostsPage';

export default function BlogTagsPostsPage(props) {
  const {pathname} = useLocation();
  const blogTitle = getCollectionName(pathname);
  const tag = {
    ...props.tag,
    description: props.tag.description
      || `Explore ${props.tag.label} in ${blogTitle}. Browse related publications, technical insights, and updates from EloqData.`,
  };
  return <OriginalBlogTagsPostsPage {...props} tag={tag} />;
}
