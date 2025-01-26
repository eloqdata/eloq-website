import React from "react";
import Layout from "@theme/Layout";
import clsx from "clsx";

export default function BlogLayout(props) {
  const { children } = props;

  return (
    <Layout
      wrapperClassName={clsx("blog-layout-page")}
      noSidebar={true} // Disable sidebar
    >
      {children}
    </Layout>
  );
}
