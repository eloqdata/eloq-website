/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

//const versions = require('./versions.json');

//const lastVersion = versions[0];
const copyright = `Copyright © ${new Date().getFullYear()} EloqData PTE. LTD.`;
const trademark = `Redis, MySQL, PostgreSQL, MariaDB, MongoDB, and Kubernetes are trademarks of their respective owners. All other trademarks are the property of their respective owners.`;

const commonDocsOptions = {
  breadcrumbs: false,
  showLastUpdateAuthor: false,
  showLastUpdateTime: true,
};

const isDeployPreview = process.env.PREVIEW_DEPLOY === 'true';

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'EloqData: Next Generation Multi-model Database',
  tagline:
    'Data Substrate powered modular database which enables vertical and horizontal expanding of the decoupled components: compute, memory, storage and log separately.',
  organizationName: 'Eloqdb',
  projectName: 'EloqData',
  url: 'http://www.eloqdata.com',
  baseUrl: '/',
  clientModules: [
  ],
  trailingSlash: false, // because trailing slashes can break some existing relative links
  scripts: [
    {
      src: 'https://cdn.jsdelivr.net/npm/focus-visible@5.2.0/dist/focus-visible.min.js',
      defer: true,
    },
    {
      src: 'https://widget.surveymonkey.com/collect/website/js/tRaiETqnLgj758hTBazgd8ryO5qrZo8Exadq9qmt1wtm4_2FdZGEAKHDFEt_2BBlwwM4.js',
      defer: true,
    },
    { src: 'https://snack.expo.dev/embed.js', defer: true },
    {
      src: 'https://www.googletagmanager.com/gtag/js?id=G-1321W6Q1MZ',
      async: true,
    },
    {
      src: 'js/custom-script.js',
      async: true,
    },
  ],
  favicon: 'img/eloqdata_logo.png',
  titleDelimiter: '·',
  customFields: {
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  webpack: {
    jsLoader: isServer => ({
      loader: require.resolve('esbuild-loader'),
      options: {
        loader: 'tsx',
        jsx: 'automatic',
        jsxImportSource: 'react',
        format: isServer ? 'cjs' : undefined,
        target: isServer ? 'node12' : 'es2017',
      },
    }),
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        blog: {
          path: 'blog',
          blogSidebarCount: 'ALL',
          blogSidebarTitle: 'All Blog Posts',
          postsPerPage: 20,
          feedOptions: {
            type: 'all',
            copyright,
          },
        },
        theme: {
          customCss: [
            require.resolve('./src/css/customTheme.scss'),
            require.resolve('./src/css/index.scss'),
            require.resolve('./src/css/showcase.scss'),
            require.resolve('./src/css/versions.scss'),
          ],
        },
        googleAnalytics: {
          trackingID: 'UA-41298772-2',
        },
        gtag: {
          trackingID: 'G-58L13S6BDP',
        },
      }),
    ],
  ],
  plugins: [
    'docusaurus-plugin-sass',
    [
      '@docusaurus/plugin-content-blog',
      {
        id: 'news',
        path: 'newsposts',
        routeBasePath: 'news',
        blogTitle: 'News',
        blogDescription: 'Latest news and announcements from EloqData',
        blogSidebarTitle: 'Recent News',
        blogSidebarCount: 5,
        postsPerPage: 10,
        showReadingTime: true,
        feedOptions: {
          type: 'all',
          copyright,
        },
        blogListComponent: require.resolve(
          './src/components/NewsListPage/index.js'
        ),
        blogPostComponent: require.resolve(
          './src/components/NewsPostPage/index.js'
        ),
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'eloqsql',
        path: 'eloqsql',
        routeBasePath: 'eloqsql',
        sidebarPath: require.resolve('./sidebarsEloqSQL.js'),
        // ... other options
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'eloqkv',
        path: 'eloqkv',
        routeBasePath: 'eloqkv',
        sidebarPath: require.resolve('./sidebarsEloqKV.js'),
        versions: {
          current: {
            label: 'Current',
            path: '',
          },
        },
        lastVersion: 'current',
        // ... other options
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'eloqdoc',
        path: 'eloqdoc',
        routeBasePath: 'eloqdoc',
        sidebarPath: require.resolve('./sidebarsEloqDoc.js'),
        // ... other options
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'eloqcloud',
        path: 'eloqcloud',
        routeBasePath: 'eloqcloud',
        sidebarPath: require.resolve('./sidebarsEloqCloud.js'),
        // ... other options
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'operator',
        path: 'operator',
        routeBasePath: 'operator',
        sidebarPath: require.resolve('./sidebarsOperator.js'),
        // ... other options
      },
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      prism: {
        defaultLanguage: 'jsx',
        theme: require('prism-react-renderer').themes.github,     // light theme
        darkTheme: require('prism-react-renderer').themes.dracula, // optional dark
        additionalLanguages: [
          'java',
          'kotlin',
          'objectivec',
          'swift',
          'groovy',
          'ruby',
          'flow',
        ],
      },
      navbar: {
        title: 'EloqData',
        logo: {
          src: 'img/eloqdata_logo.png',
          alt: 'EloqData',
          style: { width: '150px', height: 'auto' },
        },
        style: 'dark',
        items: [
          // GitHub icon
          {
            href: 'https://github.com/eloqdata',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub repository',
          },
          // Log In link
          {
            href: 'https://cloud.eloqdata.com/login',
            position: 'right',
            className: 'header-login-link',
            label: 'Log In',
          },
          // Sign Up button with orange background
          {
            href: 'https://cloud.eloqdata.com/signup',
            position: 'right',
            className: 'header-signup-link',
            label: 'Sign Up',
          },
          // Main navigation items
          {
            type: 'dropdown',
            label: 'Product',
            position: 'left',
            items: [
              {
                type: 'html',
                value: `
                  <a href="/product/eloqkv" style="display: block; padding: 16px 20px; text-decoration: none; background-color: #1B1B1D; border-bottom: 1px solid rgba(255,255,255,0.1); min-width: 320px;">
                    <div style="display: flex; align-items: center;">
                      <svg width="36" height="36" viewBox="0 0 32 32" fill="none" style="margin-right: 16px; flex-shrink: 0;">
                        <rect width="32" height="32" rx="6" fill="#222" />
                        <path d="M6 10h8v12H6z" fill="#FFFFFF" />
                        <path d="M18 10h8v12h-8z" fill="#FFFFFF" opacity="0.6" />
                        <path d="M14 16h4" stroke="#FFFFFF" stroke-width="2" />
                      </svg>
                      <div style="display: flex; flex-direction: column;">
                        <span style="font-size: 18px; font-weight: 500; color: #FFFFFF; margin: 0 0 4px 0;">EloqKV</span>
                        <span style="font-size: 14px; color: rgba(255,255,255,0.6);">Redis API compatible, transactional, auto tiering</span>
                      </div>
                    </div>
                  </a>
                `,
              },
              {
                type: 'html',
                value: `
                  <a href="/product/eloqdoc" style="display: block; padding: 16px 20px; text-decoration: none; background-color: #1B1B1D; border-bottom: 1px solid rgba(255,255,255,0.1); min-width: 240px;">
                    <div style="display: flex; align-items: center;">
                      <svg width="36" height="36" viewBox="0 0 32 32" fill="none" style="margin-right: 16px; flex-shrink: 0;">
                        <rect width="32" height="32" rx="6" fill="#222" />
                        <path d="M10 8h8l4 4v12H10V8z" stroke="#FFFFFF" stroke-width="2" fill="none" />
                        <path d="M18 8v4h4" stroke="#FFFFFF" stroke-width="2" fill="none" />
                        <path d="M12 14h8M12 18h8M12 22h5" stroke="#FFFFFF" stroke-width="2" />
                      </svg>
                      <div style="display: flex; flex-direction: column;">
                        <span style="font-size: 18px; font-weight: 500; color: #FFFFFF; margin: 0 0 4px 0;">EloqDoc</span>
                        <span style="font-size: 14px; color: rgba(255,255,255,0.6);">MongoDB compatible, decouple compute & storage</span>
                      </div>
                    </div>
                  </a>
                `,
              },
              {
                type: 'html',
                value: `
                  <a href="/product/eloqsql" style="display: block; padding: 16px 20px; text-decoration: none; background-color: #1B1B1D; border-bottom: 1px solid rgba(255,255,255,0.1); min-width: 240px;">
                    <div style="display: flex; align-items: center;">
                      <svg width="36" height="36" viewBox="0 0 32 32" fill="none" style="margin-right: 16px; flex-shrink: 0;">
                        <rect width="32" height="32" rx="6" fill="#222" />
                        <ellipse cx="16" cy="10" rx="8" ry="3" fill="#FFFFFF" opacity="0.8" />
                        <path d="M8 10v8c0 1.5 3.5 3 8 3s8-1.5 8-3v-8" stroke="#FFFFFF" stroke-width="2" fill="none" />
                        <path d="M8 18v4c0 1.5 3.5 3 8 3s8-1.5 8-3v-4" stroke="#FFFFFF" stroke-width="2" fill="none" />
                      </svg>
                      <div style="display: flex; flex-direction: column;">
                        <span style="font-size: 18px; font-weight: 500; color: #FFFFFF; margin: 0 0 4px 0;">EloqSQL</span>
                        <span style="font-size: 14px; color: rgba(255,255,255,0.6);">MySQL API compatible, high perfromance, elastic</span>
                      </div>
                    </div>
                  </a>
                `,
              },
              {
                type: 'html',
                value: `
                  <a href="/product/eloqconvergeddb" style="display: block; padding: 16px 20px; text-decoration: none; background-color: #1B1B1D; border-bottom: 1px solid rgba(255,255,255,0.1); min-width: 340px;">
                    <div style="display: flex; align-items: center;">
                      <svg width="36" height="36" viewBox="0 0 32 32" fill="none" style="margin-right: 16px; flex-shrink: 0;">
                        <rect width="32" height="32" rx="6" fill="#222" />
                        <path d="M8 8v16h16V8H8z" stroke="#FFFFFF" stroke-width="2" fill="none" />
                        <path d="M8 14h16" stroke="#FFFFFF" stroke-width="2" />
                        <path d="M14 8v16" stroke="#FFFFFF" stroke-width="2" />
                        <circle cx="19" cy="19" r="3" stroke="#FFFFFF" stroke-width="2" fill="none" />
                      </svg>
                      <div style="display: flex; flex-direction: column;">
                        <span style="font-size: 18px; font-weight: 500; color: #FFFFFF; margin: 0 0 4px 0;">EloqConvergedDB</span>
                        <span style="font-size: 14px; color: rgba(255,255,255,0.6);">Multi model AI native database</span>
                      </div>
                    </div>
                  </a>
                `,
              },
              {
                type: 'html',
                value: `
                  <a href="https://cloud.eloqdata.com/signup" style="display: block; padding: 16px 20px; text-decoration: none; background-color: #1B1B1D; border-bottom: 1px solid rgba(255,255,255,0.1); min-width: 340px;">
                    <div style="display: flex; align-items: center;">
                      <svg width="36" height="36" viewBox="0 0 32 32" fill="none" style="margin-right: 16px; flex-shrink: 0;">
                        <rect width="32" height="32" rx="6" fill="#222" />
                        <path d="M8 18.5C8 16 10 14 12.5 14c.5-2.5 2.7-4.5 5.5-4.5 3 0 5.4 2.4 5.5 5.4 1.8.3 3 1.8 3 3.6 0 2-1.5 3.5-3.5 3.5h-12C9.5 22 8 20.5 8 18.5z" stroke="#FFFFFF" stroke-width="2" fill="none"/>
                      </svg>
                      <div style="display: flex; flex-direction: column;">
                        <span style="font-size: 18px; font-weight: 500; color: #FFFFFF; margin: 0 0 4px 0;">EloqCloud</span>
                        <span style="font-size: 14px; color: rgba(255,255,255,0.6);">Get Started for Free</span>
                      </div>
                    </div>
                  </a>
                `,
              },
            ],
          },
          {
            type: 'dropdown',
            label: 'Docs',
            position: 'left',
            items: [
              {
                type: 'html',
                value: `
                  <a href="/eloqkv/install-from-binary" style="display: block; padding: 16px 20px; text-decoration: none; background-color: #1B1B1D; border-bottom: 1px solid rgba(255,255,255,0.1); min-width: 320px;">
                    <div style="display: flex; align-items: center;">
                      <svg width="36" height="36" viewBox="0 0 32 32" fill="none" style="margin-right: 16px; flex-shrink: 0;">
                        <rect width="32" height="32" rx="6" fill="#222" />
                        <path d="M6 10h8v12H6z" fill="#FFFFFF" />
                        <path d="M18 10h8v12h-8z" fill="#FFFFFF" opacity="0.6" />
                        <path d="M14 16h4" stroke="#FFFFFF" stroke-width="2" />
                      </svg>
                      <div style="display: flex; flex-direction: column;">
                        <span style="font-size: 18px; font-weight: 500; color: #FFFFFF; margin: 0 0 4px 0;">EloqKV</span>
                        <span style="font-size: 14px; color: rgba(255,255,255,0.6);">Introduction, quick start</span>
                      </div>
                    </div>
                  </a>
                `,
              },
              {
                type: 'html',
                value: `
                  <a href="/eloqdoc/install-from-binary" style="display: block; padding: 16px 20px; text-decoration: none; background-color: #1B1B1D; border-bottom: 1px solid rgba(255,255,255,0.1); min-width: 240px;">
                    <div style="display: flex; align-items: center;">
                      <svg width="36" height="36" viewBox="0 0 32 32" fill="none" style="margin-right: 16px; flex-shrink: 0;">
                        <rect width="32" height="32" rx="6" fill="#222" />
                        <path d="M10 8h8l4 4v12H10V8z" stroke="#FFFFFF" stroke-width="2" fill="none" />
                        <path d="M18 8v4h4" stroke="#FFFFFF" stroke-width="2" fill="none" />
                        <path d="M12 14h8M12 18h8M12 22h5" stroke="#FFFFFF" stroke-width="2" />
                      </svg>
                      <div style="display: flex; flex-direction: column;">
                        <span style="font-size: 18px; font-weight: 500; color: #FFFFFF; margin: 0 0 4px 0;">EloqDoc</span>
                        <span style="font-size: 14px; color: rgba(255,255,255,0.6);">Quick start</span>
                      </div>
                    </div>
                  </a>
                `,
              },
              {
                type: 'html',
                value: `
                  <a href="/eloqsql/introduction" style="display: block; padding: 16px 20px; text-decoration: none; background-color: #1B1B1D; border-bottom: 1px solid rgba(255,255,255,0.1); min-width: 240px;">
                    <div style="display: flex; align-items: center;">
                      <svg width="36" height="36" viewBox="0 0 32 32" fill="none" style="margin-right: 16px; flex-shrink: 0;">
                        <rect width="32" height="32" rx="6" fill="#222" />
                        <ellipse cx="16" cy="10" rx="8" ry="3" fill="#FFFFFF" opacity="0.8" />
                        <path d="M8 10v8c0 1.5 3.5 3 8 3s8-1.5 8-3v-8" stroke="#FFFFFF" stroke-width="2" fill="none" />
                        <path d="M8 18v4c0 1.5 3.5 3 8 3s8-1.5 8-3v-4" stroke="#FFFFFF" stroke-width="2" fill="none" />
                      </svg>
                      <div style="display: flex; flex-direction: column;">
                        <span style="font-size: 18px; font-weight: 500; color: #FFFFFF; margin: 0 0 4px 0;">EloqSQL</span>
                        <span style="font-size: 14px; color: rgba(255,255,255,0.6);">Deploy cluster, data migration</span>
                      </div>
                    </div>
                  </a>
                `,
              },
              {
                type: 'html',
                value: `
                  <a href="/eloqcloud/quick-start" style="display: block; padding: 16px 20px; text-decoration: none; background-color: #1B1B1D; border-bottom: 1px solid rgba(255,255,255,0.1); min-width: 320px;">
                    <div style="display: flex; align-items: center;">
                      <svg width="36" height="36" viewBox="0 0 32 32" fill="none" style="margin-right: 16px; flex-shrink: 0;">
                        <rect width="32" height="32" rx="6" fill="#222" />
                        <path d="M8 18.5C8 16 10 14 12.5 14c.5-2.5 2.7-4.5 5.5-4.5 3 0 5.4 2.4 5.5 5.4 1.8.3 3 1.8 3 3.6 0 2-1.5 3.5-3.5 3.5h-12C9.5 22 8 20.5 8 18.5z" stroke="#FFFFFF" stroke-width="2" fill="none"/>
                      </svg>
                      <div style="display: flex; flex-direction: column;">
                        <span style="font-size: 18px; font-weight: 500; color: #FFFFFF; margin: 0 0 4px 0;">EloqCloud</span>
                        <span style="font-size: 14px; color: rgba(255,255,255,0.6);">Quick start guide</span>
                      </div>
                    </div>
                  </a>
                `,
              },
              {
                type: 'html',
                value: `
                  <a href="/operator/introduction" style="display: block; padding: 16px 20px; text-decoration: none; background-color: #1B1B1D; border-bottom: 1px solid rgba(255,255,255,0.1); min-width: 320px;">
                    <div style="display: flex; align-items: center;">
                      <svg width="36" height="36" viewBox="0 0 32 32" fill="none" style="margin-right: 16px; flex-shrink: 0;">
                        <rect width="32" height="32" rx="6" fill="#222" />
                        <path d="M16 6l-4 4h8l-4-4z" fill="#FFFFFF" opacity="0.8" />
                        <rect x="12" y="10" width="8" height="8" stroke="#FFFFFF" stroke-width="2" fill="none" />
                        <path d="M12 22h8M14 18v4M18 18v4" stroke="#FFFFFF" stroke-width="2" />
                        <circle cx="9" cy="14" r="2" stroke="#FFFFFF" stroke-width="1.5" fill="none" />
                        <circle cx="23" cy="14" r="2" stroke="#FFFFFF" stroke-width="1.5" fill="none" />
                      </svg>
                      <div style="display: flex; flex-direction: column;">
                        <span style="font-size: 18px; font-weight: 500; color: #FFFFFF; margin: 0 0 4px 0;">Eloq Operator</span>
                        <span style="font-size: 14px; color: rgba(255,255,255,0.6);">Deploy on Kubernetes</span>
                      </div>
                    </div>
                  </a>
                `,
              },
            ],
          },
          {
            type: 'dropdown',
            label: 'Learn',
            position: 'left',
            items: [
              {
                type: 'html',
                value: `
                  <a href="/blog" style="display: block; padding: 16px 20px; text-decoration: none; background-color: #1B1B1D; border-bottom: 1px solid rgba(255,255,255,0.1); min-width: 320px;">
                    <div style="display: flex; align-items: center;">
                      <svg width="36" height="36" viewBox="0 0 32 32" fill="none" style="margin-right: 16px; flex-shrink: 0;">
                        <rect width="32" height="32" rx="6" fill="#222" />
                        <path d="M8 8h16v4H8zM8 14h16v2H8zM8 18h12v2H8z" fill="#FFFFFF" />
                      </svg>
                      <div style="display: flex; flex-direction: column;">
                        <span style="font-size: 18px; font-weight: 500; color: #FFFFFF; margin: 0 0 4px 0;">Blog</span>
                        <span style="font-size: 14px; color: rgba(255,255,255,0.6);">Insights from EloqData</span>
                      </div>
                    </div>
                  </a>
                `,
              },
              {
                type: 'html',
                value: `
                  <a href="/news" style="display: block; padding: 16px 20px; text-decoration: none; background-color: #1B1B1D; border-bottom: 1px solid rgba(255,255,255,0.1); min-width: 240px;">
                    <div style="display: flex; align-items: center;">
                      <svg width="36" height="36" viewBox="0 0 32 32" fill="none" style="margin-right: 16px; flex-shrink: 0;">
                        <rect width="32" height="32" rx="6" fill="#222" />
                        <path d="M24 8H8v16h16V8z" stroke="#FFFFFF" stroke-width="2" fill="none" />
                        <path d="M12 12h8M12 16h8M12 20h4" stroke="#FFFFFF" stroke-width="2" />
                      </svg>
                      <div style="display: flex; flex-direction: column;">
                        <span style="font-size: 18px; font-weight: 500; color: #FFFFFF; margin: 0 0 4px 0;">News</span>
                        <span style="font-size: 14px; color: rgba(255,255,255,0.6);">Get latest updates</span>
                      </div>
                    </div>
                  </a>
                `,
              },
            ],
          },
          {
            to: '/pricing',
            label: 'Pricing',
            position: 'left',
          },
          {
            type: 'dropdown',
            label: 'Download',
            position: 'left',
            items: [
              {
                type: 'html',
                value: `
                  <a href="/download" style="display: block; padding: 16px 20px; text-decoration: none; background-color: #1B1B1D; border-bottom: 1px solid rgba(255,255,255,0.1); min-width: 320px;">
                    <div style="display: flex; align-items: center;">
                      <svg width="36" height="36" viewBox="0 0 32 32" fill="none" style="margin-right: 16px; flex-shrink: 0;">
                        <rect width="32" height="32" rx="6" fill="#222" />
                        <ellipse cx="16" cy="10" rx="8" ry="3" fill="#FFFFFF" opacity="0.8" />
                        <path d="M8 10v8c0 1.5 3.5 3 8 3s8-1.5 8-3v-8" stroke="#FFFFFF" stroke-width="2" fill="none" />
                        <path d="M8 18v4c0 1.5 3.5 3 8 3s8-1.5 8-3v-4" stroke="#FFFFFF" stroke-width="2" fill="none" />
                      </svg>
                      <div style="display: flex; flex-direction: column;">
                        <span style="font-size: 18px; font-weight: 500; color: #FFFFFF; margin: 0 0 4px 0;">Eloq Database</span>
                        <span style="font-size: 14px; color: rgba(255,255,255,0.6);">Download EloqKV, EloqDoc and EloqSQL</span>
                      </div>
                    </div>
                  </a>
                `,
              },
              {
                type: 'html',
                value: `
                  <a href="/downloadeloqctl" style="display: block; padding: 16px 20px; text-decoration: none; background-color: #1B1B1D; border-bottom: 1px solid rgba(255,255,255,0.1); min-width: 320px;">
                    <div style="display: flex; align-items: center;">
                      <svg width="36" height="36" viewBox="0 0 32 32" fill="none" style="margin-right: 16px; flex-shrink: 0;">
                        <rect width="32" height="32" rx="6" fill="#222" />
                        <path d="M8 16a8 8 0 1 1 16 0 8 8 0 0 1-16 0z" stroke="#FFFFFF" stroke-width="2" fill="none" />
                        <path d="M16 12v8M12 16h8" stroke="#FFFFFF" stroke-width="2" />
                      </svg>
                      <div style="display: flex; flex-direction: column;">
                        <span style="font-size: 18px; font-weight: 500; color: #FFFFFF; margin: 0 0 4px 0;">EloqCtl</span>
                        <span style="font-size: 14px; color: rgba(255,255,255,0.6);">One stop cluster deployment and management tool</span>
                      </div>
                    </div>
                  </a>
                `,
              },
              {
                type: 'html',
                value: `
                  <a href="/product-comparison" style="display: block; padding: 16px 20px; text-decoration: none; background-color: #1B1B1D; min-width: 320px;">
                    <div style="display: flex; align-items: center;">
                      <svg width="36" height="36" viewBox="0 0 32 32" fill="none" style="margin-right: 16px; flex-shrink: 0;">
                        <rect width="32" height="32" rx="6" fill="#222" />
                        <path d="M8 8h16v16H8z" stroke="#FFFFFF" stroke-width="2" fill="none" />
                        <path d="M8 12h16M8 16h16M8 20h12" stroke="#FFFFFF" stroke-width="2" />
                      </svg>
                      <div style="display: flex; flex-direction: column;">
                        <span style="font-size: 18px; font-weight: 500; color: #FFFFFF; margin: 0 0 4px 0;">Product Comparison</span>
                        <span style="font-size: 14px; color: rgba(255,255,255,0.6);">Open Source vs Enterprise vs Cloud</span>
                      </div>
                    </div>
                  </a>
                `,
              },
            ],
          },
          {
            type: 'dropdown',
            label: 'Company',
            position: 'left',
            items: [
              {
                type: 'html',
                value: `
                  <a href="/aboutus" style="display: block; padding: 16px 20px; text-decoration: none; background-color: #1B1B1D; border-bottom: 1px solid rgba(255,255,255,0.1); min-width: 240px;">
                    <div style="display: flex; align-items: center;">
                      <svg width="36" height="36" viewBox="0 0 32 32" fill="none" style="margin-right: 16px; flex-shrink: 0;">
                        <rect width="32" height="32" rx="6" fill="#222" />
                        <path d="M16 8c-4.4 0-8 3.6-8 8v8h16v-8c0-4.4-3.6-8-8-8z" stroke="#FFFFFF" stroke-width="2" fill="none" />
                        <circle cx="16" cy="12" r="2" fill="#FFFFFF" />
                      </svg>
                      <span style="font-size: 18px; font-weight: 500; color: #FFFFFF; margin: 0;">About Us</span>
                    </div>
                  </a>
                `,
              },
              {
                type: 'html',
                value: `
                  <a href="/contact" style="display: block; padding: 16px 20px; text-decoration: none; background-color: #1B1B1D; min-width: 240px;">
                    <div style="display: flex; align-items: center;">
                      <svg width="36" height="36" viewBox="0 0 32 32" fill="none" style="margin-right: 16px; flex-shrink: 0;">
                        <rect width="32" height="32" rx="6" fill="#222" />
                        <path d="M8 10h16v12H8z" stroke="#FFFFFF" stroke-width="2" fill="none" />
                        <path d="M8 10l8 6 8-6" stroke="#FFFFFF" stroke-width="2" fill="none" />
                      </svg>
                      <span style="font-size: 18px; font-weight: 500; color: #FFFFFF; margin: 0;">Contact Us</span>
                    </div>
                  </a>
                `,
              },
            ],
          },
        ],
      },
      image: 'img/eloqdata_logo.png',
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Document',
                to: '/eloqkv/introduction',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/eloqdb',
              },
              {
                label: 'Discord',
                href: 'https://discord.gg/nmYjBkfak6',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
            ],
          },
        ],
        logo: {
          alt: 'EloqData Logo',
          src: 'img/eloqdata_logo.png',
          href: 'https://www.eloqdata.com/',
        },
        copyright: `${copyright}<br/>${trademark}`,
      },
      metadata: [
        {
          property: 'og:image',
          content: 'https://www.eloqdata.com/eloqdata_logo.png',
        },
        { name: 'twitter:card', content: 'summary_large_image' },
        {
          name: 'twitter:image',
          content: 'https://www.eloqdata.com/eloqdata_logo.png',
        },
        { name: 'twitter:site', content: '@reactnative' },
      ],
    }),
};
