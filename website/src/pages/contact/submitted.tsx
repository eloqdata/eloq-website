import React from "react";
import Heading from "@theme/Heading";
import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";

export default function ContactSubmitted() {
  return (
    <Layout title="Message Received!">
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="margin-vert--lg container">
        <div className="row">
          <div className="col col--6 col--offset-3">
            <Heading as="h1">感谢您的留言！</Heading>
            <p>我们已收到您的消息，将尽快与您联系。</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
