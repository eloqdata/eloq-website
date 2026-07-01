import React from 'react';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';

const cardStyle: React.CSSProperties = {
  maxWidth: '560px',
  width: '100%',
  backgroundColor: 'var(--ifm-background-surface-color)',
  boxShadow: '0 24px 48px rgba(0,0,0,0.25)',
  borderRadius: '18px',
  padding: '2.75rem 2.5rem',
  textAlign: 'center',
};

const primaryButtonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  padding: '0.85rem 1.6rem',
  borderRadius: '999px',
  fontWeight: 600,
  backgroundColor: 'rgb(120, 200, 244)',
  color: '#0d1b2a',
  textDecoration: 'none',
};

const secondaryButtonStyle: React.CSSProperties = {
  ...primaryButtonStyle,
  backgroundColor: 'transparent',
  color: 'var(--ifm-font-color-base)',
  border: '1px solid var(--ifm-color-emphasis-300)',
};

export default function CloudStayTunedPage() {
  return (
    <Layout
      title="EloqCloud — Stay Tuned"
      description="EloqCloud sign up and login are temporarily unavailable. Stay tuned for updates.">
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <div
        style={{
          minHeight: 'calc(100vh - 120px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1.5rem',
          background:
            'radial-gradient(circle at top, rgba(120,200,244,0.15), transparent 55%)',
        }}>
        <div style={cardStyle}>
          <div
            style={{
              width: '72px',
              height: '72px',
              margin: '0 auto 1.5rem',
              borderRadius: '50%',
              background:
                'linear-gradient(135deg, rgb(255, 123, 45) 0%, rgba(255, 159, 74, 0.55) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0d1b2a',
              fontSize: '2rem',
              fontWeight: 700,
            }}>
            ⏳
          </div>
          <Heading as="h1" style={{marginBottom: '0.75rem'}}>
            Stay Tuned
          </Heading>
          <p style={{fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '1rem'}}>
            EloqCloud sign up and login are temporarily unavailable while we make
            improvements to the platform.
          </p>
          <p
            style={{
              fontSize: '1rem',
              lineHeight: 1.6,
              marginBottom: '2rem',
              color: 'var(--ifm-color-secondary-darkest)',
            }}>
            We will be back soon. In the meantime, explore our open source products,
            read the docs, or reach out if you need help.
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              justifyContent: 'center',
            }}>
            <Link style={primaryButtonStyle} to="/">
              Return Home
            </Link>
            <Link style={secondaryButtonStyle} to="/contact">
              Contact Us
            </Link>
            <a
              style={secondaryButtonStyle}
              href="https://discord.gg/nmYjBkfak6"
              target="_blank"
              rel="noopener noreferrer">
              Join Discord
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
