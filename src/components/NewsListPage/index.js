import {
  HtmlClassNameProvider,
  PageMetadata,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import BlogLayout from '@theme/BlogLayout';
import BlogListPaginator from '@theme/BlogListPaginator';
import clsx from 'clsx';
import NewsPostCard from '../NewsPostCard';
import styles from './styles.module.css';

function NewsListPageMetadata(props) {
  const {metadata} = props;
  const {blogTitle, blogDescription} = metadata;
  return <PageMetadata title={blogTitle} description={blogDescription} />;
}

function NewsListPageContent(props) {
  const {items, metadata} = props;

  // Sort by date descending
  const sortedItems = [...items].sort((a, b) => {
    const dateA = new Date(a.content.metadata.date);
    const dateB = new Date(b.content.metadata.date);
    return dateB - dateA;
  });

  return (
    <BlogLayout isBlogListPage={true}>
      <div className={styles.newsContainer}>
        <div className={styles.newsGrid}>
          {sortedItems.map(item => (
            <NewsPostCard
              key={item.content.metadata.permalink}
              frontMatter={item.content.frontMatter}
              metadata={item.content.metadata}
            />
          ))}
        </div>
        <BlogListPaginator metadata={metadata} />
      </div>
    </BlogLayout>
  );
}

export default function NewsListPage(props) {
  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogListPage
      )}>
      <NewsListPageMetadata {...props} />
      <NewsListPageContent {...props} />
    </HtmlClassNameProvider>
  );
}
