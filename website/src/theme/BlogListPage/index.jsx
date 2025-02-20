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
      metadata: { permalink, title, description, date },
      frontMatter,
    },
  } = post;

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

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
        {isFeaturedMain && frontMatter.tags && (
          <div className={styles.blogCardMeta}>
            {frontMatter.tags[0]} • {formattedDate}
          </div>
        )}
        <h2 className={styles.blogCardTitle}>
          <Link to={permalink}>{title}</Link>
        </h2>
        {isFeaturedMain && (
          <p className={styles.blogCardDescription}>{description}</p>
        )}
      </div>
    </article>
  );
}

function BlogListPageContent(props) {
  const { items, metadata } = props;

  // Filter featured and non-featured posts
  const featuredPosts = items.filter(
    (post) => post.content.frontMatter.featured
  );
  const regularPosts = items.filter(
    (post) => !post.content.frontMatter.featured
  );

  // Get main featured post and other featured posts
  const mainFeaturedPost = featuredPosts.find(
    (post) => post.content.frontMatter.featuredMain
  );
  const otherFeaturedPosts = featuredPosts.filter(
    (post) => !post.content.frontMatter.featuredMain
  );

  return (
    <BlogLayout isBlogListPage={true}>
      <div className={styles.blogContainer}>
        <div className="container">
          {(mainFeaturedPost || otherFeaturedPosts.length > 0) && (
            <section className={styles.featuredSection}>
              <h1 className={styles.sectionTitle}>Featured</h1>
              <div className={styles.featuredGrid}>
                {mainFeaturedPost && (
                  <div className={styles.featuredMainPost}>
                    <BlogPostCard
                      post={mainFeaturedPost}
                      isFeaturedMain={true}
                    />
                  </div>
                )}
                <div className={styles.featuredSidePosts}>
                  {otherFeaturedPosts.slice(0, 2).map((post, idx) => (
                    <BlogPostCard key={idx} post={post} />
                  ))}
                </div>
              </div>
            </section>
          )}

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
