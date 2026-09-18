import React from 'react';
import ContentListPage from '../ContentListPage';

export default function NewsListPage(props) {
  const section = /\/post(?:\/|$)/.test(props.metadata.permalink) ? 'articles' : 'news';
  return <ContentListPage {...props} section={section} />;
}
