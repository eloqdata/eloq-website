// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'MonographDB: Next Generation Multi-model Database',
  tagline: 'Data Substate powered modular database which enables vertical and horizontal expanding of the decoupled components: compute, memory, storange and log separately.',
  favicon: 'img/monosql_logo.png',

  // Set the production url of your site here
  //url: 'https://your-docusaurus-test-site.com',
  url: 'https://monographdata.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'MonographDB', // Usually your GitHub org/user name.
  projectName: 'MonographDB', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  themes: [
      "@docusaurus/theme-live-codeblock",
],
scripts: [
      "https://kit.fontawesome.com/307bcbc229.js",
      "https://s7.addthis.com/js/300/addthis_widget.js#pubid=ra-629de96c243ef6ee",
      "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js",
      // Google AdSense:
      // {
      //   src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6230468888789445',
      //   async: true,
      //   crossorigin: 'anonymous',
      // },
      // TrustedSite:
      {
        src: 'https://cdn.ywxi.net/js/1.js',
        async: true,
      },
      // Chirpy
      // {
      //   src: "https://chirpy.dev/bootstrap/comment.js",
      //   defer: true,
      //   'data-chirpy-domain': "complabs.in",
      //   'data-chirpy-theme': "system",
      // },
    ],
headTags: [
      // {
      //   tagName: 'script',
      //   attributes: {
      //     defer: 'true',
      //     src: 'https://chirpy.dev/bootstrap/comment.js',
      //   },
      // },
      // {
      //   tagName: 'script',
      //   attributes: {
      //     async: 'true',
      //     src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6230468888789445',
      //     crossorigin: 'anonymous',
      //   },
      // },
      {
        tagName: 'script',
        attributes: {
          async: 'true',
          src: 'https://cdn.headwayapp.co/widget.js',
        },
      },
      {
        tagName: 'script',
        attributes: {
          content: '!function(w,d,i,s){function l(){if(!d.getElementById(i)){var f=d.getElementsByTagName(s)[0],e=d.createElement(s);e.type="text/javascript",e.async=!0,e.src="https://canny.io/sdk.js",f.parentNode.insertBefore(e,f)}}if("function"!=typeof w.Canny){var c=function(){c.q.push(arguments)};c.q=[],w.Canny=c,"complete"===d.readyState?l():w.attachEvent?w.attachEvent("onload",l):w.addEventListener("load",l,!1)}}(window,document,"canny-jssdk","script");'
        }
      },
      {
        tagName: 'script',
        attributes: {
          content: "Canny('initChangelog', {appID: '62777bd9b9aa4552a064cab2',position: 'bottom',align: 'left',theme: 'auto',});"
        }
      },
    ],

 stylesheets: [
      // String format.
      'https://docusaurus.io/style.css',
      // Object format.
      {
        href: '/apple-touch-icon-180x180.png',
        rel: 'apple-touch-icon',
        sizes: '180x180',
      },
      {
        href: '/favicon-32x32.png',
        rel: 'icon',
        sizes: '32x32',
      },
      {
        href: '/favicon-16x16.png',
        rel: 'icon',
        sizes: '16x16',
      },
      {
        href: '/site.webmanifest',
        rel: 'manifest',
      },
      {
        href: '/safari-pinned-tab.svg',
        rel: 'mask-icon',
        color: '#5bbad5',
      },
    ],

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
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
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
 //         editUrl:
 //           'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  plugins: [
	 async function myPlugin(context, options) {
        return {
          name: "docusaurus-tailwindcss",
          configurePostCss(postcssOptions) {
            // Appends TailwindCSS and AutoPrefixer.
            postcssOptions.plugins.push(require("tailwindcss"));
            postcssOptions.plugins.push(require("autoprefixer"));
            return postcssOptions;
          },
        };
      }, 
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'monographdb',
        path: 'monographdb',
        routeBasePath: 'monograpdb',
        sidebarPath: require.resolve('./sidebarsMonographdb.js'),
        // ... other options
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/monosql_logo.png',
      navbar: {
        title: 'MonographDB',
        logo: {
          alt: 'My Site Logo',
          src: 'img/monosql_logo.png',
        },

        items: [
          /*{
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Document',
          },*/
          {
          label: "Documentation",
          position: "left",
          href: "#",
          items: [
            {
              label: "MonoSQL",
	      type: 'doc',
              docId: "monosql-introduction",
            },
            {
              label: "MonographDB",
              type: "doc",
              docsPluginId: "monographdb",
	      docId: "quick-start",
            },
          ],
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {to: '/contact', label: 'Contact Us', position: 'left'},
          
      /**    {
            href: 'https://github.com/monographdb',
            label: 'GitHub',
            position: 'right',
          },*/
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Document',
                to: '/docs/monosql-introduction',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/monographdb',
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
//              {
//                label: 'GitHub',
//                href: 'https://github.com/facebook/docusaurus',
//              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} MonographDB, Inc.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
