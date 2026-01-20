import React, { useEffect } from "react";
import Heading from "@theme/Heading";
import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";

export default function RequestPaperSubmitted() {
    useEffect(() => {
        const redirectTimeout = window.setTimeout(() => {
            window.location.href = "/";
        }, 5000);

        return () => window.clearTimeout(redirectTimeout);
    }, []);

    return (
        <Layout title="Request Received">
            <Head>
                <meta name="robots" content="noindex" />
            </Head>
            <div
                style={{
                    minHeight: "calc(100vh - 120px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "2rem 1.5rem",
                    background:
                        "radial-gradient(circle at top, rgba(120,200,244,0.15), transparent 55%)",
                }}
            >
                <div
                    style={{
                        maxWidth: "540px",
                        width: "100%",
                        backgroundColor: "var(--ifm-background-surface-color)",
                        boxShadow: "0 24px 48px rgba(0,0,0,0.25)",
                        borderRadius: "18px",
                        padding: "2.75rem 2.5rem",
                        textAlign: "center",
                    }}
                >
                    <div
                        style={{
                            width: "72px",
                            height: "72px",
                            margin: "0 auto 1.5rem",
                            borderRadius: "50%",
                            background:
                                "linear-gradient(135deg, rgb(120,200,244) 0%, rgba(120,200,244,0.45) 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#0d1b2a",
                            fontSize: "2rem",
                            fontWeight: 700,
                        }}
                    >
                        ✓
                    </div>
                    <Heading as="h1" style={{ marginBottom: "0.75rem" }}>
                        Request Received
                    </Heading>
                    <p style={{ fontSize: "1.05rem", lineHeight: 1.6, marginBottom: "2rem" }}>
                        Thanks for requesting the EloqData paper. We will email it to you shortly.
                        You will return to the homepage automatically in a few seconds.
                    </p>
                    <a
                        href="/"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.5rem",
                            padding: "0.85rem 1.6rem",
                            borderRadius: "999px",
                            fontWeight: 600,
                            backgroundColor: "rgb(120, 200, 244)",
                            color: "#0d1b2a",
                            textDecoration: "none",
                            transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        }}
                        onMouseEnter={(event) => {
                            event.currentTarget.style.transform = "translateY(-2px)";
                            event.currentTarget.style.boxShadow = "0 12px 24px rgba(13,27,42,0.18)";
                        }}
                        onMouseLeave={(event) => {
                            event.currentTarget.style.transform = "translateY(0)";
                            event.currentTarget.style.boxShadow = "none";
                        }}
                    >
                        Return Home Now
                    </a>
                    <p
                        style={{
                            marginTop: "1.5rem",
                            fontSize: "0.9rem",
                            color: "var(--ifm-color-secondary-darkest)",
                        }}
                    >
                        Redirecting in 5 seconds…
                    </p>
                </div>
            </div>
        </Layout>
    );
}

