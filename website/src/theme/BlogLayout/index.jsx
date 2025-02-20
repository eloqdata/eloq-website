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
      <div className={styles.blogPostContainer}>
        <aside className={styles.blogSidebar}></aside>
        <main className={styles.blogContent}>{children}</main>
        <aside className={styles.blogSidebar}></aside>
      </div>
    </Layout>
  );
}
