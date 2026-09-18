import React from "react";
import Layout from "@theme/Layout";
import clsx from "clsx";
import styles from "./styles.module.css";

export default function BlogLayout(props) {
  const { children, isBlogListPage } = props;

  return (
    <Layout
      wrapperClassName={clsx(
        "blog-layout-page",
        isBlogListPage ? "blog-list-page" : "blog-post-page"
      )}
      noSidebar={true}
    >
      {isBlogListPage ? (
        <main className={styles.listContent}>{children}</main>
      ) : (
        <div className={styles.blogPostContainer}>
          <main className={styles.blogContent}>{children}</main>
        </div>
      )}
    </Layout>
  );
}
