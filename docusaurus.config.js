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

const navbar = require('./config/navbar');
const footer = require('./config/footer');
const headTags = require('./config/headTags');

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
    { src: 'https://snack.expo.dev/embed.js', defer: true },
  ],
  headTags,
  favicon: 'img/eloqdata_logo.png',
  titleDelimiter: '·',
  customFields: {
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  onBrokenLinks: 'warn',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  future: {
    experimental_faster: {
      swcJsLoader: true,
      swcJsMinimizer: true,
      swcHtmlMinimizer: true,
      lightningCssMinimizer: true,
      rspackBundler: true,
      mdxCrossCompilerCache: true,
    },
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
        gtag: {
          trackingID: 'G-1321W6Q1MZ',
          anonymizeIP: true,
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
        disableSwitch: false,
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
      navbar: navbar,
      image: 'img/eloqdata_logo.png',
      footer: footer(copyright, trademark),
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
      ],
    }),
};
