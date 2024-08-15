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
  onBrokenLinks: 'throw',
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
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          //         editUrl:
          //           'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
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
        // TODO: GA is deprecated, remove once we're sure data is streaming in GA4 via gtag.
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
            label: 'Documentation',
            position: 'right',
            href: '#',
            items: [
              {
                label: 'Introduction',
                type: 'doc',
                docsPluginId: 'eloqkv',
                docId: 'introduction',
              },
              {
                label: 'Get Started',
                type: 'doc',
                docsPluginId: 'eloqkv',
                docId: 'install-from-binary',
              },
              {
                label: 'Deploy Cluster',
                type: 'doc',
                docsPluginId: 'eloqkv',
                docId: 'quick-start',
              },
              {
                label: 'Command Reference',
                type: 'doc',
                docsPluginId: 'eloqkv',
                docId: 'list/LINDEX',
              },
            ],
          },
          {
            to: '/blog',
            label: 'Blog',
            position: 'right',
          },
          {
            label: 'Download',
            type: 'dropdown',
            position: 'right',
            items: [
              {
                label: 'EloqKV',
                to: '/download',
              },
              {
                label: 'Eloqctl',
                to: '/downloadeloqctl',
              },
            ],
          },
          {
            label: 'Company',
            type: 'dropdown',
            position: 'right',
            items: [
              {
                label: 'About Us',
                to: '/aboutus',
              },
              {
                label: 'Contact Us',
                to: '/contact',
              },
            ],
          },
        ],
      },
      image: 'img/logo-og.png',
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
                href: 'https://discord.gg/ERYgSgkB',
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
          content: 'https://reactnative.dev/img/logo-og.png',
        },
        {name: 'twitter:card', content: 'summary_large_image'},
        {
          name: 'twitter:image',
          content: 'https://reactnative.dev/img/logo-og.png',
        },
        {name: 'twitter:site', content: '@reactnative'},
      ],
    }),
};
