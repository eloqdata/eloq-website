/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
    // By default, Docusaurus generates a sidebar from the docs folder structure
    operator: [
        {
            type: 'category',
            label: 'Introduction',
            collapsible: true,
            collapsed: false,
            items: [
                {
                    type: 'doc',
                    id: 'introduction',
                    label: 'Overview',
                },
            ],
        },
        {
            type: 'category',
            label: 'Install',
            collapsible: true,
            collapsed: false,
            items: [
                {
                    type: 'doc',
                    id: 'install/aws',
                    label: 'Install on AWS',
                },
                {
                    type: 'doc',
                    id: 'install/gcp',
                    label: 'Install on Google Cloud',
                },
                {
                    type: 'doc',
                    id: 'install/baidu',
                    label: 'Install on Baidu CCE',
                },
            ],
        },
        {
            type: 'category',
            label: 'Usage',
            collapsible: true,
            collapsed: false,
            items: [
                {
                    type: 'doc',
                    id: 'usage/template',
                    label: 'EloqDBClusterTemplate',
                },
                {
                    type: 'doc',
                    id: 'usage/claim',
                    label: 'EloqDBClusterClaim',
                },
                {
                    type: 'doc',
                    id: 'usage/cluster',
                    label: 'EloqDBCluster',
                },
            ],
        },
    ],
};

module.exports = sidebars;
