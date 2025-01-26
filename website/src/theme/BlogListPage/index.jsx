import React from "react";
import clsx from "clsx";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
} from "@docusaurus/theme-common";
import BlogLayout from "@theme/BlogLayout";
import BlogListPaginator from "@theme/BlogListPaginator";
import SearchMetadata from "@theme/SearchMetadata";
import Link from "@docusaurus/Link";

import styles from "./styles.module.css";

function BlogListPageMetadata(props) {
  const { metadata } = props;
  const {
    siteConfig: { title: siteTitle },
  } = useDocusaurusContext();
  const { blogDescription, blogTitle, permalink } = metadata;
  const title = blogTitle ?? siteTitle;
  return (
    <>
      <PageMetadata title={title} description={blogDescription} />
      <SearchMetadata tag="blog_posts_list" />
    </>
  );
}

function BlogPostCard({ post, isFeaturedMain = false }) {
  const {
    content: {
      metadata: { permalink, title, description },
      frontMatter,
    },
  } = post;

  return (
    <article
      className={clsx(
        styles.blogCard,
        isFeaturedMain && styles.featuredMainCard
      )}
    >
      {frontMatter.image && (
        <Link to={permalink} className={styles.blogCardImage}>
          <img src={frontMatter.image} alt={title} />
        </Link>
      )}
      <div className={styles.blogCardContent}>
        <h2 className={styles.blogCardTitle}>
          <Link to={permalink}>{title}</Link>
        </h2>
        <p className={styles.blogCardDescription}>{description}</p>
      </div>
    </article>
  );
}

function BlogListPageContent(props) {
  const { items, metadata } = props;
  const [mainFeatured, ...otherFeatured] = items.slice(0, 3);
  const regularPosts = items.slice(3);

  return (
    <BlogLayout>
      <div className={styles.blogContainer}>
        <div className="container">
          <section className={styles.featuredSection}>
            <h1 className={styles.sectionTitle}>Featured</h1>
            <div className={styles.featuredGrid}>
              <div className={styles.featuredMainPost}>
                <BlogPostCard post={mainFeatured} isFeaturedMain={true} />
              </div>
              <div className={styles.featuredSidePosts}>
                {otherFeatured.map((post, idx) => (
                  <BlogPostCard key={idx} post={post} />
                ))}
              </div>
            </div>
          </section>

          <section className={styles.allPostsSection}>
            <h1 className={styles.sectionTitle}>All Posts</h1>
            <div className={styles.blogGrid}>
              {regularPosts.map((post, idx) => (
                <BlogPostCard key={idx} post={post} />
              ))}
            </div>
            <BlogListPaginator metadata={metadata} />
          </section>
        </div>
      </div>
    </BlogLayout>
  );
}

export default function BlogListPage(props) {
  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogListPage
      )}
    >
      <BlogListPageMetadata {...props} />
      <BlogListPageContent {...props} />
    </HtmlClassNameProvider>
  );
}
