/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const users = require('./showcase.json');
//const versions = require('./versions.json');

//const lastVersion = versions[0];
const copyright = `Copyright © ${new Date().getFullYear()} EloqData Inc.`;

const commonDocsOptions = {
  breadcrumbs: false,
  showLastUpdateAuthor: false,
  showLastUpdateTime: true,
  editUrl:
    'https://github.com/facebook/react-native-website/blob/main/website/',
  remarkPlugins: [require('@react-native-website/remark-snackplayer')],
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
    require.resolve('./modules/snackPlayerInitializer.js'),
    require.resolve('./modules/jumpToFragment.js'),
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
    {src: 'https://snack.expo.dev/embed.js', defer: true},
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
    users,
    facebookAppId: '1677033832619985',
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
        id: 'indocs',
        path: 'indocs',
        routeBasePath: 'indocs',
        sidebarPath: require.resolve('./sidebarsindocs.js'),
        // ... other options
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'eloqsqlcn',
        path: 'eloqsqlcn',
        routeBasePath: 'eloqsqlcn',
        sidebarPath: require.resolve('./sidebarsEloqSQLcn.js'),
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
        id: 'monosqlcn',
        path: 'monosqlcn',
        routeBasePath: 'monosqlcn',
        sidebarPath: require.resolve('./sidebarsMonoSQLcn.js'),
        // ... other options
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'monorpc',
        path: 'monorpc',
        routeBasePath: 'monorpc',
        sidebarPath: require.resolve('./sidebarsMonorpc.js'),
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
        theme: require('./core/PrismTheme'),
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
          style: {width: '150px', height: 'auto'}, // Adjust width as needed
        },
        style: 'dark',
        items: [
          {
            href: 'https://github.com/eloqdata',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub repository',
          },
          // Product Navbar
          {
            type: 'dropdown',
            label: 'Product',
            position: 'right',
            items: [
              {
                type: 'html',
                value: `
                  <a href="/product/eloqkv" style="display: block; padding: 16px 20px; text-decoration: none; background-color: #1B1B1D; border-bottom: 1px solid rgba(255,255,255,0.1); min-width: 320px;">
                    <div style="display: flex; align-items: center;">
                      <svg width="36" height="36" viewBox="0 0 32 32" fill="none" style="margin-right: 16px; flex-shrink: 0;">
                        <rect width="32" height="32" rx="6" fill="#222" />
                        <path d="M24 16.5l-8 4.5-8-4.5L16 12l8 4.5z" fill="#FFFFFF" />
                      </svg>
                      <div style="display: flex; flex-direction: column;">
                        <span style="font-size: 18px; font-weight: 500; color: #FFFFFF; margin: 0 0 4px 0;">EloqKV</span>
                        <span style="font-size: 14px; color: rgba(255,255,255,0.6);">Redis compatible, transactional, auto tiering</span>
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
                        <span style="font-size: 14px; color: rgba(255,255,255,0.6);">MySQL compatible, high perfromance, elastic</span>
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
                  <a href="/contact" style="display: block; padding: 16px 20px; text-decoration: none; background-color: #1B1B1D; border-bottom: 1px solid rgba(255,255,255,0.1); min-width: 340px;">
                    <div style="display: flex; align-items: center;">
                      <svg width="36" height="36" viewBox="0 0 32 32" fill="none" style="margin-right: 16px; flex-shrink: 0;">
                        <rect width="32" height="32" rx="6" fill="#222" />
                        <path d="M8 20c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="#FFFFFF" stroke-width="2" fill="none" />
                        <path d="M10 24l6-6 6 6" stroke="#FFFFFF" stroke-width="2" fill="none" />
                        <path d="M16 8v10" stroke="#FFFFFF" stroke-width="2" />
                      </svg>
                      <div style="display: flex; flex-direction: column;">
                        <span style="font-size: 18px; font-weight: 500; color: #FFFFFF; margin: 0 0 4px 0;">EloqCloud</span>
                        <span style="font-size: 14px; color: rgba(255,255,255,0.6);">Apply to Join</span>
                      </div>
                    </div>
                  </a>
                `,
              },
            ],
          },

          // Docs Navbar
          {
            type: 'dropdown',
            label: 'Docs',
            position: 'right',
            items: [
              {
                type: 'html',
                value: `
                  <a href="/eloqkv/introduction" style="display: block; padding: 16px 20px; text-decoration: none; background-color: #1B1B1D; border-bottom: 1px solid rgba(255,255,255,0.1); min-width: 320px;">
                    <div style="display: flex; align-items: center;">
                      <svg width="36" height="36" viewBox="0 0 32 32" fill="none" style="margin-right: 16px; flex-shrink: 0;">
                        <rect width="32" height="32" rx="6" fill="#222" />
                        <path d="M24 16.5l-8 4.5-8-4.5L16 12l8 4.5z" fill="#FFFFFF" />
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
            ],
          },

          // Learn Navbar
          {
            type: 'dropdown',
            label: 'Learn',
            position: 'right',
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
              {
                type: 'html',
                value: `
                  <a href="https://eloqdata.discourse.group/" style="display: block; padding: 16px 20px; text-decoration: none; background-color: #1B1B1D; border-bottom: 1px solid rgba(255,255,255,0.1); min-width: 240px;">
                    <div style="display: flex; align-items: center;">
                      <svg width="36" height="36" viewBox="0 0 32 32" fill="none" style="margin-right: 16px; flex-shrink: 0;">
                        <rect width="32" height="32" rx="6" fill="#222" />
                        <path d="M6 10h20v12H16l-6 4v-4H6V10z" stroke="#FFFFFF" stroke-width="2" fill="none" />
                        <path d="M11 16h2M15 16h2M19 16h2" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" />
                      </svg>
                      <div style="display: flex; flex-direction: column;">
                        <span style="font-size: 18px; font-weight: 500; color: #FFFFFF; margin: 0 0 4px 0;">Forum</span>
                        <span style="font-size: 14px; color: rgba(255,255,255,0.6);">Discuss with community</span>
                      </div>
                    </div>
                  </a>
                `,
              },
            ],
          },

          // Download Navbar
          {
            type: 'dropdown',
            label: 'Download',
            position: 'right',
            items: [
              {
                type: 'html',
                value: `
                  <a href="/download/eloqkv" style="display: block; padding: 16px 20px; text-decoration: none; background-color: #1B1B1D; border-bottom: 1px solid rgba(255,255,255,0.1); min-width: 320px;">
                    <div style="display: flex; align-items: center;">
                      <svg width="36" height="36" viewBox="0 0 32 32" fill="none" style="margin-right: 16px; flex-shrink: 0;">
                        <rect width="32" height="32" rx="6" fill="#222" />
                        <path d="M24 16.5l-8 4.5-8-4.5L16 12l8 4.5z" fill="#FFFFFF" />
                      </svg>
                      <div style="display: flex; flex-direction: column;">
                        <span style="font-size: 18px; font-weight: 500; color: #FFFFFF; margin: 0 0 4px 0;">EloqKV</span>
                        <span style="font-size: 14px; color: rgba(255,255,255,0.6);">Redis compatible Key-Value database</span>
                      </div>
                    </div>
                  </a>
                `,
              },
              {
                type: 'html',
                value: `
                  <a href="/download/eloqsql" style="display: block; padding: 16px 20px; text-decoration: none; background-color: #1B1B1D; border-bottom: 1px solid rgba(255,255,255,0.1); min-width: 240px;">
                    <div style="display: flex; align-items: center;">
                      <svg width="36" height="36" viewBox="0 0 32 32" fill="none" style="margin-right: 16px; flex-shrink: 0;">
                        <rect width="32" height="32" rx="6" fill="#222" />
                        <ellipse cx="16" cy="10" rx="8" ry="3" fill="#FFFFFF" opacity="0.8" />
                        <path d="M8 10v8c0 1.5 3.5 3 8 3s8-1.5 8-3v-8" stroke="#FFFFFF" stroke-width="2" fill="none" />
                        <path d="M8 18v4c0 1.5 3.5 3 8 3s8-1.5 8-3v-4" stroke="#FFFFFF" stroke-width="2" fill="none" />
                      </svg>
                      <div style="display: flex; flex-direction: column;">
                        <span style="font-size: 18px; font-weight: 500; color: #FFFFFF; margin: 0 0 4px 0;">EloqSQL <sup style="font-size:12px">preview</sup></span>
                        <span style="font-size: 14px; color: rgba(255,255,255,0.6);">MySQL compatible RDBMS</span>
                      </div>
                    </div>
                  </a>
                `,
              },
              {
                type: 'html',
                value: `
                  <a href="/download/eloqdoc" style="display: block; padding: 16px 20px; text-decoration: none; background-color: #1B1B1D; border-bottom: 1px solid rgba(255,255,255,0.1); min-width: 240px;">
                    <div style="display: flex; align-items: center;">
                      <svg width="36" height="36" viewBox="0 0 32 32" fill="none" style="margin-right: 16px; flex-shrink: 0;">
                        <rect width="32" height="32" rx="6" fill="#222" />
                        <path d="M10 8h8l4 4v12H10V8z" stroke="#FFFFFF" stroke-width="2" fill="none" />
                        <path d="M18 8v4h4" stroke="#FFFFFF" stroke-width="2" fill="none" />
                        <path d="M12 14h8M12 18h8M12 22h5" stroke="#FFFFFF" stroke-width="2" />
                      </svg>
                      <div style="display: flex; flex-direction: column;">
                        <span style="font-size: 18px; font-weight: 500; color: #FFFFFF; margin: 0 0 4px 0;">EloqDoc <sup style="font-size:12px">preview</sup></span>
                        <span style="font-size: 14px; color: rgba(255,255,255,0.6);">MongoDB compatible JSON database</span>
                      </div>
                    </div>
                  </a>
                `,
              },
              {
                type: 'html',
                value: `
                  <a href="/downloadeloqctl" style="display: block; padding: 16px 20px; text-decoration: none; background-color: #1B1B1D; border-bottom: 1px solid rgba(255,255,255,0.1); min-width: 240px;">
                    <div style="display: flex; align-items: center;">
                      <svg width="36" height="36" viewBox="0 0 32 32" fill="none" style="margin-right: 16px; flex-shrink: 0;">
                        <rect width="32" height="32" rx="6" fill="#222" />
                        <path d="M8 16a8 8 0 1 1 16 0 8 8 0 0 1-16 0z" stroke="#FFFFFF" stroke-width="2" fill="none" />
                        <path d="M16 12v8M12 16h8" stroke="#FFFFFF" stroke-width="2" />
                      </svg>
                      <div style="display: flex; flex-direction: column;">
                        <span style="font-size: 18px; font-weight: 500; color: #FFFFFF; margin: 0 0 4px 0;">EloqCtl <sup style="font-size:12px">preview</sup></span>
                        <span style="font-size: 14px; color: rgba(255,255,255,0.6);">One stop cluster deployment and management tool</span>
                      </div>
                    </div>
                  </a>
                `,
              },
            ],
          },

          // Company Navbar - Fixed size
          {
            type: 'dropdown',
            label: 'Company',
            position: 'right',
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
        copyright,
      },
      metadata: [
        {
          property: 'og:image',
          content: 'https://www.eloqdata.com/eloqdata_logo.png',
        },
        {name: 'twitter:card', content: 'summary_large_image'},
        {
          name: 'twitter:image',
          content: 'https://www.eloqdata.com/eloqdata_logo.png',
        },
        {name: 'twitter:site', content: '@reactnative'},
      ],
    }),
};
